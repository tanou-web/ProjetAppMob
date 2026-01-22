"""
PIPELINE D'ENTRAÎNEMENT DES MODÈLES ML
=====================================

Entraînement, validation et déploiement des modèles de recommandation.
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from django.db.models import Avg, Count, Max
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import (
    mean_squared_error, r2_score, mean_absolute_error,
    accuracy_score, precision_score, recall_score, f1_score
)
import logging
import time

from django.contrib.auth import get_user_model
from apps.courses.models import CourseEnrollment
from apps.exercises.models import ExerciseAttempt
from apps.progress.models import PerformanceAnalysis, LearningPath
from .models_ml import MLModelVersion, TrainingLog, ModelEvaluation

User = get_user_model()
logger = logging.getLogger(__name__)


class DataPreparation:
    """Préparation des données pour l'entraînement"""
    
    @staticmethod
    def get_training_data(min_samples=50, days_back=180):
        """
        Récupérer les données d'entraînement du système
        
        Args:
            min_samples: Nombre minimum d'échantillons requis
            days_back: Nombre de jours d'historique à considérer
        
        Returns:
            DataFrame avec features et target
        """
        cutoff_date = datetime.now() - timedelta(days=days_back)
        
        # Récupérer les tentatives d'exercices
        attempts = ExerciseAttempt.objects.filter(
            created_at__gte=cutoff_date
        ).select_related('student', 'exercise__lesson__course')
        
        if attempts.count() < min_samples:
            logger.warning(f"Nombre d'échantillons insuffisant: {attempts.count()}")
            return None
        
        # Construire le DataFrame
        data = []
        for attempt in attempts:
            features = DataPreparation._extract_features(attempt)
            if features:
                data.append(features)
        
        df = pd.DataFrame(data)
        logger.info(f"Données préparées: {len(df)} échantillons, {len(df.columns)} features")
        
        return df
    
    @staticmethod
    def _extract_features(attempt):
        """Extraire les features d'une tentative"""
        try:
            student = attempt.student
            exercise = attempt.exercise
            
            # Récupérer les stats de l'étudiant
            previous_attempts = ExerciseAttempt.objects.filter(
                student=student,
                created_at__lt=attempt.created_at
            ).count()
            
            correct_attempts = ExerciseAttempt.objects.filter(
                student=student,
                created_at__lt=attempt.created_at,
                is_correct=True
            ).count()
            
            # Récupérer les stats du cours
            course_enrollments = CourseEnrollment.objects.filter(
                student=student,
                course=exercise.lesson.course
            )
            
            avg_course_score = course_enrollments.aggregate(
                avg=Avg('progress_percentage')
            )['avg'] or 0
            
            # Récupérer l'analyse de performance
            performance = PerformanceAnalysis.objects.filter(
                student=student
            ).latest('created_at') if PerformanceAnalysis.objects.filter(
                student=student
            ).exists() else None
            
            overall_score = performance.overall_score if performance else 0
            
            return {
                'student_level': student.level,
                'exercise_difficulty': exercise.difficulty_level,
                'exercise_type': exercise.exercise_type,
                'course_id': exercise.lesson.course.id,
                'subject_id': exercise.lesson.course.subject.id,
                'previous_attempts': previous_attempts,
                'success_rate': (correct_attempts / max(previous_attempts, 1)) * 100,
                'avg_course_score': avg_course_score,
                'overall_performance': overall_score,
                'time_spent': attempt.time_spent_seconds or 0,
                'hints_used': attempt.hints_used or 0,
                'is_correct': 1 if attempt.is_correct else 0,
                'score': attempt.score or 0,
            }
        except Exception as e:
            logger.error(f"Erreur extraction features: {e}")
            return None
    
    @staticmethod
    def prepare_features(df):
        """Préparer et normaliser les features"""
        # Séparer features et target
        target_col = 'score'
        feature_cols = [col for col in df.columns if col != target_col]
        
        X = df[feature_cols].fillna(0)
        y = df[target_col]
        
        # Normaliser
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        return X_scaled, y, X.columns, scaler


