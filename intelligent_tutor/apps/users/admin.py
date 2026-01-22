"""
Admin configuration for Users app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.users.models import User, StudentProfile, TeacherProfile, Notification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin for User model."""
    
    list_display = ['email', 'first_name', 'last_name', 'role', 'level', 'is_active', 'created_at']
    list_filter = ['role', 'level', 'is_active', 'is_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone', 'date_of_birth')}),
        ('Profile', {'fields': ('role', 'level', 'bio', 'profile_image')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified')}),
        ('Metadata', {'fields': ('last_login', 'last_login_ip', 'created_at', 'updated_at')})
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    """Admin for StudentProfile model."""
    
    list_display = ['user', 'learning_style', 'learning_speed', 'total_study_hours']
    list_filter = ['learning_style', 'created_at']
    search_fields = ['user__email', 'user__first_name']


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    """Admin for TeacherProfile model."""
    
    list_display = ['user', 'specialization', 'experience_years', 'is_verified_teacher']
    list_filter = ['is_verified_teacher', 'created_at']
    search_fields = ['user__email', 'specialization']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin for Notification model."""
    
    list_display = ['title', 'user', 'type', 'is_read', 'created_at']
    list_filter = ['type', 'is_read', 'created_at']
    search_fields = ['user__email', 'title']
    readonly_fields = ['created_at', 'read_at']
