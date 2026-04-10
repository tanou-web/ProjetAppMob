"""
AI-Enhanced Views
New endpoints for AI features: chatbot, enhanced feedback, parent reports.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Avg, Count, Q
import logging

from services.ai_service import AIService
from services.ml_service import MLService
from services.vision_service import VisionService
from services.speech_service import SpeechService
from apps.exercises.models import Exercise, ExerciseAttempt
from apps.courses.models import Subject, Course, Lesson

logger = logging.getLogger(__name__)


class AIViewSet(viewsets.ViewSet):
    """ViewSet for AI-powered features."""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def chat(self, request):
        """
        AI Chatbot endpoint.
        
        POST data:
        {
            "message": "Comment calculer une fraction?",
            "subject": "Mathématiques" (optional),
            "lesson_id": 123 (optional),
            "conversation_history": [...] (optional)
        }
        """
        student = request.user
        message = request.data.get('message', '').strip()
        subject = request.data.get('subject')
        lesson_id = request.data.get('lesson_id')
        conversation_history = request.data.get('conversation_history', [])
        
        if not message:
            return Response(
                {'error': 'Message requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get lesson context if provided
        lesson_context = None
        if lesson_id:
            try:
                lesson = Lesson.objects.get(id=lesson_id)
                lesson_context = lesson.content[:1000]  # First 1000 chars
                if not subject:
                    subject = lesson.course.subject.name
            except Lesson.DoesNotExist:
                pass
        
        # Generate AI response
        try:
            ai_response = AIService.chatbot_response(
                student_message=message,
                student_level=student.level,
                subject=subject,
                lesson_context=lesson_context,
                conversation_history=conversation_history
            )
            
            response_data = {
                'timestamp': timezone.now().isoformat()
            }
            
            if isinstance(ai_response, dict):
                response_data.update(ai_response)
            else:
                response_data['message'] = ai_response
                
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Chatbot error: {str(e)}")
            return Response(
                {'error': 'Erreur du chatbot', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def analyze_error(self, request):
        """
        Enhanced error analysis using AI.
        
        POST data:
        {
            "attempt_id": 123
        }
        """
        attempt_id = request.data.get('attempt_id')
        
        if not attempt_id:
            return Response(
                {'error': 'attempt_id requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            attempt = ExerciseAttempt.objects.get(
                id=attempt_id,
                student=request.user
            )
        except ExerciseAttempt.DoesNotExist:
            return Response(
                {'error': 'Tentative non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if attempt.is_correct:
            return Response({
                'message': 'Bonne réponse ! Pas d\'analyse d\'erreur nécessaire.',
                'is_correct': True
            })
        
        # Get exercise details
        exercise = attempt.exercise
        lesson = exercise.lesson
        subject = lesson.course.subject.name
        
        # Use AI to analyze error
        try:
            analysis = AIService.analyze_error(
                question=exercise.question,
                student_answer=attempt.student_answer,
                correct_answer=exercise.correct_answer,
                student_level=request.user.level,
                subject=subject,
                context=lesson.content[:500]
            )
            
            return Response({
                'attempt_id': attempt_id,
                'analysis': analysis,
                'exercise': {
                    'question': exercise.question,
                    'student_answer': attempt.student_answer,
                    'correct_answer': exercise.correct_answer
                }
            })
            
        except Exception as e:
            logger.error(f"Error analysis failed: {str(e)}")
            return Response(
                {'error': 'Analyse impossible', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def parent_report(self, request):
        """
        Generate AI-powered parent report.
        
        Query params:
        - period: 'week', 'month', 'all' (default: 'month')
        """
        student = request.user
        period = request.query_params.get('period', 'month')
        
        # Calculate date range
        from datetime import timedelta
        now = timezone.now()
        if period == 'week':
            start_date = now - timedelta(days=7)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        else:
            start_date = None
        
        # Get statistics
        attempts_query = ExerciseAttempt.objects.filter(
            student=student,
            status='submitted'
        )
        if start_date:
            attempts_query = attempts_query.filter(submitted_at__gte=start_date)
        
        total_exercises = attempts_query.count()
        avg_score = attempts_query.aggregate(Avg('score'))['score__avg'] or 0
        
        # Get subject performance
        subject_stats = {}
        for subject in Subject.objects.all():
            subject_attempts = attempts_query.filter(
                exercise__lesson__course__subject=subject
            )
            if subject_attempts.exists():
                subject_avg = subject_attempts.aggregate(Avg('score'))['score__avg']
                subject_stats[subject.name] = subject_avg
        
        # Identify strong and weak subjects
        strong_subjects = [s for s, score in subject_stats.items() if score >= 70]
        weak_subjects = [s for s, score in subject_stats.items() if score < 60]
        
        # Recent progress (last 10 attempts)
        recent_attempts = attempts_query.order_by('-submitted_at')[:10]
        recent_scores = [a.score for a in recent_attempts]
        recent_avg = sum(recent_scores) / len(recent_scores) if recent_scores else 0
        
        # Generate AI report
        try:
            report = AIService.generate_parent_report(
                student_name=student.get_full_name() or student.username,
                student_level=student.level,
                statistics={
                    'avg_score': avg_score,
                    'total_exercises': total_exercises,
                    'study_time_hours': total_exercises * 0.1  # Estimate
                },
                weak_subjects=weak_subjects,
                strong_subjects=strong_subjects,
                recent_progress={
                    'recent_avg': recent_avg,
                    'trend': 'progression' if recent_avg > avg_score else 'stable'
                }
            )
            
            return Response({
                'report': report,
                'statistics': {
                    'total_exercises': total_exercises,
                    'avg_score': round(avg_score, 1),
                    'strong_subjects': strong_subjects,
                    'weak_subjects': weak_subjects,
                    'subject_stats': subject_stats
                },
                'period': period,
                'generated_at': now.isoformat()
            })
            
        except Exception as e:
            logger.error(f"Parent report generation failed: {str(e)}")
            return Response(
                {'error': 'Génération du rapport impossible', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def suggest_exercises(self, request):
        """
        Get AI-suggested exercises based on weak areas.
        """
        student = request.user
        
        # Analyze weak topics using ML
        attempts = ExerciseAttempt.objects.filter(
            student=student,
            status='submitted'
        ).select_related('exercise__lesson__course__subject')
        
        attempt_data = []
        for attempt in attempts:
            attempt_data.append({
                'topic': attempt.exercise.lesson.title,
                'score': attempt.score,
                'subject': attempt.exercise.lesson.course.subject.name
            })
        
        weak_topics = MLService.analyze_weak_topics(attempt_data)
        
        if not weak_topics:
            return Response({
                'message': 'Aucun point faible identifié. Continue comme ça !',
                'suggestions': []
            })
        
        # Get subject for suggestions
        subject = request.query_params.get('subject', 'Mathématiques')
        
        # Use AI to suggest new exercises
        try:
            suggestions = AIService.suggest_new_exercises(
                student_level=student.level,
                subject=subject,
                weak_topics=weak_topics[:3],  # Top 3 weak topics
                difficulty_level=2
            )
            
            return Response({
                'weak_topics': weak_topics,
                'suggestions': suggestions,
                'subject': subject
            })
            
        except Exception as e:
            logger.error(f"Exercise suggestion failed: {str(e)}")
            return Response(
                {'error': 'Suggestions impossibles', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def vision_correction(self, request):
        """
        Analyze a photo of a handwritten exercise.
        
        POST data:
        {
            "image": "base64_string",
            "exercise_id": 123 (optional)
        }
        """
        image_b64 = request.data.get('image')
        exercise_id = request.data.get('exercise_id')
        
        if not image_b64:
            return Response({'error': 'Image requise (Base64)'}, status=400)
            
        context = ""
        if exercise_id:
            try:
                ex = Exercise.objects.get(id=exercise_id)
                context = f"Question: {ex.question}. Attendu: {ex.correct_answer}"
            except Exercise.DoesNotExist:
                pass
                
        # 1. OCR Extraction
        vision_result = VisionService.analyze_exercise_photo(image_b64, context)
        
        if not vision_result.get('success'):
            return Response(vision_result, status=400)
            
        # 2. Semantic Analysis with Gemini
        extracted_text = vision_result.get('extracted_text')
        
        # Use existing AIService for correction logic
        correction = AIService.analyze_error(
            question=context,
            student_answer=extracted_text,
            correct_answer="N/A", # Will be handled by prompt if context is rich
            student_level=request.user.level,
            subject="OCR Correction"
        )
        
        return Response({
            'extracted_text': extracted_text,
            'correction': correction
        })

    @action(detail=False, methods=['post'])
    def lesson_audio(self, request):
        """
        Generate natural voice audio for a lesson text.
        """
        text = request.data.get('text')
        if not text:
            return Response({'error': 'Texte requis'}, status=400)
            
        audio_url = SpeechService.generate_speech(text[:5000]) # Limit to 5k chars
        
        if not audio_url:
            return Response({'error': 'Génération audio échouée'}, status=500)
            
        return Response({'audio_url': audio_url})


@api_view(['GET'])
@permission_classes([AllowAny])
def ai_status(request):
    """Check AI service status."""
    try:
        # Test Gemini API
        test_response = AIService.chatbot_response(
            student_message="Test",
            student_level="CP1"
        )
        
        gemini_status = "operational" if test_response else "error"
    except Exception as e:
        gemini_status = f"error: {str(e)}"
    
    # Check ML models
    ml_model, ml_scaler = MLService.load_recommendation_model()
    correction_model, vectorizer = MLService.load_correction_model()
    
    return Response({
        'gemini_api': gemini_status,
        'ml_models': {
            'recommendation': 'loaded' if ml_model else 'not_found',
            'correction': 'loaded' if correction_model else 'not_found'
        },
        'status': 'healthy' if gemini_status == 'operational' else 'degraded'
    })
