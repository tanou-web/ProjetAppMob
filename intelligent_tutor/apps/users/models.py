"""
Users app models for authentication and user management.
"""
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator, MaxValueValidator


class CustomUserManager(BaseUserManager):
    """Custom user manager."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Extended User model."""
    
    ROLE_CHOICES = (
        ('student', 'Élève'),
        ('teacher', 'Enseignant'),
        ('parent', 'Parent'),
        ('admin', 'Administrateur'),
    )
    
    LEVEL_CHOICES = (
        ('primary_1', 'Primaire 1'),
        ('primary_2', 'Primaire 2'),
        ('primary_3', 'Primaire 3'),
        ('primary_4', 'Primaire 4'),
        ('primary_5', 'Primaire 5'),
        ('primary_6', 'Primaire 6'),
        ('secondary_1', 'Secondaire 1'),
        ('secondary_2', 'Secondaire 2'),
        ('secondary_3', 'Secondaire 3'),
        ('secondary_4', 'Secondaire 4'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class StudentProfile(models.Model):
    """Extended profile for students."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    learning_style = models.CharField(max_length=50, blank=True)  # visual, auditory, kinesthetic
    interests = models.JSONField(default=list, blank=True)
    learning_speed = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.5), MaxValueValidator(2.0)]
    )
    total_study_hours = models.FloatField(default=0)
    last_activity = models.DateTimeField(null=True, blank=True)
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Profil Étudiant'
        verbose_name_plural = 'Profils Étudiants'
    
    def __str__(self):
        return f"Profile: {self.user.email}"


class TeacherProfile(models.Model):
    """Extended profile for teachers."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    specialization = models.CharField(max_length=100)
    qualification = models.TextField()
    experience_years = models.IntegerField(default=0)
    is_verified_teacher = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Profil Enseignant'
        verbose_name_plural = 'Profils Enseignants'
    
    def __str__(self):
        return f"Teacher: {self.user.email}"


class Notification(models.Model):
    """User notifications."""
    
    TYPE_CHOICES = (
        ('course_update', 'Mise à jour de cours'),
        ('new_exercise', 'Nouvel exercice'),
        ('achievement', 'Succès'),
        ('recommendation', 'Recommandation'),
        ('message', 'Message'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
