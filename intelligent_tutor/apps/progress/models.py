"""
Progress tracking models.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User
from apps.courses.models import Course, Lesson


class LearningPath(models.Model):
    """Personalized learning paths for students."""
    
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learning_path')
    
    current_level = models.CharField(max_length=20, blank=True)
    courses_completed = models.IntegerField(default=0)
    lessons_completed = models.IntegerField(default=0)
    exercises_completed = models.IntegerField(default=0)
    
    total_study_time_seconds = models.BigIntegerField(default=0)
    average_score = models.FloatField(default=0)
    
    last_learning_date = models.DateField(null=True, blank=True)
    learning_streak_days = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Chemin d\'Apprentissage'
        verbose_name_plural = 'Chemins d\'Apprentissage'
    
    def __str__(self):
        return f"Learning Path: {self.student.email}"


class LessonProgress(models.Model):
    """Track progress on individual lessons."""
    
    STATUS_CHOICES = (
        ('not_started', 'Non commencé'),
        ('in_progress', 'En cours'),
        ('completed', 'Complété'),
        ('mastered', 'Maîtrisé'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress_records')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_percentage = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    exercises_completed = models.IntegerField(default=0)
    exercises_correct = models.IntegerField(default=0)
    average_exercise_score = models.FloatField(default=0)
    
    time_spent_seconds = models.IntegerField(default=0)
    
    started_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('student', 'lesson')
        verbose_name = 'Progression de Leçon'
        verbose_name_plural = 'Progressions de Leçon'
    
    def __str__(self):
        return f"{self.student.email} - {self.lesson.title}"


class Achievement(models.Model):
    """Badges and achievements for motivation."""
    
    CATEGORY_CHOICES = (
        ('milestone', 'Jalon'),
        ('skill', 'Compétence'),
        ('dedication', 'Dévouement'),
        ('excellence', 'Excellence'),
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    badge_image = models.ImageField(upload_to='achievements/')
    
    condition_rule = models.JSONField(default=dict)  # Condition for earning this achievement
    points_reward = models.IntegerField(default=10)
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Succès'
        verbose_name_plural = 'Succès'
    
    def __str__(self):
        return self.name


class StudentAchievement(models.Model):
    """Track achievements earned by students."""
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student', 'achievement')
        verbose_name = 'Succès Étudiant'
        verbose_name_plural = 'Succès Étudiants'
    
    def __str__(self):
        return f"{self.student.email} - {self.achievement.name}"


class PerformanceAnalysis(models.Model):
    """AI-powered performance analysis."""
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='performance_analyses')
    
    analysis_date = models.DateField(auto_now_add=True)
    
    # Performance metrics
    overall_score = models.FloatField(default=0)
    subjects_scores = models.JSONField(default=dict)  # Subject: score
    
    strengths = models.JSONField(default=list)  # List of strength areas
    weaknesses = models.JSONField(default=list)  # List of weakness areas
    
    recommendations = models.JSONField(default=list)  # AI recommendations
    suggested_focus_areas = models.JSONField(default=list)
    
    improvement_trends = models.JSONField(default=dict)  # Trend analysis
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Analyse de Performance'
        verbose_name_plural = 'Analyses de Performance'
        ordering = ['-analysis_date']
    
    def __str__(self):
        return f"Performance: {self.student.email} - {self.analysis_date}"
