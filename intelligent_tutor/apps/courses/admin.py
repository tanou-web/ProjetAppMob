"""
Admin configuration for Courses app.
"""
from django.contrib import admin
from apps.courses.models import Subject, Course, Lesson, CourseEnrollment


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    """Admin for Subject model."""
    
    list_display = ['name', 'code', 'created_at']
    search_fields = ['name', 'code']
    list_filter = ['created_at']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin for Course model."""
    
    list_display = ['title', 'subject', 'level', 'difficulty_level', 'status', 'created_at']
    list_filter = ['status', 'level', 'subject', 'difficulty_level', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {'fields': ('title', 'description', 'subject')}),
        ('Details', {'fields': ('level', 'difficulty_level', 'duration_hours')}),
        ('Content', {'fields': ('cover_image', 'learning_objectives')}),
        ('Management', {'fields': ('status', 'order', 'created_by')}),
        ('Metadata', {'fields': ('created_at', 'updated_at')})
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    """Admin for Lesson model."""
    
    list_display = ['title', 'course', 'order', 'duration_minutes', 'created_at']
    list_filter = ['course', 'created_at']
    search_fields = ['title', 'course__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    """Admin for CourseEnrollment model."""
    
    list_display = ['student', 'course', 'status', 'progress_percentage', 'enrolled_at']
    list_filter = ['status', 'enrolled_at']
    search_fields = ['student__email', 'course__title']
    readonly_fields = ['enrolled_at', 'started_at', 'completed_at', 'last_accessed']
