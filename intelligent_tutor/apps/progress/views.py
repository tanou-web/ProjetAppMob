"""
Views for Progress tracking app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from apps.progress.models import (
    LearningPath, LessonProgress, Achievement,
    StudentAchievement, PerformanceAnalysis
)
from apps.progress.serializers import (
    LearningPathSerializer, LessonProgressSerializer,
    AchievementSerializer, StudentAchievementSerializer,
    PerformanceAnalysisSerializer
)
from services.ai_service import AIService



class LearningPathViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for learning paths."""
    
    serializer_class = LearningPathSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return LearningPath.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_path(self, request):
        """Get current user's learning path."""
        path = get_object_or_404(LearningPath, student=request.user)
        serializer = self.get_serializer(path)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get learning statistics."""
        path, created = LearningPath.objects.get_or_create(student=request.user)
        
        # Calculate actual metrics
        # Calculate actual total exercises in enrolled courses for a realistic progress bar
        from apps.exercises.models import Exercise
        from apps.courses.models import CourseEnrollment
        
        enrolled_course_ids = CourseEnrollment.objects.filter(
            student=request.user, 
            status='enrolled'
        ).values_list('course_id', flat=True)
        active_enrollments = enrolled_course_ids.count()
        
        # Count all exercises in all lessons of enrolled courses
        total_exercises_available = Exercise.objects.filter(
            lesson__course_id__in=enrolled_course_ids
        ).count()
        
        # Use available exercises as denominator, with completed as minimum
        total_exercises = max(path.exercises_completed, total_exercises_available)
        
        success_rate = (path.average_score / 100) if path.exercises_completed > 0 else 0
        
        # Calculate subject-specific scores for AI analysis
        from apps.exercises.models import ExerciseAttempt
        recent_attempts = ExerciseAttempt.objects.filter(student=request.user).order_by('-submitted_at')[:20]
        
        subject_scores = {}
        # Simple aggregation for AI context
        for attempt in recent_attempts:
            # Ensure subject is a string name
            subj_obj = getattr(attempt.exercise, 'subject', None)
            subj_name = subj_obj.name if subj_obj and hasattr(subj_obj, 'name') else "Général"
            
            if subj_name not in subject_scores:
                subject_scores[subj_name] = []
            subject_scores[subj_name].append(attempt.score)
        
        # Calculate averages with string keys
        final_subject_scores = {}
        for name, scores in subject_scores.items():
            final_subject_scores[name] = sum(scores) / len(scores)
        
        # Override with clean dict
        subject_scores = final_subject_scores

        # AI assessment of "Real Level"
        ai_assessment = AIService.assess_student_level(
            student_name=f"{request.user.first_name} {request.user.last_name}",
            current_level=request.user.level or "CP1",
            statistics={
                'avg_score': path.average_score,
                'total_exercises': path.exercises_completed,
                'study_time_hours': path.total_study_time_seconds / 3600
            },
            subject_scores=subject_scores,
            recent_performance=[{'score': a.score, 'topic': a.exercise.topic} for a in recent_attempts[:10]]
        )

        # Save assessment to PerformanceAnalysis for later use in recommendations
        try:
            PerformanceAnalysis.objects.create(
                student=request.user,
                overall_score=path.average_score,
                subjects_scores=subject_scores,
                strengths=ai_assessment.get('strengths', []),
                weaknesses=ai_assessment.get('weaknesses', []),
                recommendations=[ai_assessment.get('explanation', '')],
                suggested_focus_areas=ai_assessment.get('focus_areas', []),
                improvement_trends={'real_level': ai_assessment.get('real_level'), 'status': ai_assessment.get('status')}
            )
        except Exception as e:
            logger.error(f"Failed to save performance analysis: {str(e)}")

        stats = {
            'total_exercises': total_exercises,
            'completed_exercises': path.exercises_completed,
            'success_rate': success_rate,
            'average_score': path.average_score,
            'total_points': int(path.average_score * path.exercises_completed / 10),
            'courses_enrolled': active_enrollments, 
            'last_activity': path.updated_at.isoformat(),
            'total_study_time_hours': path.total_study_time_seconds / 3600,
            'learning_streak': path.learning_streak_days,
            'real_level_assessment': ai_assessment
        }
        
        return Response(stats)


class LessonProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for lesson progress."""
    
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['-last_accessed']
    
    def get_queryset(self):
        return LessonProgress.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_course(self, request):
        """Get progress for lessons in a specific course."""
        course_id = request.query_params.get('course_id')
        
        if not course_id:
            return Response(
                {'detail': 'course_id parameter required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        progress = LessonProgress.objects.filter(
            student=request.user,
            lesson__course_id=course_id
        )
        
        page = self.paginate_queryset(progress)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['put'])
    def update_progress(self, request, pk=None):
        """Update lesson progress."""
        progress = self.get_object()
        
        if progress.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(progress, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for achievements."""
    
    queryset = Achievement.objects.filter(is_active=True)
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]


class StudentAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for student achievements."""
    
    serializer_class = StudentAchievementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['-earned_at']
    
    def get_queryset(self):
        return StudentAchievement.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_achievements(self, request):
        """Get current user's achievements."""
        achievements = self.get_queryset()
        
        page = self.paginate_queryset(achievements)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(achievements, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get achievements summary."""
        achievements = self.get_queryset()
        total = achievements.count()
        
        by_category = {}
        for achievement in achievements:
            category = achievement.achievement.category
            by_category[category] = by_category.get(category, 0) + 1
        
        return Response({
            'total_achievements': total,
            'by_category': by_category,
        })


class PerformanceAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for performance analysis."""
    
    serializer_class = PerformanceAnalysisSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['-analysis_date']
    
    def get_queryset(self):
        return PerformanceAnalysis.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest performance analysis."""
        analysis = PerformanceAnalysis.objects.filter(
            student=request.user
        ).order_by('-analysis_date').first()
        
        if not analysis:
            return Response(
                {'detail': 'No analysis available yet.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(analysis)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def insights(self, request):
        """Get AI-generated insights."""
        analysis = PerformanceAnalysis.objects.filter(
            student=request.user
        ).order_by('-analysis_date').first()
        
        if not analysis:
            return Response(
                {'detail': 'No analysis available yet.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        insights = {
            'overall_performance': analysis.overall_score,
            'strengths': analysis.strengths,
            'weaknesses': analysis.weaknesses,
            'recommendations': analysis.recommendations,
            'focus_areas': analysis.suggested_focus_areas,
            'improvement_trends': analysis.improvement_trends,
        }
        
        return Response(insights)
