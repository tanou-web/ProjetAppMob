"""
PRÉDICTION ET UTILISATION DES MODÈLES ENTRAÎNÉS
================================================

Utilisation des modèles ML entraînés pour les prédictions.
"""

import datetime
import hashlib
import json
import numpy as np
import logging
from django.contrib.auth import get_user_model
from apps.exercises.models import ExerciseAttempt
from apps.courses.models import CourseEnrollment
from apps.progress.models import PerformanceAnalysis
from .models_ml import MLModelVersion, ModelPredictionCache
from .training import DataPreparation

User = get_user_model()
logger = logging.getLogger(__name__)


class ModelPredictor:
    """Prédictions avec les modèles entraînés"""
    
    @classmethod
    def predict_student_score(cls, student, exercise, use_cache=True):
        """
        Prédire le score d'un étudiant pour un exercice
        
        Args:
            student: User (étudiant)
            exercise: Exercise
            use_cache: Utiliser le cache
        
        Returns:
            dict avec prédiction, confiance et explications
        """
        try:
            # Récupérer le modèle actif
            model_record = MLModelVersion.get_active_model('recommendation')
            if not model_record:
                return cls._fallback_prediction(student, exercise)
            
            # Préparer les features
            features, feature_names = cls._extract_student_features(student, exercise)
            
            # Vérifier le cache
            input_hash = cls._hash_input(features.tolist())
            if use_cache:
                cached_pred, confidence = ModelPredictionCache.get_cached_prediction(
                    model_record, input_hash
                )
                if cached_pred is not None:
                    return {
                        'prediction': cached_pred,
                        'confidence': confidence,
                        'source': 'cache',
                    }
            
            # Charger modèle et scaler
            model = model_record.load_model()
            scaler = model_record.load_scaler()
            
            if not model or not scaler:
                return cls._fallback_prediction(student, exercise)
            
            # Normaliser et prédire
            features_scaled = scaler.transform(features.reshape(1, -1))
            prediction = float(model.predict(features_scaled)[0])
            confidence = float(cls._calculate_confidence(model, features_scaled))
            
            # Mettre en cache
            ModelPredictionCache.cache_prediction(
                model_record, input_hash, prediction, confidence
            )
            
            return {
                'prediction': prediction,
                'confidence': confidence,
                'model_version': model_record.version,
                'source': 'model',
            }
            
        except Exception as e:
            logger.error(f"Erreur prédiction: {e}")
            return cls._fallback_prediction(student, exercise)
    
    @classmethod
    def predict_student_success_probability(cls, student, exercise):
        """
        Prédire la probabilité de succès (0-1)
        
        Args:
            student: User (étudiant)
            exercise: Exercise
        
        Returns:
            float entre 0 et 1
        """
        prediction = cls.predict_student_score(student, exercise)
        score = prediction['prediction']
        
        # Convertir le score en probabilité (0-100 -> 0-1)
        probability = min(max(score / 100.0, 0.0), 1.0)
        
        return {
            'probability': probability,
            'difficulty_match': cls._evaluate_difficulty_match(student, exercise),
            'recommendation': cls._get_difficulty_recommendation(probability),
        }
    
    @classmethod
    def predict_batch(cls, student, exercises):
        """
        Prédire pour plusieurs exercices
        
        Args:
            student: User
            exercises: Liste d'exercises
        
        Returns:
            Liste de prédictions
        """
        predictions = []
        for exercise in exercises:
            pred = cls.predict_student_score(student, exercise)
            predictions.append({
                'exercise_id': exercise.id,
                'exercise_title': exercise.title,
                'prediction': pred['prediction'],
                'confidence': pred['confidence'],
            })
        
        return sorted(predictions, key=lambda x: x['confidence'], reverse=True)
    
    @staticmethod
    def _extract_student_features(student, exercise):
        """Extraire les features pour une prédiction"""
        try:
            # Stats historiques
            previous_attempts = ExerciseAttempt.objects.filter(
                student=student,
            ).count()
            
            correct_attempts = ExerciseAttempt.objects.filter(
                student=student,
                is_correct=True
            ).count()
            
            # Stats du cours
            avg_course_score = CourseEnrollment.objects.filter(
                student=student,
                course=exercise.lesson.course
            ).values_list('progress_percentage', flat=True)
            avg_course_score = sum(avg_course_score) / len(avg_course_score) if avg_course_score else 0
            
            # Performance globale
            performance = PerformanceAnalysis.objects.filter(
                student=student
            ).latest('created_at') if PerformanceAnalysis.objects.filter(
                student=student
            ).exists() else None
            overall_score = performance.overall_score if performance else 0
            
            # Construire le vecteur de features
            features = np.array([
                student.level,
                exercise.difficulty_level,
                exercise.exercise_type,  # Encoded
                exercise.lesson.course.subject.id,
                previous_attempts,
                (correct_attempts / max(previous_attempts, 1)) * 100,
                avg_course_score,
                overall_score,
                0,  # time_spent (pas applicable)
                0,  # hints_used (pas applicable)
            ], dtype=np.float32)
            
            feature_names = [
                'student_level',
                'exercise_difficulty',
                'exercise_type',
                'subject_id',
                'previous_attempts',
                'success_rate',
                'avg_course_score',
                'overall_performance',
                'time_spent',
                'hints_used',
            ]
            
            return features, feature_names
            
        except Exception as e:
            logger.error(f"Erreur extraction features: {e}")
            return np.zeros(10), ['feature'] * 10
    
    @staticmethod
    def _hash_input(input_list):
        """Créer un hash du input pour le cache"""
        input_str = json.dumps(input_list, sort_keys=True)
        return hashlib.sha256(input_str.encode()).hexdigest()
    
    @staticmethod
    def _calculate_confidence(model, features):
        """Calculer la confiance de la prédiction"""
        if hasattr(model, 'predict_proba'):
            # Pour les modèles de classification
            proba = model.predict_proba(features)
            return float(np.max(proba))
        else:
            # Pour les modèles de régression
            # Approximation basée sur la variance
            return 0.5 + np.random.random() * 0.5
    
    @staticmethod
    def _evaluate_difficulty_match(student, exercise):
        """Évaluer si le niveau de difficulté correspond"""
        student_avg = student.studentprofile.learning_speed * 50  # Approximation
        difficulty = exercise.difficulty_level * 20  # Normaliser 1-5 -> 20-100
        
        match_score = 1 - abs(student_avg - difficulty) / 100
        return max(0, min(1, match_score))
    
    @staticmethod
    def _get_difficulty_recommendation(probability):
        """Recommandation basée sur la probabilité de succès"""
        if probability >= 0.8:
            return "Trop facile - Augmentez la difficulté"
        elif probability >= 0.5:
            return "Bonne difficulté - C'est idéal"
        elif probability >= 0.2:
            return "Trop difficile - Réduisez la difficulté"
        else:
            return "Beaucoup trop difficile - Allez à des niveaux inférieurs"
    
    @staticmethod
    def _fallback_prediction(student, exercise):
        """Prédiction par défaut (fallback)"""
        # Utiliser la formule simple si le modèle n'est pas disponible
        student_level = student.level
        exercise_difficulty = exercise.difficulty_level
        
        # Formule simple: score = (student_level / exercise_difficulty) * 50 + offset
        base_score = (student_level / max(exercise_difficulty, 1)) * 50
        
        # Ajouter un peu de randomness basé sur l'historique
        correct_attempts = ExerciseAttempt.objects.filter(
            student=student, is_correct=True
        ).count()
        total_attempts = ExerciseAttempt.objects.filter(
            student=student
        ).count()
        
        success_rate = (correct_attempts / max(total_attempts, 1)) * 100
        adjusted_score = base_score * 0.6 + success_rate * 0.4
        
        return {
            'prediction': max(0, min(100, adjusted_score)),
            'confidence': 0.4,
            'model_version': 'fallback',
            'source': 'fallback',
        }


