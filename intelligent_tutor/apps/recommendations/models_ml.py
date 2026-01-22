"""
MODULE DE GESTION DES MODÈLES ML
================================

Gestion complète des modèles d'apprentissage automatique:
- Entraînement et sauvegarde
- Gestion des versions
- Évaluation des performances
- Prédictions avec cache
"""

import os
import json
import pickle
import numpy as np
from datetime import datetime, timedelta
from django.db import models
from django.conf import settings
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_squared_error, r2_score, mean_absolute_error,
    precision_score, recall_score, f1_score
)

# Répertoires de modèles
MODELS_DIR = os.path.join(settings.BASE_DIR, 'ml_models')
TRAINING_DIR = os.path.join(settings.BASE_DIR, 'training_data')


class MLModelVersion(models.Model):
    """Gestion des versions de modèles ML"""
    
    TYPE_CHOICES = [
        ('recommendation', 'Recommandation'),
        ('performance', 'Performance'),
        ('learning_style', 'Style d\'apprentissage'),
        ('difficulty', 'Difficulté'),
    ]
    
    STATUS_CHOICES = [
        ('training', 'En cours d\'entraînement'),
        ('active', 'Actif'),
        ('archived', 'Archivé'),
        ('failed', 'Échoué'),
    ]
    
    model_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    version = models.CharField(max_length=20, default='1.0.0')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='training')
    
    # Métriques de performance
    accuracy = models.FloatField(null=True, blank=True)
    precision = models.FloatField(null=True, blank=True)
    recall = models.FloatField(null=True, blank=True)
    f1_score = models.FloatField(null=True, blank=True)
    rmse = models.FloatField(null=True, blank=True)
    mae = models.FloatField(null=True, blank=True)
    r2 = models.FloatField(null=True, blank=True)
    
    # Métadonnées
    training_samples = models.IntegerField(default=0)
    training_duration_seconds = models.IntegerField(default=0)
    feature_count = models.IntegerField(default=0)
    
    # Configuration
    hyperparameters = models.JSONField(default=dict)
    
    # Fichiers
    model_path = models.CharField(max_length=255, blank=True)
    scaler_path = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    trained_at = models.DateTimeField(null=True, blank=True)
    deployed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-trained_at']
        indexes = [
            models.Index(fields=['model_type', '-trained_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.model_type} v{self.version} ({self.status})"
    
    @classmethod
    def get_active_model(cls, model_type):
        """Récupérer le modèle actif pour un type"""
        return cls.objects.filter(
            model_type=model_type,
            status='active'
        ).latest('deployed_at')
    
    def save_model(self, model_obj, scaler_obj=None):
        """Sauvegarder le modèle et le scaler"""
        os.makedirs(MODELS_DIR, exist_ok=True)
        
        # Sauvegarder le modèle
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        model_filename = f"{self.model_type}_{self.version}_{timestamp}.pkl"
        self.model_path = os.path.join(MODELS_DIR, model_filename)
        
        with open(self.model_path, 'wb') as f:
            pickle.dump(model_obj, f)
        
        # Sauvegarder le scaler si fourni
        if scaler_obj:
            scaler_filename = f"{self.model_type}_scaler_{self.version}_{timestamp}.pkl"
            self.scaler_path = os.path.join(MODELS_DIR, scaler_filename)
            with open(self.scaler_path, 'wb') as f:
                pickle.dump(scaler_obj, f)
    
    def load_model(self):
        """Charger le modèle sauvegardé"""
        if not self.model_path or not os.path.exists(self.model_path):
            return None
        
        with open(self.model_path, 'rb') as f:
            return pickle.load(f)
    
    def load_scaler(self):
        """Charger le scaler sauvegardé"""
        if not self.scaler_path or not os.path.exists(self.scaler_path):
            return None
        
        with open(self.scaler_path, 'rb') as f:
            return pickle.load(f)
    
    def to_dict(self):
        """Conversion en dictionnaire"""
        return {
            'id': self.id,
            'type': self.model_type,
            'version': self.version,
            'status': self.status,
            'metrics': {
                'accuracy': self.accuracy,
                'precision': self.precision,
                'recall': self.recall,
                'f1_score': self.f1_score,
                'rmse': self.rmse,
                'mae': self.mae,
                'r2': self.r2,
            },
            'training_samples': self.training_samples,
            'training_duration': self.training_duration_seconds,
            'trained_at': self.trained_at.isoformat() if self.trained_at else None,
            'deployed_at': self.deployed_at.isoformat() if self.deployed_at else None,
        }


class TrainingLog(models.Model):
    """Logs d'entraînement détaillés"""
    
    model = models.ForeignKey(MLModelVersion, on_delete=models.CASCADE, related_name='training_logs')
    
    epoch = models.IntegerField(default=0)
    loss = models.FloatField(null=True, blank=True)
    val_loss = models.FloatField(null=True, blank=True)
    metrics = models.JSONField(default=dict)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['model', 'epoch']
    
    def __str__(self):
        return f"Log {self.model} - Epoch {self.epoch}"


class ModelPredictionCache(models.Model):
    """Cache des prédictions pour optimiser les performances"""
    
    model = models.ForeignKey(MLModelVersion, on_delete=models.CASCADE, related_name='predictions')
    
    input_hash = models.CharField(max_length=64, db_index=True)
    prediction = models.JSONField()
    confidence = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        unique_together = ['model', 'input_hash']
        indexes = [
            models.Index(fields=['input_hash', 'expires_at']),
        ]
    
    @classmethod
    def get_cached_prediction(cls, model, input_hash):
        """Récupérer une prédiction en cache si valide"""
        try:
            cache = cls.objects.get(model=model, input_hash=input_hash)
            if cache.expires_at > datetime.now():
                return cache.prediction, cache.confidence
        except cls.DoesNotExist:
            pass
        return None, None
    
    @classmethod
    def cache_prediction(cls, model, input_hash, prediction, confidence, ttl_hours=24):
        """Mettre en cache une prédiction"""
        expires_at = datetime.now() + timedelta(hours=ttl_hours)
        cls.objects.update_or_create(
            model=model,
            input_hash=input_hash,
            defaults={
                'prediction': prediction,
                'confidence': confidence,
                'expires_at': expires_at,
            }
        )


class ModelEvaluation(models.Model):
    """Résultats d'évaluation des modèles"""
    
    model = models.OneToOneField(MLModelVersion, on_delete=models.CASCADE, related_name='evaluation')
    
    test_set_size = models.IntegerField(default=0)
    test_set_percentage = models.FloatField(default=0.2)
    
    # Métriques de classification
    confusion_matrix = models.JSONField(null=True, blank=True)
    class_report = models.JSONField(null=True, blank=True)
    
    # Métriques de régression
    residuals_mean = models.FloatField(null=True, blank=True)
    residuals_std = models.FloatField(null=True, blank=True)
    
    # Validation croisée
    cv_scores = models.JSONField(default=list)
    cv_mean = models.FloatField(null=True, blank=True)
    cv_std = models.FloatField(null=True, blank=True)
    
    # Feature importance
    feature_importance = models.JSONField(default=dict)
    
    # Explainability
    shap_values = models.JSONField(null=True, blank=True)
    
    evaluated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Evaluation - {self.model}"
    
    def to_dict(self):
        """Conversion en dictionnaire"""
        return {
            'test_set_size': self.test_set_size,
            'test_percentage': self.test_set_percentage,
            'cv_scores': self.cv_scores,
            'cv_mean': self.cv_mean,
            'cv_std': self.cv_std,
            'feature_importance': self.feature_importance,
        }
