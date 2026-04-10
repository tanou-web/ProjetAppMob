"""
Views for Exercises app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from apps.exercises.models import Exercise, ExerciseAttempt, Quiz, QuizAttempt
from apps.exercises.serializers import (
    ExerciseSerializer, ExerciseAttemptSerializer,
    QuizSerializer, QuizAttemptSerializer
)
from apps.recommendations.models import ErrorAnalysis, SmartExplanation
import logging

logger = logging.getLogger(__name__)


class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for exercises."""
    
    queryset = Exercise.objects.filter(is_active=True)
    serializer_class = ExerciseSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'question']
    ordering_fields = ['difficulty', 'order']
    
    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user

        # Filter by level if user is a student
        if user.is_authenticated and hasattr(user, 'role') and user.role == 'student' and user.level:
            queryset = queryset.filter(lesson__course__level=user.level)

        lesson_id = self.request.query_params.get('lesson_id')
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset


class ExerciseAttemptViewSet(viewsets.ModelViewSet):
    """ViewSet for exercise attempts."""
    
    serializer_class = ExerciseAttemptSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['-started_at']
    
    def get_queryset(self):
        return ExerciseAttempt.objects.filter(student=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Start or update an exercise attempt."""
        exercise_id = request.data.get('exercise')
        exercise = Exercise.objects.get(id=exercise_id)
        
        attempt, created = ExerciseAttempt.objects.get_or_create(
            student=request.user,
            exercise=exercise,
            status='in_progress'
        )
        
        if not created:
            # Update existing attempt
            serializer = self.get_serializer(attempt, data=request.data, partial=True)
        else:
            serializer = self.get_serializer(attempt)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def submit(self, request):
        """Submit an exercise attempt (creates or updates)."""
        from apps.recommendations.error_analysis import ErrorAnalyzer
        from apps.recommendations.explanation_generator import ExplanationGenerator
        
        exercise_id = request.data.get('exercise')
        student_answer = request.data.get('student_answer')
        
        if not exercise_id:
            return Response({'detail': 'Exercise ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({'detail': 'Exercise not found.'}, status=status.HTTP_404_NOT_FOUND)
            
        # Get or create the attempt
        attempt, created = ExerciseAttempt.objects.get_or_create(
            student=request.user,
            exercise=exercise,
            defaults={'status': 'submitted', 'submitted_at': timezone.now()}
        )
        
        attempt.status = 'submitted'
        attempt.submitted_at = timezone.now()
        attempt.student_answer = student_answer
        
        # Auto-grade with AI assistance
        if exercise.type in ['multiple_choice', 'true_false']:
            # Direct comparison for MCQ and True/False
            correct = str(exercise.correct_answer).strip().lower()
            provided = str(student_answer).strip().lower()
            attempt.is_correct = provided == correct
            attempt.score = exercise.points if attempt.is_correct else 0
        elif exercise.type in ['fill_blank', 'short_answer']:
            # Use ML model for text-based answers
            try:
                explanation = SmartExplanation.generate_for_attempt(attempt)
                attempt.is_correct = explanation.is_correct
                # Score based on confidence (0-100)
                attempt.score = int((explanation.confidence_score / 100) * exercise.points)
            except Exception as e:
                # Fallback to simple comparison
                import logging
                logging.warning(f"ML correction failed, using fallback: {str(e)}")
                correct = str(exercise.correct_answer).strip().lower()
                provided = str(student_answer).strip().lower()
                attempt.is_correct = provided == correct
                attempt.score = exercise.points if attempt.is_correct else 0
        else:
            # For other types, use simple comparison
            correct = str(exercise.correct_answer).strip().lower()
            provided = str(student_answer).strip().lower()
            attempt.is_correct = provided == correct
            attempt.score = exercise.points if attempt.is_correct else 0
        
        attempt.save()
        
        # Analyser l'erreur si la réponse est incorrecte
        if not attempt.is_correct:
            try:
                error_analysis = ErrorAnalyzer.analyze_attempt(attempt)
                # Générer une explication intelligente
                explanation = ExplanationGenerator.generate_explanation(attempt, error_analysis)
            except Exception as e:
                import logging
                logging.error(f"Error during AI analysis: {str(e)}")
        
        serializer = self.get_serializer(attempt)
        response_data = serializer.data
        
        # Ajouter les analyses si disponibles
        if not attempt.is_correct:
            try:
                from apps.recommendations.serializers import ErrorAnalysisSerializer, SmartExplanationSerializer
                
                error_analysis = ErrorAnalysis.objects.filter(exercise_attempt=attempt).first()
                if error_analysis:
                    response_data['error_analysis'] = ErrorAnalysisSerializer(error_analysis).data
                
                explanation = SmartExplanation.objects.filter(exercise_attempt=attempt).first()
                if explanation:
                    response_data['smart_explanation'] = SmartExplanationSerializer(explanation).data
            except ImportError:
                pass
        
        return Response(response_data)
    
    @action(detail=True, methods=['post'])
    def get_hint(self, request, pk=None):
        """Get a hint for an exercise attempt."""
        attempt = self.get_object()
        
        if attempt.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        hints = attempt.exercise.hints
        hints_used = attempt.hints_used
        
        if hints_used < len(hints):
            attempt.hints_used += 1
            attempt.save()
            return Response({
                'hint': hints[hints_used],
                'hints_used': attempt.hints_used,
                'hints_total': len(hints)
            })
        
        return Response({'detail': 'No more hints available.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='submit-interactive', permission_classes=[AllowAny])
    def submit_interactive(self, request):
        """
        Soumettre des résultats d'activités interactives (Multiplication, etc.)
        Format: { 'lesson_id': int, 'results': [ {question, student_answer, correct_answer}, ... ] }
        """
        print(f"[DEBUG] submit_interactive CALLED with data: {request.data}")
        lesson_id = request.data.get('lesson_id')
        results = request.data.get('results', [])
        
        if not lesson_id or not results:
            return Response({'detail': 'lesson_id et results sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
        
        from apps.courses.models import Lesson
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({'detail': 'Leçon non trouvée.'}, status=status.HTTP_404_NOT_FOUND)
            
        processed_count = 0
        for res in results:
            question_text = res.get('question')
            student_answer = str(res.get('student_answer', '')).strip()
            correct_answer = str(res.get('correct_answer', '')).strip()
            
            if not question_text:
                continue
                
            # Trouver ou créer un exercice spécifique pour cette question interactive
            # Cela permet à l'IA d'agréger les erreurs sur le même concept
            exercise, _ = Exercise.objects.get_or_create(
                lesson=lesson,
                question=question_text,
                defaults={
                    'title': f"Calcul: {question_text}",
                    'type': 'short_answer',
                    'correct_answer': correct_answer,
                    'is_active': False, # Ne pas polluer l'interface standard
                    'description': f"Exercice généré automatiquement depuis l'outil interactif de {lesson.title}"
                }
            )
            
            # Créer la tentative
            is_correct = student_answer == correct_answer
            attempt = ExerciseAttempt.objects.create(
                student=request.user,
                exercise=exercise,
                student_answer=student_answer,
                is_correct=is_correct,
                score=exercise.points if is_correct else 0,
                status='submitted',
                submitted_at=timezone.now()
            )
            
            # Déclencher l'analyse IA si erreur
            if not is_correct:
                try:
                    from apps.recommendations.error_analysis import ErrorAnalyzer
                    from apps.recommendations.explanation_generator import ExplanationGenerator
                    analysis = ErrorAnalyzer.analyze_attempt(attempt)
                    if analysis:
                        ExplanationGenerator.generate_explanation(attempt, analysis)
                except Exception as e:
                    logger.error(f"Erreur lors de l'analyse IA interactive: {str(e)}")
            
            processed_count += 1
            
        return Response({'status': 'success', 'processed': processed_count})
    
    @action(detail=False, methods=['get'])
    def adaptive(self, request):
        """Get exercises adapted to student's level and performance."""
        from django.db.models import Avg, Count, Q
        
        student = request.user
        
        # Calculate student's average score per subject
        from apps.courses.models import Subject
        subject_stats = {}
        
        for subject in Subject.objects.all():
            attempts = ExerciseAttempt.objects.filter(
                student=student,
                exercise__lesson__course__subject=subject,
                status='submitted'
            )
            
            if attempts.exists():
                avg_score = attempts.aggregate(Avg('score'))['score__avg'] or 0
                total_attempts = attempts.count()
                
                # Determine appropriate difficulty
                if avg_score >= 80:
                    target_difficulty = 4  # Hard
                elif avg_score >= 60:
                    target_difficulty = 3  # Medium
                else:
                    target_difficulty = 2  # Easy
                
                subject_stats[subject.code] = {
                    'avg_score': avg_score,
                    'total_attempts': total_attempts,
                    'recommended_difficulty': target_difficulty
                }
        
        # Get recommended exercises (CONSTRAINED BY STUDENT LEVEL)
        recommended_exercises = []
        for subject_code, stats in subject_stats.items():
            exercises = Exercise.objects.filter(
                lesson__course__subject__code=subject_code,
                lesson__course__level=student.level, # CRITICAL: Filter by level
                difficulty=stats['recommended_difficulty'],
                is_active=True
            ).exclude(
                attempts__student=student,
                attempts__is_correct=True
            )[:5]
            
            recommended_exercises.extend(exercises)
        
        # If no specific recommendations, suggest from weak areas (STILL CONSTRAINED BY LEVEL)
        if not recommended_exercises:
            weak_exercises = Exercise.objects.filter(
                lesson__course__level=student.level, # CRITICAL: Filter by level
                attempts__student=student,
                attempts__is_correct=False,
                is_active=True
            ).distinct()[:10]
            recommended_exercises = list(weak_exercises)
        
        serializer = ExerciseSerializer(recommended_exercises, many=True)
        return Response({
            'subject_stats': subject_stats,
            'recommended_exercises': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def to_review(self, request):
        """Get lessons and exercises that need review (score < 60%)."""
        from apps.courses.models import Lesson
        from apps.courses.serializers import LessonSerializer
        from django.db.models import Avg
        
        student = request.user
        
        # Find lessons in the student's level where they scored < 60% on average
        weak_lessons = []
        # Filter lessons by the student's current level
        student_level_lessons = Lesson.objects.filter(
            course__level=student.level,
            exercises__attempts__student=student
        ).distinct()
        
        for lesson in student_level_lessons:
            avg_score = ExerciseAttempt.objects.filter(
                student=student,
                exercise__lesson=lesson,
                status='submitted'
            ).aggregate(Avg('score'))['score__avg']
            
            if avg_score and avg_score < 60:
                weak_lessons.append({
                    'lesson': lesson,
                    'avg_score': avg_score,
                    'attempts_count': ExerciseAttempt.objects.filter(
                        student=student,
                        exercise__lesson=lesson
                    ).count()
                })
        
        # Sort by lowest score first
        weak_lessons.sort(key=lambda x: x['avg_score'])
        
        # Get exercises from these lessons
        review_exercises = []
        for item in weak_lessons[:5]:  # Top 5 weakest lessons
            exercises = Exercise.objects.filter(
                lesson=item['lesson'],
                is_active=True
            )[:3]
            review_exercises.extend(exercises)
        
        return Response({
            'weak_lessons': [
                {
                    'lesson': LessonSerializer(item['lesson']).data,
                    'avg_score': item['avg_score'],
                    'attempts_count': item['attempts_count']
                }
                for item in weak_lessons[:10]
            ],
            'review_exercises': ExerciseSerializer(review_exercises, many=True).data
        })


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for quizzes."""
    
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user

        # Filter by level if user is a student
        if user.is_authenticated and hasattr(user, 'role') and user.role == 'student' and user.level:
            queryset = queryset.filter(lesson__course__level=user.level)

        lesson_id = self.request.query_params.get('lesson_id')
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset


class QuizAttemptViewSet(viewsets.ModelViewSet):
    """ViewSet for quiz attempts."""
    
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['-started_at']
    
    def get_queryset(self):
        return QuizAttempt.objects.filter(student=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Start a quiz attempt."""
        quiz_id = request.data.get('quiz')
        quiz = Quiz.objects.get(id=quiz_id)
        
        # Check max attempts
        if quiz.max_attempts:
            completed_attempts = QuizAttempt.objects.filter(
                student=request.user,
                quiz=quiz,
                status='graded'
            ).count()
            
            if completed_attempts >= quiz.max_attempts:
                return Response(
                    {'detail': 'Maximum attempts reached.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        attempt = QuizAttempt.objects.create(
            student=request.user,
            quiz=quiz,
            status='in_progress'
        )
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit a quiz."""
        attempt = self.get_object()
        
        if attempt.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        attempt.status = 'submitted'
        attempt.submitted_at = timezone.now()
        
        # Calculate score
        answers = request.data.get('answers', {})
        total_points = 0
        earned_points = 0
        
        for exercise_id, student_answer in answers.items():
            from apps.exercises.models import Exercise
            try:
                exercise = Exercise.objects.get(id=exercise_id)
                total_points += exercise.points
                
                if student_answer == exercise.correct_answer:
                    earned_points += exercise.points
            except Exercise.DoesNotExist:
                continue
        
        attempt.score = earned_points
        attempt.percentage = (earned_points / total_points * 100) if total_points > 0 else 0
        attempt.passed = attempt.percentage >= attempt.quiz.passing_score
        attempt.status = 'graded'
        attempt.completed_at = timezone.now()
        attempt.save()
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data)