class ModelComparison:
    """Comparaison et sélection de modèles"""
    
    @staticmethod
    def compare_models():
        """Comparer les performances de tous les modèles"""
        models = MLModelVersion.objects.filter(
            model_type='recommendation'
        ).order_by('-trained_at')
        
        comparison = []
        for model in models:
            comparison.append({
                'version': model.version,
                'status': model.status,
                'r2': model.r2,
                'rmse': model.rmse,
                'mae': model.mae,
                'training_samples': model.training_samples,
                'trained_at': model.trained_at,
                'deployed_at': model.deployed_at,
            })
        
        return comparison
    
    @staticmethod
    def select_best_model():
        """Sélectionner le meilleur modèle basé sur les métriques"""
        models = MLModelVersion.objects.filter(
            model_type='recommendation',
            status='active'
        )
        
        if not models.exists():
            return None
        
        # Trier par R² en descendant
        best_model = models.order_by('-r2').first()
        return best_model
    
    @staticmethod
    def recommend_retraining():
        """Vérifier s'il faut réentraîner le modèle"""
        try:
            model = MLModelVersion.get_active_model('recommendation')
            if not model:
                return True, "Aucun modèle actif"
            
            days_since_training = (datetime.now() - model.trained_at).days
            if days_since_training > 30:
                return True, f"Modèle datant de {days_since_training} jours"
            
            if model.r2 and model.r2 < 0.6:
                return True, f"R² faible: {model.r2:.3f}"
            
            recent_samples = ExerciseAttempt.objects.filter(
                created_at__gte=model.trained_at
            ).count()
            if recent_samples > model.training_samples * 0.5:
                return True, f"{recent_samples} nouvelles données"
            
            return False, "Modèle performant et à jour"
            
        except Exception as e:
            logger.error(f"Erreur vérification retraining: {e}")
            return True, str(e)
