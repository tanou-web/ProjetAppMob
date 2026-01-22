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
        path = get_object_or_404(LearningPath, student=request.user)
        
        stats = {
            'total_study_time_hours': path.total_study_time_seconds / 3600,
            'courses_completed': path.courses_completed,
            'lessons_completed': path.lessons_completed,
            'exercises_completed': path.exercises_completed,
            'average_score': path.average_score,
            'learning_streak': path.learning_streak_days,
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