class ModelTrainer:
    """Entraînement des modèles ML"""
    
    # Configuration des modèles
    MODELS_CONFIG = {
        'gradient_boosting': {
            'n_estimators': 200,
            'learning_rate': 0.08,
            'max_depth': 7,
            'min_samples_split': 5,
            'min_samples_leaf': 2,
            'subsample': 0.8,
            'random_state': 42,
        },
        'random_forest': {
            'n_estimators': 300,
            'max_depth': 15,
            'min_samples_split': 5,
            'min_samples_leaf': 2,
            'random_state': 42,
            'n_jobs': -1,
        }
    }
    
    @classmethod
    def train_recommendation_model(cls, model_type='gradient_boosting', version='2.0.0'):
        """
        Entraîner un modèle de recommandation
        
        Args:
            model_type: Type de modèle ('gradient_boosting' ou 'random_forest')
            version: Numéro de version
        
        Returns:
            MLModelVersion créé
        """
        logger.info(f"Démarrage entraînement modèle: {model_type} v{version}")
        start_time = time.time()
        
        # Créer le record de modèle
        model_record = MLModelVersion.objects.create(
            model_type='recommendation',
            version=version,
            status='training',
            hyperparameters=cls.MODELS_CONFIG.get(model_type, {})
        )
        
        try:
            # Préparer les données
            df = DataPreparation.get_training_data()
            if df is None or len(df) < 20:
                model_record.status = 'failed'
                model_record.save()
                return model_record
            
            X, y, feature_names, scaler = DataPreparation.prepare_features(df)
            
            # Diviser données
            split_idx = int(len(X) * 0.8)
            X_train, X_test = X[:split_idx], X[split_idx:]
            y_train, y_test = y[:split_idx], y[split_idx:]
            
            # Créer et entraîner le modèle
            if model_type == 'gradient_boosting':
                model = GradientBoostingRegressor(**cls.MODELS_CONFIG['gradient_boosting'])
            else:
                model = RandomForestRegressor(**cls.MODELS_CONFIG['random_forest'])
            
            logger.info(f"Entraînement avec {len(X_train)} échantillons...")
            model.fit(X_train, y_train)
            
            # Prédictions et métriques
            y_pred = model.predict(X_test)
            
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Validation croisée
            cv_scores = cross_val_score(
                model, X_train, y_train,
                cv=5, scoring='r2'
            )
            
            # Sauvegarder le modèle
            model_record.save_model(model, scaler)
            
            # Mettre à jour les métriques
            model_record.rmse = float(rmse)
            model_record.mae = float(mae)
            model_record.r2 = float(r2)
            model_record.accuracy = float(r2 * 100)  # Approximation
            model_record.training_samples = len(X_train)
            model_record.feature_count = X.shape[1]
            model_record.training_duration_seconds = int(time.time() - start_time)
            model_record.trained_at = datetime.now()
            model_record.status = 'active'
            model_record.deployed_at = datetime.now()
            model_record.save()
            
            # Créer l'évaluation
            evaluation = ModelEvaluation.objects.create(
                model=model_record,
                test_set_size=len(X_test),
                test_set_percentage=0.2,
                cv_scores=cv_scores.tolist(),
                cv_mean=float(cv_scores.mean()),
                cv_std=float(cv_scores.std()),
            )
            
            # Feature importance
            if hasattr(model, 'feature_importances_'):
                importance_dict = {
                    feature_names[i]: float(model.feature_importances_[i])
                    for i in range(len(feature_names))
                }
                evaluation.feature_importance = importance_dict
                evaluation.save()
            
            logger.info(f"Modèle entraîné avec succès!")
            logger.info(f"  RMSE: {rmse:.4f}")
            logger.info(f"  MAE: {mae:.4f}")
            logger.info(f"  R²: {r2:.4f}")
            logger.info(f"  CV Mean: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
            
            return model_record
            
        except Exception as e:
            logger.error(f"Erreur entraînement: {e}")
            model_record.status = 'failed'
            model_record.save()
            return model_record
    
    @classmethod
    def train_all_models(cls):
        """Entraîner tous les modèles recommandés"""
        logger.info("Démarrage entraînement de tous les modèles...")
        
        results = []
        
        # Entraîner avec Gradient Boosting
        result_gb = cls.train_recommendation_model(
            model_type='gradient_boosting',
            version='2.0.0_gb'
        )
        results.append(result_gb)
        
        # Entraîner avec Random Forest
        result_rf = cls.train_recommendation_model(
            model_type='random_forest',
            version='2.0.0_rf'
        )
        results.append(result_rf)
        
        return results


class ModelEnhancer:
    """Amélioration continue des modèles"""
    
    @staticmethod
    def analyze_model_performance(model_record):
        """Analyser la performance du modèle"""
        stats = {
            'r2_score': model_record.r2,
            'rmse': model_record.rmse,
            'mae': model_record.mae,
            'training_samples': model_record.training_samples,
            'cv_mean': model_record.evaluation.cv_mean if hasattr(model_record, 'evaluation') else None,
        }
        return stats
    
    @staticmethod
    def identify_improvement_areas(model_record):
        """Identifier les domaines d'amélioration"""
        improvements = []
        
        if model_record.r2 and model_record.r2 < 0.75:
            improvements.append("R² faible: collectez plus de données")
        
        if model_record.rmse and model_record.rmse > 20:
            improvements.append("RMSE élevé: ajustez les hyperparameters")
        
        if model_record.training_samples < 100:
            improvements.append("Peu d'échantillons d'entraînement")
        
        if hasattr(model_record, 'evaluation') and model_record.evaluation:
            cv_std = model_record.evaluation.cv_std
            if cv_std and cv_std > 0.1:
                improvements.append("Haute variance: augmentez la régularisation")
        
        return improvements
    
    @staticmethod
    def suggest_next_version(model_record):
        """Suggérer les prochaines améliorations"""
        suggestions = {
            'data_collection': {
                'more_samples': 'Collectez 500+ exercices supplémentaires',
                'new_features': 'Ajoutez des features: interaction enseignant, temps de session',
                'balanced_data': 'Équilibrez les données par niveau/matière',
            },
            'model_tuning': {
                'hyperparameters': 'Utilisez GridSearchCV pour optimiser les paramètres',
                'ensemble': 'Essayez une combination de modèles (stacking)',
                'deep_learning': 'Entraînez un modèle neural pour les relations complexes',
            },
            'features': {
                'interaction_terms': 'Créez des interactions entre features',
                'polynomial_features': 'Essayez les features polynomiales',
                'domain_specific': 'Ajoutez des features métier spécifiques à l\'éducation',
            },
        }
        return suggestions
