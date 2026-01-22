"""
Serializers for Users app.
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.users.models import User, StudentProfile, TeacherProfile, Notification


class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer."""
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'level',
            'phone', 'profile_image', 'bio', 'date_of_birth', 'is_verified',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'password', 'password_confirm',
            'role', 'level', 'phone'
        ]
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        
        # Create related profiles
        if user.role == 'student':
            StudentProfile.objects.create(user=user)
        elif user.role == 'teacher':
            TeacherProfile.objects.create(user=user, specialization='', qualification='')
        
        return user


class StudentProfileSerializer(serializers.ModelSerializer):
    """Serializer for student profiles."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'id', 'user', 'learning_style', 'interests', 'learning_speed',
            'total_study_hours', 'last_activity', 'strengths', 'weaknesses',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TeacherProfileSerializer(serializers.ModelSerializer):
    """Serializer for teacher profiles."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = [
            'id', 'user', 'specialization', 'qualification', 'experience_years',
            'is_verified_teacher', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications."""
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message', 'is_read', 'data',
            'created_at', 'read_at'
        ]
        read_only_fields = ['id', 'created_at']
