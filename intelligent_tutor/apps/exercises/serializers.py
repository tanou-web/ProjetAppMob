"""
Serializers for Exercises app.
"""
from rest_framework import serializers
from apps.exercises.models import Exercise, ExerciseAttempt, Quiz, QuizAttempt, ExerciseCategory


class ExerciseCategorySerializer(serializers.ModelSerializer):
    """Serializer for exercise categories."""
    
    class Meta:
        model = ExerciseCategory
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']


class ExerciseSerializer(serializers.ModelSerializer):
    """Serializer for exercises."""
    
    category = ExerciseCategorySerializer(read_only=True)
    
    class Meta:
        model = Exercise
        fields = [
            'id', 'lesson', 'category', 'title', 'description', 'question',
            'type', 'difficulty', 'points', 'estimated_time_minutes',
            'explanation', 'options', 'hints', 'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'correct_answer': {'write_only': True}
        }


class ExerciseAttemptSerializer(serializers.ModelSerializer):
    """Serializer for exercise attempts."""
    
    exercise = ExerciseSerializer(read_only=True)
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = ExerciseAttempt
        fields = [
            'id', 'student_email', 'exercise', 'status', 'student_answer',
            'is_correct', 'score', 'time_spent_seconds', 'hints_used',
            'feedback', 'started_at', 'submitted_at', 'graded_at'
        ]
        read_only_fields = [
            'id', 'is_correct', 'score', 'feedback', 'started_at',
            'submitted_at', 'graded_at'
        ]


class QuizSerializer(serializers.ModelSerializer):
    """Serializer for quizzes."""
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'lesson', 'title', 'description', 'passing_score',
            'time_limit_minutes', 'is_mandatory', 'allow_retake',
            'max_attempts', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class QuizAttemptSerializer(serializers.ModelSerializer):
    """Serializer for quiz attempts."""
    
    quiz = QuizSerializer(read_only=True)
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'student_email', 'quiz', 'status', 'score', 'percentage',
            'passed', 'time_spent_seconds', 'started_at', 'submitted_at',
            'completed_at'
        ]
        read_only_fields = [
            'id', 'score', 'percentage', 'passed', 'started_at',
            'submitted_at', 'completed_at'
        ]
