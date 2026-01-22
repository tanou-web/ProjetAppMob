"""
API Endpoints pour utiliser les modèles IA entraînés
Permet de corriger des exercices et obtenir des explications
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse

from apps.recommendations.training_pipeline import PredictionService
from apps.recommendations.models_ml import MLModelVersion
from apps.courses.models import Subject, Course
from .serializers import MLModelVersionSerializer


class CorrectionAPIView(APIView):
    """
    Endpoint pour corriger une réponse d'élève
    
    POST /api/correction/
    {
        "question": "Quel est le résultat de 2 + 3?",
        "student_answer": "5",
        "subject": "math",
        "level": "primary_cp1"
    }
    
    Réponse:
    {
        "is_correct": true,
        "confidence": 0.92,
        "error_type": null,
        "explanation": "...",
        "explanation_en": "...",
        "tips": "..."
    }
    """
    
    def post(self, request):
        """Corriger une réponse d'élève"""
        try:
            question = request.data.get('question')
            student_answer = request.data.get('student_answer')
            subject = request.data.get('subject', 'math')
            level = request.data.get('level', 'primary_cp1')
            
            # Validation
            if not question or not student_answer:
                return Response(
                    {'error': 'question et student_answer sont requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Utiliser le service de prédiction
            service = PredictionService()
            result = service.correct_exercise(
                question=question,
                student_answer=student_answer,
                subject=subject,
                level=level
            )
            
            # Ajouter explications et tips
            if result['is_correct']:
                explanation = "✅ Votre réponse est correcte!"
                tips = "Continuez ainsi, excellent travail!"
            else:
                explanation = f"❌ Votre réponse est incorrecte. Erreur détectée: {result['error_type']}"
                tips = "Relisez la leçon et essayez à nouveau."
            
            return Response({
                'is_correct': result['is_correct'],
                'confidence': result['confidence'],
                'error_type': result['error_type'],
                'explanation': explanation,
                'tips': tips,
                'timestamp': result['timestamp'],
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ExerciseAnalysisAPIView(APIView):
    """
    Analyse détaillée d'une réponse
    
    POST /api/exercise-analysis/
    {
        "exercise_id": 123,
        "student_answer": "4",
        "learning_style": "visual"
    }
    """
    
    def post(self, request):
        """Analyser une réponse en détail"""
        try:
            from apps.exercises.models import Exercise
            
            exercise_id = request.data.get('exercise_id')
            student_answer = request.data.get('student_answer')
            learning_style = request.data.get('learning_style', 'mixed')
            
            # Charger l'exercice
            exercise = Exercise.objects.get(id=exercise_id)
            
            # Corriger
            service = PredictionService()
            result = service.correct_exercise(
                question=exercise.question,
                student_answer=student_answer,
                subject=exercise.subject.name.lower(),
                level=exercise.course.level
            )
            
            # Analyse détaillée
            analysis = {
                'exercise_id': exercise_id,
                'is_correct': result['is_correct'],
                'confidence': result['confidence'],
                'error_type': result['error_type'],
                
                # Pédagogie
                'explanation': exercise.explanation,
                'tips_by_style': {
                    'visual': 'Essayez de visualiser le problème',
                    'auditory': 'Relisez la leçon à haute voix',
                    'kinesthetic': 'Utilisez du matériel concret (bâtonnets, graines)',
                },
                'next_exercises': self._get_next_exercises(
                    exercise.course, result['is_correct']
                ),
                
                # Curriculum alignment
                'curriculum_reference': exercise.course.curriculum_reference,
                'learning_objectives': exercise.course.learning_objectives,
            }
            
            return Response(analysis)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_next_exercises(self, course, is_correct, count=3):
        """Recommander les prochains exercices"""
        from apps.exercises.models import Exercise
        
        if is_correct:
            # Si correct, progresser vers niveau difficile
            next_exercises = Exercise.objects.filter(
                course__difficulty_level='hard',
                course__subject=course.subject
            )[:count]
        else:
            # Si incorrect, pratiquer le même niveau
            next_exercises = Exercise.objects.filter(
                course=course
            ).exclude(id__in=[])[:count]
        
        return [
            {
                'id': ex.id,
                'title': ex.title,
                'difficulty': ex.course.difficulty_level,
                'estimated_time': '5-10 minutes',
            }
            for ex in next_exercises
        ]


class ModelStatusAPIView(APIView):
    """
    Status des modèles IA
    
    GET /api/models/status/
    
    Réponse:
    {
        "active_models": [...],
        "model_count": 5,
        "latest_training": "2024-01-15T14:30:22Z"
    }
    """
    
    def get(self, request):
        """Récupérer le status des modèles"""
        try:
            active_models = MLModelVersion.objects.filter(status='active')
            all_models = MLModelVersion.objects.all()
            
            models_data = []
            for model in active_models:
                models_data.append({
                    'id': model.id,
                    'type': model.model_type,
                    'version': model.version,
                    'accuracy': model.accuracy,
                    'f1_score': model.f1_score,
                    'trained_at': model.trained_at.isoformat() if model.trained_at else None,
                })
            
            return Response({
                'active_models': models_data,
                'total_models': all_models.count(),
                'training_status': 'ready' if active_models.exists() else 'not_ready',
                'latest_training': all_models.latest('trained_at').trained_at.isoformat() if all_models.exists() else None,
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TrainingProgressAPIView(APIView):
    """
    Monitoring d'un entraînement en cours
    
    GET /api/training/progress/
    """
    
    def get(self, request):
        """Récupérer la progression de l'entraînement"""
        try:
            # Récupérer les modèles en cours de training
            training_models = MLModelVersion.objects.filter(status='training')
            
            progress_data = []
            for model in training_models:
                progress_data.append({
                    'id': model.id,
                    'type': model.model_type,
                    'version': model.version,
                    'started_at': model.trained_at.isoformat() if model.trained_at else None,
                    'training_samples': model.training_samples_count,
                    'training_duration': model.training_duration if hasattr(model, 'training_duration') else None,
                })
            
            return Response({
                'training_count': len(progress_data),
                'models': progress_data,
                'in_progress': len(progress_data) > 0,
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BulkCorrectionAPIView(APIView):
    """
    Corriger plusieurs exercices en une seule requête
    
    POST /api/bulk-correction/
    {
        "exercises": [
            {"question": "...", "student_answer": "..."},
            {"question": "...", "student_answer": "..."},
        ]
    }
    """
    
    def post(self, request):
        """Corriger plusieurs exercices"""
        try:
            exercises = request.data.get('exercises', [])
            
            if not exercises:
                return Response(
                    {'error': 'exercises list is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            service = PredictionService()
            results = []
            
            for exercise in exercises:
                result = service.correct_exercise(
                    question=exercise.get('question'),
                    student_answer=exercise.get('student_answer'),
                    subject=exercise.get('subject', 'math'),
                    level=exercise.get('level', 'primary_cp1')
                )
                results.append({
                    'question': exercise.get('question'),
                    'is_correct': result['is_correct'],
                    'confidence': result['confidence'],
                    'error_type': result['error_type'],
                })
            
            # Statistiques
            correct_count = sum(1 for r in results if r['is_correct'])
            
            return Response({
                'total': len(results),
                'correct': correct_count,
                'incorrect': len(results) - correct_count,
                'accuracy': correct_count / len(results) if results else 0,
                'results': results,
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# URL Patterns à ajouter dans urls.py

"""
from django.urls import path
from . import views

urlpatterns = [
    # Correction d'exercices
    path('api/correction/', CorrectionAPIView.as_view(), name='correction'),
    path('api/exercise-analysis/', ExerciseAnalysisAPIView.as_view(), name='exercise-analysis'),
    path('api/bulk-correction/', BulkCorrectionAPIView.as_view(), name='bulk-correction'),
    
    # Status et monitoring
    path('api/models/status/', ModelStatusAPIView.as_view(), name='model-status'),
    path('api/training/progress/', TrainingProgressAPIView.as_view(), name='training-progress'),
]
"""
