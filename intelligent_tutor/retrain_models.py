#!/usr/bin/env python
"""
Script de réentraînement des modèles ML avec toutes les données FASO
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.recommendations.models_ml import MLModelVersion
from apps.recommendations.training_pipeline import TrainingOrchestrator
from apps.courses.models import Lesson, Course
from apps.exercises.models import Exercise


def retrain_ml_models():
    """Réentraîne tous les modèles ML avec les nouvelles données"""
    
    print("="*80)
    print("🤖 RÉENTRAÎNEMENT DES MODÈLES ML AVEC DONNÉES FASO COMPLÈTES")
    print("="*80)
    
    # Vérifie les données disponibles
    print(f"\n📊 Données disponibles:")
    print(f"   Courses: {Course.objects.count()}")
    print(f"   Lessons: {Lesson.objects.count()}")
    print(f"   Exercises: {Exercise.objects.count()}")
    
    # Supprime les anciens modèles
    print(f"\n🗑️  Suppression des anciens modèles...")
    old_models = MLModelVersion.objects.all()
    count = old_models.count()
    old_models.delete()
    print(f"   ✅ {count} anciens modèles supprimés")
    
    # Entraîne les nouveaux modèles
    print(f"\n⏳ Entraînement des modèles...")
    
    try:
        orchestrator = TrainingOrchestrator()
        results = orchestrator.train_all_models(use_synthetic_data=True)
        
        print(f"\n✅ Entraînement réussi!")
        print(f"\n📊 Résultats:")
        for model_type, metrics in results.items():
            print(f"   • {model_type}: {metrics}")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'entraînement: {e}")
        import traceback
        traceback.print_exc()
    
    # Affiche les statistiques finales
    print(f"\n" + "="*80)
    print("✅ RÉENTRAÎNEMENT TERMINÉ")
    print("="*80)
    
    models = MLModelVersion.objects.all()
    print(f"\n📊 Modèles actifs: {models.count()}")
    for model in models:
        print(f"   • {model.model_type}: Accuracy {model.accuracy:.4f} ({model.training_samples} samples)")
    
    print("="*80)


if __name__ == '__main__':
    try:
        retrain_ml_models()
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
