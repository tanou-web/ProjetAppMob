"""
Serializers for Recommendations app.
"""
from rest_framework import serializers
from apps.recommendations.models import (
    ContentRecommendation, LearningStyleProfile,
    AdaptiveRecommendationEngine, RecommendationFeedback,
    ErrorAnalysis, IntelligentRevisionItem, SmartExplanation
)


class ContentRecommendationSerializer(serializers.ModelSerializer):
    """Serializer for content recommendations."""
    
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = ContentRecommendation
        fields = [
            'id', 'student_email', 'content_type', 'content_id', 'content_title',
            'confidence_score', 'reason', 'recommendation_factors',
            'is_viewed', 'is_accepted', 'user_rating', 'created_at',
            'viewed_at'
        ]
        read_only_fields = ['id', 'created_at', 'viewed_at']


class LearningStyleProfileSerializer(serializers.ModelSerializer):
    """Serializer for learning style profiles."""
    
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = LearningStyleProfile
        fields = [
            'id', 'student_email', 'primary_style', 'secondary_style',
            'visual_preference', 'auditory_preference', 'kinesthetic_preference',
            'reading_writing_preference', 'pace_preference', 'difficulty_preference',
            'last_updated'
        ]
        read_only_fields = ['id', 'last_updated']


class AdaptiveRecommendationEngineSerializer(serializers.ModelSerializer):
    """Serializer for recommendation engines."""
    
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = AdaptiveRecommendationEngine
        fields = [
            'id', 'student_email', 'performance_weight', 'interest_weight',
            'learning_style_weight', 'engagement_weight',
            'recommendation_frequency_hours', 'max_recommendations_per_session',
            'algorithm_version', 'last_recommendation_generated',
            'total_recommendations_generated', 'average_recommendation_quality',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'last_recommendation_generated',
            'total_recommendations_generated', 'average_recommendation_quality',
            'created_at', 'updated_at'
        ]


class RecommendationFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for recommendation feedback."""
    
    class Meta:
        model = RecommendationFeedback
        fields = [
            'id', 'recommendation', 'feedback_type', 'comment', 'rating',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ErrorAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for error analysis."""
    
    exercise_title = serializers.CharField(source='exercise.title', read_only=True)
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = ErrorAnalysis
        fields = [
            'id', 'student_email', 'exercise_title', 'error_type',
            'concept_involved', 'description', 'student_answer', 'correct_answer',
            'concept_understanding_level', 'misconception_identified', 'root_cause',
            'partial_credit', 'suggested_topics', 'similar_past_errors', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SmartExplanationSerializer(serializers.ModelSerializer):
    """Serializer for smart explanations."""
    
    exercise_title = serializers.CharField(source='exercise_attempt.exercise.title', read_only=True)
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = SmartExplanation
        fields = [
            'id', 'student_email', 'exercise_title', 'explanation_type',
            'content', 'uses_examples', 'uses_analogies', 'is_interactive',
            'student_rating', 'was_helpful', 'follow_up_score', 'created_at', 'viewed_at'
        ]
        read_only_fields = ['id', 'created_at', 'viewed_at']


class IntelligentRevisionItemSerializer(serializers.ModelSerializer):
    """Serializer for intelligent revision items."""
    
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    priority = serializers.IntegerField(source='priority_score', read_only=True)
    days_since_error = serializers.SerializerMethodField(read_only=True)
    next_review_date = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = IntelligentRevisionItem
        fields = [
            'id', 'student_email', 'concept', 'reason', 'priority_score', 'priority',
            'error_count', 'last_error', 'related_exercises', 'related_lessons',
            'custom_tips', 'status', 'revision_attempts', 'mastery_score',
            'created_at', 'updated_at', 'completed_at', 'days_since_error', 'next_review_date'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']
    
    def get_days_since_error(self, obj):
        from datetime import datetime, timezone
        if obj.last_error:
            # Use timezone aware comparison
            from django.utils import timezone as django_tz
            return (django_tz.now() - obj.last_error).days
        return None

    def get_next_review_date(self, obj):
        from django.utils import timezone
        import datetime
        # Simple logic: next review in 1 day
        return (timezone.now() + datetime.timedelta(days=1)).isoformat()
