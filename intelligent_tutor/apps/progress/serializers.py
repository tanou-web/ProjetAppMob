"""
Serializers for Progress tracking app.
"""
from rest_framework import serializers
from apps.progress.models import LearningPath, LessonProgress, Achievement, StudentAchievement, PerformanceAnalysis


class LearningPathSerializer(serializers.ModelSerializer):
    """Serializer for learning paths."""
    
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = LearningPath
        fields = [
            'id', 'student_email', 'current_level', 'courses_completed',
            'lessons_completed', 'exercises_completed', 'total_study_time_seconds',
            'average_score', 'last_learning_date', 'learning_streak_days',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LessonProgressSerializer(serializers.ModelSerializer):
    """Serializer for lesson progress."""
    
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    lesson_title = serializers.StringRelatedField(source='lesson', read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = [
            'id', 'student_email', 'lesson', 'lesson_title', 'status',
            'progress_percentage', 'exercises_completed', 'exercises_correct',
            'average_exercise_score', 'time_spent_seconds', 'started_at',
            'last_accessed', 'completed_at'
        ]
        read_only_fields = [
            'id', 'started_at', 'last_accessed', 'completed_at'
        ]


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements."""
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'category', 'badge_image',
            'points_reward', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentAchievementSerializer(serializers.ModelSerializer):
    """Serializer for student achievements."""
    
    achievement = AchievementSerializer(read_only=True)
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = StudentAchievement
        fields = ['id', 'student_email', 'achievement', 'earned_at']
        read_only_fields = ['id', 'earned_at']


class PerformanceAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for performance analysis."""
    
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = PerformanceAnalysis
        fields = [
            'id', 'student_email', 'analysis_date', 'overall_score',
            'subjects_scores', 'strengths', 'weaknesses', 'recommendations',
            'suggested_focus_areas', 'improvement_trends', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
