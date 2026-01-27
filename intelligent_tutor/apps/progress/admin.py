"""
Admin configuration for Progress app.
"""
from django.contrib import admin
from apps.progress.models import (
    LearningPath, LessonProgress, Achievement,
    StudentAchievement, PerformanceAnalysis
)


@admin.register(LearningPath)
class LearningPathAdmin(admin.ModelAdmin):
    """Admin for LearningPath model."""
    
    list_display = ['student', 'courses_completed', 'lessons_completed', 'average_score']
    list_filter = ['created_at']
    search_fields = ['student__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    """Admin for LessonProgress model."""

    list_display = ['student', 'lesson', 'status', 'progress_percentage', 'exercises_correct']
    list_filter = ['status', 'started_at']
    search_fields = ['student__email', 'lesson__title']
    readonly_fields = ['started_at', 'last_accessed', 'completed_at']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """Admin for Achievement model."""
    
    list_display = ['name', 'category', 'points_reward', 'is_active']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(StudentAchievement)
class StudentAchievementAdmin(admin.ModelAdmin):
    """Admin for StudentAchievement model."""
    
    list_display = ['student', 'achievement', 'earned_at']
    list_filter = ['earned_at', 'achievement__category']
    search_fields = ['student__email', 'achievement__name']
    readonly_fields = ['earned_at']


@admin.register(PerformanceAnalysis)
class PerformanceAnalysisAdmin(admin.ModelAdmin):
    """Admin for PerformanceAnalysis model."""
    
    list_display = ['student', 'analysis_date', 'overall_score']
    list_filter = ['analysis_date', 'created_at']
    search_fields = ['student__email']
    readonly_fields = ['created_at', 'updated_at']
