"""
🎓 ML Training Pipeline - Intelligent Tutor System
Burkina Faso Educational Context

Handles:
- Dataset preparation from curriculum
- Model training (Correction, Explanation, Recommendation, Error Analysis)
- Model evaluation and versioning
- Deployment and monitoring
"""

import json
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Any
import logging

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.feature_extraction.text import TfidfVectorizer

import pickle
import joblib

from django.db import models
from django.utils import timezone
from django.conf import settings

from .models_ml import MLModelVersion
from apps.courses.models import Course, Lesson, Subject
from apps.users.models import User

logger = logging.getLogger(__name__)

# ============================================================================
# 1. DATA PREPARATION LAYER
# ============================================================================

class DatasetPreparer:
    """Prepares training data from curriculum and student interactions"""
    
    def __init__(self, curriculum_path: str = None):
        self.curriculum_path = curriculum_path or Path(settings.BASE_DIR) / 'data' / 'curriculum'
        self.dataset = pd.DataFrame()
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def load_curriculum_exercises(self) -> pd.DataFrame:
        """
        Load exercises from curriculum and structure for training.
        Prioritizes the Exercise model if it contains data.
        """
        from apps.exercises.models import Exercise
        
        exercises = []
        
        # 1. Try loading from real Exercise model first
        real_exercises = Exercise.objects.select_related('lesson', 'lesson__course', 'lesson__course__subject').all()
        
        if real_exercises.exists():
            for ex in real_exercises:
                exercises.append({
                    'exercise_id': f"ex_{ex.id}",
                    'level': ex.lesson.course.level,
                    'subject': ex.lesson.course.subject.name,
                    'question': ex.question,
                    'correct_answer': ex.correct_answer,
                    'explanation': ex.explanation or ex.lesson.content,
                    'difficulty': ex.get_difficulty_display() if hasattr(ex, 'get_difficulty_display') else ex.difficulty,
                    'curriculum_ref': f"{ex.lesson.course.subject.name}_{ex.lesson.course.level}",
                    'learning_objectives': ex.lesson.course.learning_objectives or [],
                    'context': 'burkina_faso',
                })
        else:
            # 2. Fallback to lesson-based extraction if no real exercises found
            self.logger.info("No real Exercise objects found. Falling back to lesson content parsing...")
            for course in Course.objects.filter(status='published'):
                for lesson in course.lessons.all():
                    exercises.append({
                        'exercise_id': f"gen_{course.id}_{lesson.id}",
                        'level': course.level,
                        'subject': course.subject.name,
                        'question': lesson.title,
                        'correct_answer': self._extract_answer_from_lesson(lesson),
                        'explanation': lesson.content,
                        'difficulty': course.difficulty_level,
                        'curriculum_ref': f"{course.subject.name}_{course.level}",
                        'learning_objectives': course.learning_objectives or [],
                        'context': 'burkina_faso',
                    })
        
        self.dataset = pd.DataFrame(exercises)
        
        # 3. Final fallback for dev demonstration
        if len(self.dataset) == 0:
            self.logger.warning("No data found in DB. Generating dummy data for training demonstration...")
            # ... (dummy data generation remains the same)
            dummy_exercises = []
            subjects = ['math', 'french', 'science', 'history', 'geography']
            levels = ['primary_cp1', 'primary_cp2', 'lycee_tles']
            for i in range(50):
                subj = subjects[i % len(subjects)]
                lvl = levels[i % len(levels)]
                dummy_exercises.append({
                    'exercise_id': f"dummy_{i}",
                    'level': lvl, 'subject': subj,
                    'question': f"Question dummy {i} for {subj}",
                    'correct_answer': f"Answer {i}",
                    'explanation': f"Explanation {i}",
                    'difficulty': 'medium', 'curriculum_ref': f"{subj}_{lvl}",
                    'learning_objectives': [], 'context': 'burkina_faso'
                })
            self.dataset = pd.DataFrame(dummy_exercises)

        self.logger.info(f"Loaded {len(self.dataset)} exercises for training pipeline")
        return self.dataset
    
    def load_student_answers(self) -> pd.DataFrame:
        """
        Load student answer attempts for training correction models
        
        Returns:
            DataFrame with student response data for supervised learning
        """
        from apps.exercises.models import Exercise, ExerciseAttempt
        
        answers_data = []
        
        for answer in ExerciseAttempt.objects.select_related('exercise', 'student').all():
            answers_data.append({
                'answer_id': answer.id,
                'exercise_id': answer.exercise.id,
                'student_id': answer.student.id,
                'student_answer': answer.student_answer,
                'is_correct': answer.is_correct,
                'teacher_feedback': answer.feedback,
                'errors_detected': None, # Not currently tracked in ExerciseAttempt
                'timestamp': answer.started_at,
                'learning_style': answer.student.learning_style if hasattr(answer.student, 'learning_style') else None,
            })
        
        return pd.DataFrame(answers_data)
    
    def generate_synthetic_errors(self, exercises_df: pd.DataFrame, num_variations: int = 5) -> pd.DataFrame:
        """
        Generate common student errors for each exercise
        
        Handles:
        - Calculation errors (off by 1, wrong operator)
        - Spelling variations
        - Common misconceptions in Burkina Faso context
        
        Returns:
            Augmented DataFrame with synthetic error examples
        """
        # Error patterns specific to Burkina Faso curriculum
        error_patterns = {
            'math': [
                lambda x: x.replace('+', '-'),  # Wrong operator
                lambda x: str(int(x) + 1) if x.isdigit() else x,  # Off by one
                lambda x: x + " et quelques",  # Vague answer
                lambda x: str(int(x) * 2) if x.isdigit() else x, # Scaling error
            ],
            'french': [
                lambda x: x.lower(),  # Case error
                lambda x: x.replace('é', 'e').replace('è', 'e').replace('ê', 'e'),  # Accent error
                lambda x: x[:-1] if len(x) > 1 else x,  # Missing letter
                lambda x: x + 's' if not x.endswith('s') else x[:-1], # Plural error
                lambda x: x.replace('qu', 'k'), # Phonetic error
            ],
            'science': [
                lambda x: x.replace('l\'', 'le '),  # Article error
                lambda x: "Je ne sais pas",  # Incomplete answer
                lambda x: "C'est " + x if "est" not in x else x, # Syntax error
            ]
        }
        
        augmented = []
        for idx, row in exercises_df.iterrows():
            subject = row['subject'].lower()

            # Define error types for different subjects
            error_type_mapping = {
                'mathématiques': ['calculation_error', 'logic_error', 'incomplete_answer'],
                'français': ['spelling_error', 'grammar_error', 'conjugation_error'],
                'math': ['calculation_error', 'logic_error', 'incomplete_answer'],
                'french': ['spelling_error', 'grammar_error', 'conjugation_error'],
                'science': ['concept_error', 'incomplete_answer', 'logic_error'],
                'sciences': ['concept_error', 'incomplete_answer', 'logic_error'],
                'histoire': ['fact_error', 'date_error', 'incomplete_answer'],
                'history': ['fact_error', 'date_error', 'incomplete_answer'],
                'géographie': ['location_error', 'fact_error', 'incomplete_answer'],
                'geography': ['location_error', 'fact_error', 'incomplete_answer'],
            }

            error_types = error_type_mapping.get(subject, ['general_error', 'incomplete_answer', 'logic_error'])
            patterns = error_patterns.get(subject, [lambda x: x + " (erreur)"])

            # Generate variations for each error type
            for i, error_type in enumerate(error_types[:num_variations]):
                try:
                    # Create different types of errors
                    if error_type == 'calculation_error':
                        incorrect_answer = str(row['correct_answer']) + " (mauvais calcul)"
                    elif error_type == 'spelling_error':
                        incorrect_answer = str(row['correct_answer']).replace('é', 'e').replace('è', 'e')
                    elif error_type == 'grammar_error':
                        incorrect_answer = str(row['correct_answer']) + " (faute grammaire)"
                    elif error_type == 'logic_error':
                        incorrect_answer = "Je ne sais pas"
                    elif error_type == 'incomplete_answer':
                        incorrect_answer = str(row['correct_answer'])[:len(str(row['correct_answer']))//2] + "..."
                    elif error_type == 'concept_error':
                        incorrect_answer = "C'est faux"
                    elif error_type == 'fact_error':
                        incorrect_answer = str(row['correct_answer']) + " (erreur de fait)"
                    elif error_type == 'date_error':
                        incorrect_answer = str(row['correct_answer']).replace('2024', '2023')
                    elif error_type == 'location_error':
                        incorrect_answer = str(row['correct_answer']) + " (mauvais endroit)"
                    else:
                        incorrect_answer = str(row['correct_answer']) + f" ({error_type})"

                    augmented.append({
                        **row,
                        'student_answer': incorrect_answer,
                        'is_correct': False,
                        'error_type': error_type,
                        'synthetic': True,
                    })
                except Exception as e:
                    self.logger.warning(f"Error generating variation for {error_type}: {e}")
                    pass
            
            # Add correct answer
            augmented.append({
                **row,
                'student_answer': row['correct_answer'],
                'is_correct': True,
                'error_type': None,
                'synthetic': False,
            })
        
        self.logger.info(f"[OK] Generated {len(augmented)} augmented training samples")
        return pd.DataFrame(augmented)
    
    def create_splits(self, data: pd.DataFrame, 
                     train_ratio: float = 0.7,
                     val_ratio: float = 0.15,
                     test_ratio: float = 0.15) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Create train/validation/test splits stratified by curriculum level
        
        Returns:
            Tuple of (train_df, val_df, test_df)
        """
        # Stratify by level to ensure representation - disabled for small/unbalanced datasets
        train, temp = train_test_split(
            data, 
            test_size=(1-train_ratio),
            stratify=None,
            random_state=42
        )
        
        val, test = train_test_split(
            temp,
            test_size=test_ratio/(val_ratio+test_ratio),
            stratify=None,
            random_state=42
        )
        
        self.logger.info(f"[OK] Train: {len(train)}, Val: {len(val)}, Test: {len(test)}")
        return train, val, test
    
    def _extract_answer_from_lesson(self, lesson: Lesson) -> str:
        """Extract correct answer from lesson content"""
        # This is a placeholder - implement based on your lesson structure
        return "See lesson content for answer"


# ============================================================================
# 2. FEATURE ENGINEERING LAYER
# ============================================================================

class FeatureEngineer:
    """Creates features for ML models"""
    
    def __init__(self):
        # Increased features and added basic French stop words
        french_stop_words = [
            'le', 'la', 'les', 'de', 'du', 'des', 'et', 'en', 'un', 'une', 
            'que', 'qui', 'dans', 'sur', 'ce', 'cette', 'ces', 'est', 'sont', 
            'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'pour', 'avec',
            'pas', 'plus', 'un', 'une', 'tout', 'tous', 'fait', 'faire'
        ]
        self.vectorizer = TfidfVectorizer(
            max_features=500, 
            ngram_range=(1, 2),
            stop_words=french_stop_words
        )
        self.scaler = StandardScaler()
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def create_text_features(self, texts: List[str], fit: bool = True) -> np.ndarray:
        """
        Create TF-IDF features from text (questions/answers)
        
        Args:
            texts: List of text strings
            fit: Whether to fit the vectorizer
            
        Returns:
            Feature matrix (n_samples, n_features)
        """
        if fit:
            return self.vectorizer.fit_transform(texts).toarray()
        else:
            return self.vectorizer.transform(texts).toarray()
    
    def create_curriculum_features(self, data: pd.DataFrame) -> np.ndarray:
        """
        Create features from curriculum metadata
        
        Returns:
            Feature matrix including:
            - Level encoding (CP1→1, CP2→2, P3→3, ..., S4→14)
            - Subject encoding
            - Difficulty encoding
        """
        features = []
        
        # Level encoding
        level_map = {
            'primary_cp1': 1, 'primary_cp2': 2, 'primary_p3': 3, 'primary_p4': 4,
            'primary_p5': 5, 'primary_p6': 6,
            'secondary_s1': 7, 'secondary_s2': 8, 'secondary_s3': 9, 'secondary_s4': 10
        }
        
        # Subject encoding
        subject_map = {
            'math': 1, 'french': 2, 'english': 3, 'science': 4,
            'history': 5, 'geography': 6, 'art': 7, 'music': 8, 'pe': 9
        }
        
        # Difficulty encoding
        difficulty_map = {'easy': 1, 'medium': 2, 'hard': 3}
        
        for idx, row in data.iterrows():
            level_code = level_map.get(str(row.get('level', '')), 0)
            subject_code = subject_map.get(str(row.get('subject', '')).lower(), 0)
            difficulty_code = difficulty_map.get(str(row.get('difficulty', 'medium')).lower(), 2)
            
            features.append([level_code, subject_code, difficulty_code])
        
        return np.array(features)
    
    def create_combined_features(self, question: str, answer: str, 
                               metadata: Dict[str, Any]) -> np.ndarray:
        """
        Combine text and curriculum features for prediction
        """
        text_feat = self.vectorizer.transform([f"{question} {answer}"]).toarray()[0]
        curriculum_feat = self.create_curriculum_features(pd.DataFrame([metadata]))[0]
        
        return np.concatenate([text_feat, curriculum_feat])


# ============================================================================
# 3. MODEL TRAINING LAYER
# ============================================================================

class ExerciseCorrectionTrainer:
    """Trains model for exercise correction"""
    
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=250, # Boosted from 100
            max_depth=25,     # Increased from 15
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        )
        self.feature_engineer = FeatureEngineer()
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def prepare_training_data(self, train_df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare X, y for training
        
        Args:
            train_df: Training DataFrame
            
        Returns:
            (X_features, y_labels)
        """
        # Extract features from questions and answers
        texts = train_df['question'] + " " + train_df['student_answer']
        X_text = self.feature_engineer.create_text_features(texts.tolist(), fit=True)
        
        # Extract curriculum features
        X_curriculum = self.feature_engineer.create_curriculum_features(train_df)
        
        # Combine features
        X = np.hstack([X_text, X_curriculum])
        
        # Target: is_correct
        y = train_df['is_correct'].values
        
        self.logger.info(f"[OK] Feature matrix shape: {X.shape}, Class distribution: {np.bincount(y.astype(int))}")
        return X, y
    
    def prepare_validation_data(self, val_df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare validation data using already fitted feature engineer

        Args:
            val_df: Validation DataFrame

        Returns:
            (X_features, y_labels)
        """
        # Debug: check validation data
        self.logger.info(f"Validation data shape: {val_df.shape}")
        self.logger.info(f"Validation columns: {val_df.columns.tolist()}")

        # Extract features from questions and answers (without fitting)
        texts = val_df['question'] + " " + val_df['student_answer']
        self.logger.info(f"Validation texts sample: {texts.iloc[0] if len(texts) > 0 else 'No texts'}")
        X_text = self.feature_engineer.create_text_features(texts.tolist(), fit=False)

        # Extract curriculum features
        X_curriculum = self.feature_engineer.create_curriculum_features(val_df)

        # Combine features
        X = np.hstack([X_text, X_curriculum])

        # Target: is_correct
        y = val_df['is_correct'].values

        self.logger.info(f"[OK] Validation feature matrix shape: {X.shape}, Class distribution: {np.bincount(y.astype(int))}")
        return X, y

    def train(self, train_df: pd.DataFrame, val_df: pd.DataFrame) -> Dict[str, float]:
        """
        Train the correction model

        Returns:
            Dictionary of validation metrics
        """
        self.logger.info("Training Exercise Correction Model...")

        # Prepare training data (this fits the feature engineer)
        X_train, y_train = self.prepare_training_data(train_df)

        # Prepare validation data (using fitted feature engineer)
        X_val, y_val = self.prepare_validation_data(val_df)

        # Train
        self.model.fit(X_train, y_train)

        # Evaluate
        y_pred = self.model.predict(X_val)
        y_proba = self.model.predict_proba(X_val)[:, 1]

        metrics = {
            'accuracy': float(accuracy_score(y_val, y_pred)),
            'precision': float(precision_score(y_val, y_pred, zero_division=0)),
            'recall': float(recall_score(y_val, y_pred, zero_division=0)),
            'f1': float(f1_score(y_val, y_pred, zero_division=0)),
        }

        self.logger.info(f"[OK] Validation Metrics: {metrics}")
        return metrics
    
    def predict(self, question: str, student_answer: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict if an answer is correct
        
        Returns:
            {
                'is_correct': bool,
                'confidence': float (0-1),
                'explanation': str
            }
        """
        # Create features
        texts = question + " " + student_answer
        X_text = self.feature_engineer.vectorizer.transform([texts]).toarray()
        X_curriculum = self.feature_engineer.create_curriculum_features(pd.DataFrame([metadata]))
        X = np.hstack([X_text, X_curriculum])
        
        # Predict
        pred = self.model.predict(X)[0]
        confidence = self.model.predict_proba(X)[0, int(pred)]
        
        return {
            'is_correct': bool(pred),
            'confidence': float(confidence),
            'prediction_timestamp': datetime.now().isoformat(),
        }


class ErrorAnalysisTrainer:
    """Trains model to categorize types of errors"""
    
    def __init__(self):
        self.model = GradientBoostingClassifier(
            n_estimators=150, # Boosted from 100
            learning_rate=0.1,
            max_depth=6,       # Increased from 5
            random_state=42
        )
        self.feature_engineer = FeatureEngineer()
        self.logger = logging.getLogger(self.__class__.__name__)
        
        # Error type classifications
        self.error_types = [
            'calculation_error',
            'comprehension_error',
            'spelling_error',
            'logic_error',
            'incomplete_answer',
            'other'
        ]
    
    def train(self, train_df: pd.DataFrame, val_df: pd.DataFrame) -> Dict[str, float]:
        """Train error classification model"""
        self.logger.info("Training Error Analysis Model...")
        
        # Prepare data
        X_train, y_train = self._prepare_error_training_data(train_df)
        X_val, y_val = self.prepare_validation_data(val_df)
        
        # Train
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_val)
        
        metrics = {
            'accuracy': float(accuracy_score(y_val, y_pred)),
            'precision': float(precision_score(y_val, y_pred, average='weighted', zero_division=0)),
            'recall': float(recall_score(y_val, y_pred, average='weighted', zero_division=0)),
            'f1': float(f1_score(y_val, y_pred, average='weighted', zero_division=0)),
        }
        
        self.logger.info(f"[OK] Error Analysis Metrics: {metrics}")
        return metrics

    def prepare_validation_data(self, val_df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare validation data using already fitted feature engineer"""
        # Use fitted vectorizer for validation
        X = self.feature_engineer.create_text_features(
            (val_df['question'] + " " + val_df['student_answer']).tolist(),
            fit=False
        )

        # Map error types to numeric labels
        y = val_df.get('error_type', 'other').apply(
            lambda x: self.error_types.index(x) if x in self.error_types else 5
        ).values

        return X, y

    def _prepare_error_training_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features for error type classification"""
        # For now, use error_type column if available
        X = self.feature_engineer.create_text_features(
            (df['question'] + " " + df['student_answer']).tolist(),
            fit=True
        )
        
        # Map error types to numeric labels
        y = df.get('error_type', 'other').apply(
            lambda x: self.error_types.index(x) if x in self.error_types else 5
        ).values
        
        return X, y


# ============================================================================
# 4. MODEL PERSISTENCE & VERSIONING
# ============================================================================

class ModelPersistenceManager:
    """Manages model saving and versioning"""
    
    def __init__(self):
        self.models_dir = Path(settings.BASE_DIR) / 'trained_models'
        self.models_dir.mkdir(exist_ok=True)
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def save_model_version(self, 
                          model: Any,
                          model_type: str,
                          metrics: Dict[str, float],
                          feature_engineer: FeatureEngineer,
                          training_config: Dict[str, Any]) -> MLModelVersion:
        """
        Save trained model and create database version record
        
        Args:
            model: Trained scikit-learn model
            model_type: 'correction', 'explanation', 'recommendation', 'error_analysis'
            metrics: Dictionary of evaluation metrics
            feature_engineer: Feature engineer with fitted vectorizer
            training_config: Training configuration parameters
            
        Returns:
            MLModelVersion instance
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        model_path = self.models_dir / f"{model_type}_{timestamp}.pkl"
        scaler_path = self.models_dir / f"{model_type}_vectorizer_{timestamp}.pkl"
        
        # Save model
        joblib.dump(model, str(model_path))
        joblib.dump(feature_engineer.vectorizer, str(scaler_path))
        
        # Create database record
        ml_version = MLModelVersion.objects.create(
            model_type=model_type,
            version=timestamp[-8:],  # Ultra safe length (HHMMSS)
            status='training_complete',
            model_path=str(model_path),
            scaler_path=str(scaler_path),
            accuracy=metrics.get('accuracy', 0),
            precision=metrics.get('precision', 0),
            recall=metrics.get('recall', 0),
            f1_score=metrics.get('f1', 0),
            hyperparameters=training_config,
            trained_at=timezone.now(),
            training_samples=training_config.get('train_samples', 0),
        )
        
        self.logger.info(f"[OK] Model saved: {model_path}")
        self.logger.info(f"[OK] Version record created: {ml_version.id}")
        
        return ml_version
    
    def load_model(self, model_version: MLModelVersion) -> Tuple[Any, Any]:
        """Load saved model and vectorizer"""
        model = joblib.load(model_version.model_path)
        vectorizer = joblib.load(model_version.scaler_path)
        return model, vectorizer


# ============================================================================
# 5. ORCHESTRATION & MAIN TRAINING PIPELINE
# ============================================================================

class TrainingOrchestrator:
    """Orchestrates the complete training pipeline"""
    
    def __init__(self):
        self.preparer = DatasetPreparer()
        self.persistence = ModelPersistenceManager()
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def train_all_models(self, curriculum_path: str = None, use_synthetic_data: bool = True) -> Dict[str, Any]:
        """
        Complete training pipeline for all model types
        
        Args:
            curriculum_path: Path to curriculum JSON files
            use_synthetic_data: Whether to augment with synthetic errors
            
        Returns:
            Training results for all models
        """
        self.logger.info("[START] Starting Complete ML Training Pipeline")
        
        # ===== PHASE 1: DATA PREPARATION =====
        self.logger.info("\n[DATA] PHASE 1: Data Preparation")
        
        # Load curriculum exercises
        exercises_df = self.preparer.load_curriculum_exercises()
        
        # Load real student data
        student_data = self.preparer.load_student_answers()
        
        # Merge and augment
        if use_synthetic_data:
            training_data = self.preparer.generate_synthetic_errors(exercises_df, num_variations=3)
        else:
            training_data = exercises_df
        
        # Create splits
        train_df, val_df, test_df = self.preparer.create_splits(training_data)
        
        results = {
            'data_preparation': {
                'total_samples': len(training_data),
                'train_samples': len(train_df),
                'val_samples': len(val_df),
                'test_samples': len(test_df),
            }
        }
        
        # ===== PHASE 2: MODEL TRAINING =====
        self.logger.info("\n[AI] PHASE 2: Model Training")
        
        # Train Correction Model
        self.logger.info("\n1️⃣ Training Correction Model...")
        correction_trainer = ExerciseCorrectionTrainer()
        correction_metrics = correction_trainer.train(train_df, val_df)
        
        # Save correction model
        correction_version = self.persistence.save_model_version(
            model=correction_trainer.model,
            model_type='correction',
            metrics=correction_metrics,
            feature_engineer=correction_trainer.feature_engineer,
            training_config={'train_samples': len(train_df), 'model': 'RandomForest'}
        )
        results['correction_model'] = {
            'metrics': correction_metrics,
            'version_id': correction_version.id,
        }
        
        # Train Error Analysis Model
        self.logger.info("\n2️⃣ Training Error Analysis Model...")
        error_trainer = ErrorAnalysisTrainer()
        error_metrics = error_trainer.train(train_df, val_df)
        
        # Save error model
        error_version = self.persistence.save_model_version(
            model=error_trainer.model,
            model_type='error_analysis',
            metrics=error_metrics,
            feature_engineer=error_trainer.feature_engineer,
            training_config={'train_samples': len(train_df), 'model': 'GradientBoosting'}
        )
        results['error_analysis_model'] = {
            'metrics': error_metrics,
            'version_id': error_version.id,
        }
        
        # ===== PHASE 3: TESTING =====
        self.logger.info("\n[OK] PHASE 3: Testing on Test Set")
        
        X_test, y_test = correction_trainer.prepare_validation_data(test_df)
        y_pred = correction_trainer.model.predict(X_test)
        
        test_metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred, zero_division=0)),
            'f1': float(f1_score(y_test, y_pred, zero_division=0)),
        }
        
        results['test_metrics'] = test_metrics
        
        # ===== FINAL SUMMARY =====
        self.logger.info("\n" + "="*60)
        self.logger.info("[OK] TRAINING PIPELINE COMPLETED")
        self.logger.info("="*60)
        self.logger.info(f"Total samples: {len(training_data)}")
        self.logger.info(f"Correction Model Accuracy: {correction_metrics['accuracy']:.2%}")
        self.logger.info(f"Test Set Accuracy: {test_metrics['accuracy']:.2%}")
        self.logger.info(f"Models saved to: {self.persistence.models_dir}")
        self.logger.info("="*60)
        
        return results


# ============================================================================
# 6. PREDICTION API
# ============================================================================

class PredictionService:
    """Service for making predictions with trained models"""
    
    def __init__(self):
        self.persistence = ModelPersistenceManager()
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def correct_exercise(self, 
                        question: str, 
                        student_answer: str,
                        subject: str,
                        level: str) -> Dict[str, Any]:
        """
        Correct a student's exercise answer
        
        Args:
            question: The exercise question
            student_answer: Student's answer text
            subject: Subject (math, french, etc.)
            level: Student level (primary_cp1, primary_p3, secondary_s1, etc.)
            
        Returns:
            {
                'is_correct': bool,
                'confidence': float,
                'error_type': str (if incorrect),
                'explanation': str,
                'recommendation': str,
                'curriculum_reference': str
            }
        """
        # Get active models
        correction_model_version = MLModelVersion.objects.filter(
            model_type='correction',
            status='active'
        ).latest('trained_at')
        
        error_model_version = MLModelVersion.objects.filter(
            model_type='error_analysis',
            status='active'
        ).latest('trained_at')
        
        # Load models
        correction_model, vectorizer = self.persistence.load_model(correction_model_version)
        error_model, _ = self.persistence.load_model(error_model_version)
        
        # Create metadata
        metadata = {
            'question': question,
            'student_answer': student_answer,
            'subject': subject,
            'level': level,
        }
        
        # Predict correctness
        text_features = vectorizer.transform([f"{question} {student_answer}"]).toarray()
        pred_correct = correction_model.predict(text_features)[0]
        confidence = correction_model.predict_proba(text_features)[0, int(pred_correct)]
        
        # Analyze error if incorrect
        error_type = None
        if not pred_correct:
            error_pred = error_model.predict(text_features)[0]
            error_types = ['calculation_error', 'comprehension_error', 'spelling_error', 'logic_error', 'incomplete_answer', 'other']
            error_type = error_types[error_pred]
        
        return {
            'is_correct': bool(pred_correct),
            'confidence': float(confidence),
            'error_type': error_type,
            'timestamp': datetime.now().isoformat(),
        }


if __name__ == '__main__':
    # Example usage:
    # orchestrator = TrainingOrchestrator()
    # results = orchestrator.train_all_models(use_synthetic_data=True)
    # print(json.dumps(results, indent=2))
    pass
