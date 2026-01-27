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


class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for exercises."""
    
    queryset = Exercise.objects.filter(is_active=True)
    serializer_class = ExerciseSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'question']
    ordering_fields = ['difficulty', 'order']
    
    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson_id')
        if lesson_id:
            return self.queryset.filter(lesson_id=lesson_id)
        return self.queryset


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
        
        # Auto-grade
        if exercise.type in ['multiple_choice', 'true_false', 'short_answer']:
            # Normaliser les réponses pour comparaison
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


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for quizzes."""
    
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson_id')
        if lesson_id:
            return self.queryset.filter(lesson_id=lesson_id)
        return self.queryset


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
