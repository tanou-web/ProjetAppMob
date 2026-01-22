"""
Admin configuration for Exercises app.
"""
from django.contrib import admin
from apps.exercises.models import Exercise, ExerciseAttempt, Quiz, QuizAttempt, ExerciseCategory


@admin.register(ExerciseCategory)
class ExerciseCategoryAdmin(admin.ModelAdmin):
    """Admin for ExerciseCategory model."""
    
    list_display = ['name']
    search_fields = ['name']


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    """Admin for Exercise model."""
    
    list_display = ['title', 'lesson', 'type', 'difficulty', 'points', 'is_active']
    list_filter = ['type', 'difficulty', 'is_active', 'created_at']
    search_fields = ['title', 'question', 'lesson__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ExerciseAttempt)
class ExerciseAttemptAdmin(admin.ModelAdmin):
    """Admin for ExerciseAttempt model."""
    
    list_display = ['student', 'exercise', 'status', 'is_correct', 'score', 'submitted_at']
    list_filter = ['status', 'is_correct', 'submitted_at']
    search_fields = ['student__email', 'exercise__title']
    readonly_fields = ['started_at', 'submitted_at', 'graded_at']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    """Admin for Quiz model."""
    
    list_display = ['title', 'lesson', 'passing_score', 'is_mandatory', 'allow_retake']
    list_filter = ['is_mandatory', 'allow_retake', 'created_at']
    search_fields = ['title', 'lesson__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    """Admin for QuizAttempt model."""
    
    list_display = ['student', 'quiz', 'status', 'score', 'percentage', 'passed', 'submitted_at']
    list_filter = ['status', 'passed', 'submitted_at']
    search_fields = ['student__email', 'quiz__title']
    readonly_fields = ['started_at', 'submitted_at', 'completed_at']
