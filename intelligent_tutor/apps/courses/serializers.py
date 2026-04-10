"""
Serializers for Courses app.
"""
from rest_framework import serializers
from apps.courses.models import Subject, Course, Lesson, CourseEnrollment


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for subjects."""
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'description', 'icon', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LessonListSerializer(serializers.ModelSerializer):
    """Serializer for lesson summary (list view)."""
    exercises_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'course', 'title', 'description', 'order',
            'duration_minutes', 'exercises_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_exercises_count(self, obj):
        return obj.exercises.count()


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for lessons (full detail)."""
    from apps.exercises.serializers import ExerciseSerializer
    exercises = ExerciseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'course', 'title', 'description', 'content', 'order',
            'duration_minutes', 'video_url', 'resources', 'learning_outcomes',
            'exercises', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer for course list view."""
    
    subject = SubjectSerializer(read_only=True)
    lessons_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'subject', 'level', 'status',
            'duration_hours', 'difficulty_level', 'cover_image', 'lessons_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()


class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer for course detail view."""
    
    subject = SubjectSerializer(read_only=True)
    lessons = LessonListSerializer(many=True, read_only=True)
    created_by_user = serializers.StringRelatedField(source='created_by', read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'subject', 'level', 'created_by_user',
            'status', 'duration_hours', 'difficulty_level', 'cover_image',
            'learning_objectives', 'lessons', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for course enrollments."""
    
    course = CourseListSerializer(read_only=True)
    student_email = serializers.StringRelatedField(source='student', read_only=True)
    
    class Meta:
        model = CourseEnrollment
        fields = [
            'id', 'student_email', 'course', 'status', 'progress_percentage',
            'enrolled_at', 'started_at', 'completed_at', 'last_accessed'
        ]
        read_only_fields = ['id', 'enrolled_at', 'started_at', 'completed_at', 'last_accessed']
