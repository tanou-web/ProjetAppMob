"""
Courses app models.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User


class Subject(models.Model):
    """School subjects."""
    
    SUBJECT_CHOICES = (
        ('math', 'Mathématiques'),
        ('french', 'Français'),
        ('english', 'Anglais'),
        ('science', 'Sciences'),
        ('history', 'Histoire'),
        ('geography', 'Géographie'),
        ('art', 'Arts Plastiques'),
        ('music', 'Musique'),
        ('pe', 'Éducation Physique'),
    )
    
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, choices=SUBJECT_CHOICES, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Matière'
        verbose_name_plural = 'Matières'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Course(models.Model):
    """Course model."""
    
    STATUS_CHOICES = (
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
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
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='courses')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_courses')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    order = models.PositiveIntegerField(default=0)
    duration_hours = models.FloatField(default=1.0)
    difficulty_level = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    cover_image = models.ImageField(upload_to='courses/', null=True, blank=True)
    learning_objectives = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Cours'
        verbose_name_plural = 'Cours'
        ordering = ['level', 'order', 'title']
    
    def __str__(self):
        return f"{self.title} ({self.level})"


class Lesson(models.Model):
    """Lessons within a course."""
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField()  # HTML content
    
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.IntegerField(default=15)
    
    video_url = models.URLField(blank=True)
    resources = models.JSONField(default=list, blank=True)
    learning_outcomes = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Leçon'
        verbose_name_plural = 'Leçons'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class CourseEnrollment(models.Model):
    """Track student enrollments in courses."""
    
    STATUS_CHOICES = (
        ('enrolled', 'Inscrit'),
        ('in_progress', 'En cours'),
        ('completed', 'Complété'),
        ('dropped', 'Abandonné'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')
    progress_percentage = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    enrolled_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('student', 'course')
        verbose_name = 'Inscription au cours'
        verbose_name_plural = 'Inscriptions au cours'
    
    def __str__(self):
        return f"{self.student.email} - {self.course.title}"
