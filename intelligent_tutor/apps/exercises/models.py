"""
Exercises app models.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User
from apps.courses.models import Lesson


class ExerciseCategory(models.Model):
    """Categories for exercises."""
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Catégorie d\'Exercice'
        verbose_name_plural = 'Catégories d\'Exercices'
    
    def __str__(self):
        return self.name


class Exercise(models.Model):
    """Interactive exercises for learning."""
    
    TYPE_CHOICES = (
        ('multiple_choice', 'Choix multiples'),
        ('short_answer', 'Réponse courte'),
        ('essay', 'Essai'),
        ('fill_blank', 'Remplir les blancs'),
        ('matching', 'Correspondance'),
        ('true_false', 'Vrai/Faux'),
        ('ordering', 'Classement'),
        ('drag_drop', 'Glisser-déposer'),
    )
    
    DIFFICULTY_CHOICES = (
        (1, 'Très facile'),
        (2, 'Facile'),
        (3, 'Moyen'),
        (4, 'Difficile'),
        (5, 'Très difficile'),
    )
    
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    category = models.ForeignKey(ExerciseCategory, on_delete=models.SET_NULL, null=True)
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    question = models.TextField()
    
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    difficulty = models.IntegerField(choices=DIFFICULTY_CHOICES, default=3)
    
    points = models.IntegerField(default=10, validators=[MinValueValidator(1)])
    estimated_time_minutes = models.IntegerField(default=5)
    
    correct_answer = models.TextField()  # JSON for complex answers
    explanation = models.TextField(blank=True)
    
    options = models.JSONField(default=list, blank=True)  # For multiple choice
    hints = models.JSONField(default=list, blank=True)
    
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Exercice'
        verbose_name_plural = 'Exercices'
        ordering = ['lesson', 'order']
    
    def __str__(self):
        return f"{self.lesson.title} - {self.title}"


class ExerciseAttempt(models.Model):
    """Track student attempts on exercises."""
    
    STATUS_CHOICES = (
        ('in_progress', 'En cours'),
        ('submitted', 'Soumis'),
        ('graded', 'Noté'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exercise_attempts')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='attempts')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    
    student_answer = models.TextField()
    is_correct = models.BooleanField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    
    time_spent_seconds = models.IntegerField(default=0)
    hints_used = models.IntegerField(default=0)
    
    feedback = models.TextField(blank=True)
    graded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_attempts')
    
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Tentative d\'Exercice'
        verbose_name_plural = 'Tentatives d\'Exercice'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.student.email} - {self.exercise.title}"


class Quiz(models.Model):
    """Quizzes for assessing knowledge."""
    
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    passing_score = models.IntegerField(default=70, validators=[MinValueValidator(0), MaxValueValidator(100)])
    time_limit_minutes = models.IntegerField(null=True, blank=True)
    
    is_mandatory = models.BooleanField(default=True)
    allow_retake = models.BooleanField(default=True)
    max_attempts = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Quiz'
        verbose_name_plural = 'Quizzes'
    
    def __str__(self):
        return f"{self.lesson.title} - {self.title}"


class QuizAttempt(models.Model):
    """Track quiz attempts."""
    
    STATUS_CHOICES = (
        ('in_progress', 'En cours'),
        ('submitted', 'Soumis'),
        ('graded', 'Noté'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    
    score = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    percentage = models.FloatField(null=True, blank=True)
    passed = models.BooleanField(null=True, blank=True)
    
    time_spent_seconds = models.IntegerField(default=0)
    
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Tentative de Quiz'
        verbose_name_plural = 'Tentatives de Quiz'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.student.email} - {self.quiz.title}"
