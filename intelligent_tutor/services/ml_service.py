"""
ML Service - Load and use existing .pkl models
Handles local ML predictions for recommendations and corrections.
"""
import os
import pickle
import logging
from typing import Dict, List, Optional, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)

# Paths to models
BASE_DIR = Path(__file__).resolve().parent.parent
ML_MODELS_DIR = BASE_DIR / 'ml_models'
TRAINED_MODELS_DIR = BASE_DIR / 'trained_models'


class MLService:
    """Service for loading and using existing ML models (.pkl files)."""
    
    _recommendation_model = None
    _recommendation_scaler = None
    _correction_model = None
    _correction_vectorizer = None
    
    @classmethod
    def load_recommendation_model(cls):
        """Load the recommendation model and scaler."""
        if cls._recommendation_model is None:
            try:
                # Find the latest recommendation model
                model_files = list(ML_MODELS_DIR.glob('recommendation_rec_*.pkl'))
                if model_files:
                    latest_model = max(model_files, key=os.path.getctime)
                    with open(latest_model, 'rb') as f:
                        cls._recommendation_model = pickle.load(f)
                    logger.info(f"Loaded recommendation model: {latest_model.name}")
                    
                    # Load corresponding scaler
                    scaler_name = latest_model.name.replace('recommendation_rec_', 'recommendation_scaler_rec_')
                    scaler_path = ML_MODELS_DIR / scaler_name
                    if scaler_path.exists():
                        with open(scaler_path, 'rb') as f:
                            cls._recommendation_scaler = pickle.load(f)
                        logger.info(f"Loaded recommendation scaler: {scaler_name}")
                else:
                    logger.warning("No recommendation model found")
            except Exception as e:
                logger.error(f"Failed to load recommendation model: {str(e)}")
        
        return cls._recommendation_model, cls._recommendation_scaler
    
    @classmethod
    def load_correction_model(cls):
        """Load the latest correction model and vectorizer."""
        if cls._correction_model is None:
            try:
                # Find the latest correction model
                model_files = list(TRAINED_MODELS_DIR.glob('correction_2*.pkl'))
                # Exclude vectorizer files
                model_files = [f for f in model_files if 'vectorizer' not in f.name]
                
                if model_files:
                    latest_model = max(model_files, key=os.path.getctime)
                    with open(latest_model, 'rb') as f:
                        cls._correction_model = pickle.load(f)
                    logger.info(f"Loaded correction model: {latest_model.name}")
                    
                    # Load corresponding vectorizer
                    vectorizer_name = latest_model.name.replace('correction_', 'correction_vectorizer_')
                    vectorizer_path = TRAINED_MODELS_DIR / vectorizer_name
                    if vectorizer_path.exists():
                        with open(vectorizer_path, 'rb') as f:
                            cls._correction_vectorizer = pickle.load(f)
                        logger.info(f"Loaded correction vectorizer: {vectorizer_name}")
                else:
                    logger.warning("No correction model found")
            except Exception as e:
                logger.error(f"Failed to load correction model: {str(e)}")
        
        return cls._correction_model, cls._correction_vectorizer
    
    @classmethod
    def predict_recommendation(cls, features: List[float]) -> Tuple[int, float]:
        """
        Predict recommended difficulty level for a student.
        
        Args:
            features: List of features [avg_score, total_attempts, recent_performance, ...]
            
        Returns:
            Tuple of (predicted_difficulty, confidence)
        """
        model, scaler = cls.load_recommendation_model()
        
        if model is None:
            # Fallback: simple rule-based
            avg_score = features[0] if features else 50
            if avg_score >= 80:
                return 4, 0.6  # Hard
            elif avg_score >= 60:
                return 3, 0.6  # Medium
            else:
                return 2, 0.6  # Easy
        
        try:
            # Scale features if scaler available
            if scaler:
                features_scaled = scaler.transform([features])
            else:
                features_scaled = [features]
            
            # Predict
            prediction = model.predict(features_scaled)[0]
            
            # Get confidence if available (for classifiers with predict_proba)
            confidence = 0.8
            if hasattr(model, 'predict_proba'):
                probas = model.predict_proba(features_scaled)[0]
                confidence = max(probas)
            
            return int(prediction), float(confidence)
            
        except Exception as e:
            logger.error(f"Recommendation prediction failed: {str(e)}")
            # Fallback
            avg_score = features[0] if features else 50
            return (4 if avg_score >= 80 else 3 if avg_score >= 60 else 2), 0.5
    
    @classmethod
    def predict_correction(cls, student_answer: str, correct_answer: str, question: str = "") -> Tuple[bool, float, str]:
        """
        Predict if student answer is correct using ML model.
        
        Args:
            student_answer: Student's answer
            correct_answer: Correct answer
            question: The question (optional, for context)
            
        Returns:
            Tuple of (is_correct, confidence, error_type)
        """
        model, vectorizer = cls.load_correction_model()
        
        if model is None or vectorizer is None:
            # Fallback: simple string comparison
            is_correct = student_answer.strip().lower() == correct_answer.strip().lower()
            return is_correct, 0.9 if is_correct else 0.7, "comparison_fallback"
        
        try:
            # Prepare text for vectorization
            # Combine question, student answer, and correct answer
            text = f"{question} {student_answer} {correct_answer}"
            
            # Vectorize
            features = vectorizer.transform([text])
            
            # Predict
            prediction = model.predict(features)[0]
            
            # Get confidence
            confidence = 0.8
            if hasattr(model, 'predict_proba'):
                probas = model.predict_proba(features)[0]
                confidence = max(probas)
            
            # Determine error type based on prediction
            is_correct = bool(prediction)
            error_type = "correct" if is_correct else "incorrect"
            
            return is_correct, float(confidence), error_type
            
        except Exception as e:
            logger.error(f"Correction prediction failed: {str(e)}")
            # Fallback
            is_correct = student_answer.strip().lower() == correct_answer.strip().lower()
            return is_correct, 0.7, "ml_fallback"
    
    @classmethod
    def analyze_weak_topics(cls, exercise_attempts: List[Dict]) -> List[str]:
        """
        Analyze exercise attempts to identify weak topics.
        
        Args:
            exercise_attempts: List of attempt data with topics and scores
            
        Returns:
            List of weak topic names
        """
        topic_scores = {}
        
        for attempt in exercise_attempts:
            topic = attempt.get('topic', 'Unknown')
            score = attempt.get('score', 0)
            
            if topic not in topic_scores:
                topic_scores[topic] = []
            topic_scores[topic].append(score)
        
        # Calculate average scores per topic
        weak_topics = []
        for topic, scores in topic_scores.items():
            avg_score = sum(scores) / len(scores) if scores else 0
            if avg_score < 60:  # Threshold for weak topic
                weak_topics.append(topic)
        
        return weak_topics


# Convenience functions
def predict_difficulty(avg_score: float, total_attempts: int) -> int:
    """Simple wrapper for difficulty prediction."""
    features = [avg_score, total_attempts]
    difficulty, _ = MLService.predict_recommendation(features)
    return difficulty


def check_answer_ml(student_answer: str, correct_answer: str, question: str = "") -> bool:
    """Simple wrapper for answer checking."""
    is_correct, _, _ = MLService.predict_correction(student_answer, correct_answer, question)
    return is_correct
