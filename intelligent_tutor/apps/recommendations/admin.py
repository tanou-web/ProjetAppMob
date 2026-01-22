"""
Admin configuration for Recommendations app.
"""
from django.contrib import admin
from apps.recommendations.models import (
    ContentRecommendation, LearningStyleProfile,
    AdaptiveRecommendationEngine, RecommendationFeedback,
    ErrorAnalysis, IntelligentRevisionItem, SmartExplanation
)


@admin.register(ContentRecommendation)
class ContentRecommendationAdmin(admin.ModelAdmin):
    """Admin for ContentRecommendation model."""
    
    list_display = ['content_title', 'student', 'confidence_score', 'is_viewed', 'is_accepted', 'created_at']
    list_filter = ['content_type', 'is_viewed', 'is_accepted', 'created_at']
    search_fields = ['student__email', 'content_title']
    readonly_fields = ['created_at', 'viewed_at']


@admin.register(LearningStyleProfile)
class LearningStyleProfileAdmin(admin.ModelAdmin):
    """Admin for LearningStyleProfile model."""
    
    list_display = ['student', 'primary_style', 'secondary_style', 'pace_preference']
    list_filter = ['primary_style', 'secondary_style']
    search_fields = ['student__email']
    readonly_fields = ['last_updated']


@admin.register(AdaptiveRecommendationEngine)
class AdaptiveRecommendationEngineAdmin(admin.ModelAdmin):
    """Admin for AdaptiveRecommendationEngine model."""
    
    list_display = ['student', 'algorithm_version', 'is_active', 'total_recommendations_generated']
    list_filter = ['is_active', 'algorithm_version', 'created_at']
    search_fields = ['student__email']
    readonly_fields = ['created_at', 'updated_at', 'last_recommendation_generated']


@admin.register(RecommendationFeedback)
class RecommendationFeedbackAdmin(admin.ModelAdmin):
    """Admin for RecommendationFeedback model."""
    
    list_display = ['recommendation', 'feedback_type', 'rating', 'created_at']
    list_filter = ['feedback_type', 'rating', 'created_at']
    search_fields = ['recommendation__content_title', 'comment']
    readonly_fields = ['created_at']


@admin.register(ErrorAnalysis)
class ErrorAnalysisAdmin(admin.ModelAdmin):
    """Admin for ErrorAnalysis model."""
    
    list_display = ['student', 'exercise', 'error_type', 'concept_involved', 'concept_understanding_level', 'created_at']
    list_filter = ['error_type', 'concept_understanding_level', 'created_at']
    search_fields = ['student__email', 'exercise__title', 'concept_involved']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('exercise_attempt', 'student', 'exercise', 'created_at', 'updated_at')
        }),
        ('Analyse d\'erreur', {
            'fields': ('error_type', 'concept_involved', 'description')
        }),
        ('Analyse conceptuelle', {
            'fields': ('concept_understanding_level', 'misconception_identified', 'root_cause')
        }),
        ('Données supplémentaires', {
            'fields': ('student_answer', 'correct_answer', 'partial_credit', 'suggested_topics', 'similar_past_errors')
        }),
    )


@admin.register(SmartExplanation)
class SmartExplanationAdmin(admin.ModelAdmin):
    """Admin for SmartExplanation model."""
    
    list_display = ['student', 'explanation_type', 'uses_examples', 'student_rating', 'created_at']
    list_filter = ['explanation_type', 'uses_examples', 'uses_analogies', 'created_at']
    search_fields = ['student__email']
    readonly_fields = ['created_at', 'viewed_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('exercise_attempt', 'student', 'explanation_type', 'created_at', 'viewed_at')
        }),
        ('Contenu', {
            'fields': ('content',),
            'classes': ('collapse',)
        }),
        ('Caractéristiques', {
            'fields': ('is_interactive', 'uses_examples', 'uses_analogies')
        }),
        ('Feedback', {
            'fields': ('student_rating', 'was_helpful', 'follow_up_score')
        }),
    )


@admin.register(IntelligentRevisionItem)
class IntelligentRevisionItemAdmin(admin.ModelAdmin):
    """Admin for IntelligentRevisionItem model."""
    
    list_display = ['student', 'concept', 'priority_score', 'status', 'mastery_score', 'updated_at']
    list_filter = ['status', 'priority_score', 'created_at']
    search_fields = ['student__email', 'concept']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('student', 'concept', 'status', 'created_at', 'updated_at', 'completed_at')
        }),
        ('Priorité et raison', {
            'fields': ('reason', 'priority_score')
        }),
        ('Erreurs passées', {
            'fields': ('error_count', 'last_error')
        }),
        ('Ressources', {
            'fields': ('related_exercises', 'related_lessons', 'custom_tips')
        }),
        ('Progression', {
            'fields': ('revision_attempts', 'mastery_score')
        }),
    )

