"""
Recommendations system models using AI/ML.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User
from apps.courses.models import Course


class ContentRecommendation(models.Model):
    """AI-generated content recommendations."""
    
    TYPE_CHOICES = (
        ('course', 'Cours'),
        ('lesson', 'Leçon'),
        ('exercise', 'Exercice'),
        ('resource', 'Ressource'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    
    content_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    content_id = models.IntegerField()  # ID of the recommended content
    content_title = models.CharField(max_length=255)
    
    confidence_score = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(1)],
        help_text='Confidence of recommendation (0-1)'
    )
    
    reason = models.TextField()  # Why this is recommended
    recommendation_factors = models.JSONField(default=dict)  # Factors considered
    
    is_viewed = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)
    user_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Recommandation de Contenu'
        verbose_name_plural = 'Recommandations de Contenu'
        ordering = ['-confidence_score', '-created_at']
        indexes = [
            models.Index(fields=['student', '-created_at']),
            models.Index(fields=['student', 'is_viewed']),
        ]
    
    def __str__(self):
        return f"Recommendation for {self.student.email}: {self.content_title}"


class LearningStyleProfile(models.Model):
    """Profile for adaptive learning styles."""
    
    LEARNING_STYLE_CHOICES = (
        ('visual', 'Visuel'),
        ('auditory', 'Auditif'),
        ('kinesthetic', 'Kinesthésique'),
        ('reading_writing', 'Lecture/Écriture'),
        ('mixed', 'Mixte'),
    )
    
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learning_style_profile')
    
    primary_style = models.CharField(max_length=20, choices=LEARNING_STYLE_CHOICES, default='visual')
    secondary_style = models.CharField(max_length=20, choices=LEARNING_STYLE_CHOICES, blank=True)
    
    visual_preference = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(1)])
    auditory_preference = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(1)])
    kinesthetic_preference = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(1)])
    reading_writing_preference = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(1)])
    
    pace_preference = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.5), MaxValueValidator(2.0)],
        help_text='Learning pace multiplier (0.5 = slow, 1.0 = normal, 2.0 = fast)'
    )
    
    difficulty_preference = models.IntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Profil de Style d\'Apprentissage'
        verbose_name_plural = 'Profils de Styles d\'Apprentissage'
    
    def __str__(self):
        return f"Learning Style: {self.student.email}"


class AdaptiveRecommendationEngine(models.Model):
    """Configuration and state for the AI recommendation engine."""
    
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recommendation_engine')
    
    # Model weights for recommendations
    performance_weight = models.FloatField(default=0.3, validators=[MinValueValidator(0), MaxValueValidator(1)])
    interest_weight = models.FloatField(default=0.3, validators=[MinValueValidator(0), MaxValueValidator(1)])
    learning_style_weight = models.FloatField(default=0.2, validators=[MinValueValidator(0), MaxValueValidator(1)])
    engagement_weight = models.FloatField(default=0.2, validators=[MinValueValidator(0), MaxValueValidator(1)])
    
    # Recommendation frequency
    recommendation_frequency_hours = models.IntegerField(default=24)
    max_recommendations_per_session = models.IntegerField(default=5)
    
    # Algorithm parameters
    algorithm_version = models.CharField(max_length=50, default='v1.0')
    
    # Tracking
    last_recommendation_generated = models.DateTimeField(null=True, blank=True)
    total_recommendations_generated = models.IntegerField(default=0)
    average_recommendation_quality = models.FloatField(default=0)
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Moteur de Recommandation Adaptatif'
        verbose_name_plural = 'Moteurs de Recommandation Adaptatifs'
    
    def __str__(self):
        return f"Recommendation Engine: {self.student.email}"


class RecommendationFeedback(models.Model):
    """Feedback on recommendations to improve the system."""
    
    FEEDBACK_TYPE_CHOICES = (
        ('useful', 'Utile'),
        ('not_useful', 'Pas utile'),
        ('irrelevant', 'Hors de propos'),
        ('too_easy', 'Trop facile'),
        ('too_hard', 'Trop difficile'),
    )
    
    recommendation = models.ForeignKey(ContentRecommendation, on_delete=models.CASCADE, related_name='feedback')
    
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPE_CHOICES)
    comment = models.TextField(blank=True)
    rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Retour sur Recommandation'
        verbose_name_plural = 'Retours sur Recommandation'
    
    def __str__(self):
        return f"Feedback: {self.feedback_type}"


class ErrorAnalysis(models.Model):
    """Analysis of student errors and misconceptions."""
    
    ERROR_TYPE_CHOICES = (
        ('conceptual', 'Erreur conceptuelle'),
        ('calculation', 'Erreur de calcul'),
        ('reading', 'Erreur de lecture'),
        ('careless', 'Erreur d\'inattention'),
        ('logical', 'Erreur logique'),
        ('other', 'Autre'),
    )
    
    CONCEPT_LEVEL_CHOICES = (
        ('not_understood', 'Non compris'),
        ('partial', 'Partiellement compris'),
        ('mostly_understood', 'Bien compris'),
        ('fully_understood', 'Parfaitement compris'),
    )
    
    from apps.exercises.models import ExerciseAttempt
    
    exercise_attempt = models.ForeignKey('exercises.ExerciseAttempt', on_delete=models.CASCADE, related_name='error_analysis')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='error_analyses')
    exercise = models.ForeignKey('exercises.Exercise', on_delete=models.CASCADE)
    
    error_type = models.CharField(max_length=20, choices=ERROR_TYPE_CHOICES)
    concept_involved = models.CharField(max_length=255, help_text='Concept/notion impliqué(e) dans l\'erreur')
    description = models.TextField(help_text='Description de l\'erreur')
    
    student_answer = models.TextField()
    correct_answer = models.TextField()
    
    # Analyse conceptuelle
    concept_understanding_level = models.CharField(max_length=20, choices=CONCEPT_LEVEL_CHOICES, default='not_understood')
    misconception_identified = models.TextField(blank=True, help_text='Conception erronée identifiée')
    root_cause = models.TextField(blank=True, help_text='Cause racine de l\'erreur')
    
    # Points positifs
    partial_credit = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Recommandations
    suggested_topics = models.JSONField(default=list, help_text='Topics à réviser')
    similar_past_errors = models.IntegerField(default=0, help_text='Nombre d\'erreurs similaires passées')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Analyse d\'Erreur'
        verbose_name_plural = 'Analyses d\'Erreurs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', '-created_at']),
            models.Index(fields=['error_type']),
        ]
    
    def __str__(self):
        return f"Error Analysis: {self.student.email} - {self.error_type}"


class IntelligentRevisionItem(models.Model):
    """Items recommended for intelligent revision."""
    
    STATUS_CHOICES = (
        ('recommended', 'Recommandé'),
        ('in_progress', 'En cours'),
        ('completed', 'Complété'),
        ('mastered', 'Maîtrisé'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revision_items')
    concept = models.CharField(max_length=255, help_text='Concept à réviser')
    
    reason = models.TextField(help_text='Raison de la révision recommandée')
    priority_score = models.FloatField(
        default=0.5,
        validators=[MinValueValidator(0), MaxValueValidator(1)],
        help_text='Priorité (0-1)'
    )
    
    # Sources des erreurs
    error_count = models.IntegerField(default=0, help_text='Nombre d\'erreurs liées à ce concept')
    last_error = models.DateTimeField(null=True, blank=True)
    
    # Ressources de révision
    related_exercises = models.JSONField(default=list, help_text='ID d\'exercices connexes')
    related_lessons = models.JSONField(default=list, help_text='ID de leçons connexes')
    custom_tips = models.JSONField(default=list, help_text='Conseils personnalisés')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='recommended')
    revision_attempts = models.IntegerField(default=0)
    mastery_score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Élément de Révision Intelligente'
        verbose_name_plural = 'Éléments de Révision Intelligents'
        ordering = ['-priority_score', '-created_at']
        unique_together = ['student', 'concept']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['-priority_score']),
        ]
    
    def __str__(self):
        return f"Revision: {self.student.email} - {self.concept}"


class SmartExplanation(models.Model):
    """Generated explanations personalized for student errors."""
    
    EXPLANATION_TYPE_CHOICES = (
        ('error_specific', 'Basée sur erreur'),
        ('concept_based', 'Basée sur concept'),
        ('reminder', 'Rappel'),
        ('reinforcement', 'Renforcement'),
        ('alternative', 'Approche alternative'),
    )
    
    exercise_attempt = models.ForeignKey('exercises.ExerciseAttempt', on_delete=models.CASCADE, related_name='smart_explanations')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='smart_explanations')
    
    explanation_type = models.CharField(max_length=20, choices=EXPLANATION_TYPE_CHOICES)
    content = models.TextField(help_text='Contenu de l\'explication')
    
    # Métadonnées
    is_interactive = models.BooleanField(default=False, help_text='Contient des éléments interactifs')
    uses_examples = models.BooleanField(default=True, help_text='Inclut des exemples concrets')
    uses_analogies = models.BooleanField(default=False, help_text='Utilise des analogies')
    
    # Effectivité
    student_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Évaluation par l\'étudiant (1-5)'
    )
    was_helpful = models.BooleanField(null=True, blank=True)
    follow_up_score = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Score au suivi (0-100)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Explication Intelligente'
        verbose_name_plural = 'Explications Intelligentes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', '-created_at']),
            models.Index(fields=['explanation_type']),
        ]
    
    def __str__(self):
        return f"Explanation: {self.student.email} - {self.explanation_type}"
