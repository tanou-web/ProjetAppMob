"""
EXEMPLE D'UTILISATION - SYSTÈME IA DE RECOMMANDATION
=====================================================

Exemples pratiques pour utiliser le système de recommandation IA.
"""

# ════════════════════════════════════════════════════════════════
# 1. DÉMARRAGE RAPIDE
# ════════════════════════════════════════════════════════════════

"""
Terminal:
  python manage.py train_ml_models --all
"""

# ════════════════════════════════════════════════════════════════
# 2. ENTRAÎNER UN MODÈLE
# ════════════════════════════════════════════════════════════════

from apps.recommendations.training import ModelTrainer, DataPreparation

def example_1_train_model():
    """Entraîner un modèle depuis Python"""
    
    # Étape 1: Préparer les données
    df = DataPreparation.get_training_data(min_samples=50, days_back=180)
    
    if df is None:
        print("❌ Pas assez de données pour l'entraînement")
        return
    
    print(f"✓ Données prêtes: {len(df)} samples, {len(df.columns)} features")
    
    # Étape 2: Entraîner
    model = ModelTrainer.train_recommendation_model(
        model_type='gradient_boosting',
        version='2.0.0'
    )
    
    # Étape 3: Vérifier les résultats
    print(f"\n✅ Modèle entraîné!")
    print(f"   Version: {model.version}")
    print(f"   Status: {model.status}")
    print(f"   R²: {model.r2:.4f}")
    print(f"   RMSE: {model.rmse:.4f}")
    print(f"   MAE: {model.mae:.4f}")
    print(f"   Samples: {model.training_samples}")


# ════════════════════════════════════════════════════════════════
# 3. PRÉDIRE POUR UN ÉTUDIANT
# ════════════════════════════════════════════════════════════════

from apps.recommendations.predict import ModelPredictor
from django.contrib.auth import get_user_model
from apps.exercises.models import Exercise

User = get_user_model()

def example_2_predict():
    """Prédire le score d'un étudiant pour un exercice"""
    
    # Récupérer un étudiant et un exercice
    student = User.objects.filter(role='student').first()
    exercise = Exercise.objects.first()
    
    if not student or not exercise:
        print("❌ Données insuffisantes")
        return
    
    # Prédire le score
    prediction = ModelPredictor.predict_student_score(student, exercise)
    
    print(f"📊 Prédiction pour {student.email}")
    print(f"   Exercice: {exercise.title}")
    print(f"   Score prédit: {prediction['prediction']:.2f}/100")
    print(f"   Confiance: {prediction['confidence']:.2f}")
    print(f"   Source: {prediction['source']}")
    
    # Prédire la probabilité de succès
    success = ModelPredictor.predict_student_success_probability(student, exercise)
    
    print(f"\n📈 Probabilité de succès")
    print(f"   Probabilité: {success['probability']:.2%}")
    print(f"   Match de difficulté: {success['difficulty_match']:.2f}")
    print(f"   Recommandation: {success['recommendation']}")


# ════════════════════════════════════════════════════════════════
# 4. PRÉDICTIONS BATCH
# ════════════════════════════════════════════════════════════════

def example_3_batch_predictions():
    """Prédire pour plusieurs exercices"""
    
    student = User.objects.filter(role='student').first()
    if not student:
        return
    
    # Récupérer les exercices d'un cours
    exercises = Exercise.objects.filter(
        lesson__course_id=1
    )[:5]
    
    # Prédire pour tous
    predictions = ModelPredictor.predict_batch(student, exercises)
    
    print(f"📊 Prédictions batch pour {student.email}")
    print(f"\n{'Exercice':<30} {'Score':<10} {'Confiance':<10}")
    print("-" * 50)
    
    for pred in predictions:
        print(
            f"{pred['exercise_title']:<30} "
            f"{pred['prediction']:<10.2f} "
            f"{pred['confidence']:<10.2f}"
        )


# ════════════════════════════════════════════════════════════════
# 5. COMPARER LES MODÈLES
# ════════════════════════════════════════════════════════════════

from apps.recommendations.predict import ModelComparison
from apps.recommendations.models_ml import MLModelVersion

def example_4_compare_models():
    """Comparer les performances de tous les modèles"""
    
    print("📊 Comparaison des modèles")
    print("\n{'Version':<20} {'Status':<12} {'R²':<10} {'RMSE':<10}")
    print("-" * 52)
    
    comparison = ModelComparison.compare_models()
    
    for model_data in comparison:
        r2 = f"{model_data['r2']:.4f}" if model_data['r2'] else "N/A"
        rmse = f"{model_data['rmse']:.4f}" if model_data['rmse'] else "N/A"
        
        print(
            f"{model_data['version']:<20} "
            f"{model_data['status']:<12} "
            f"{r2:<10} "
            f"{rmse:<10}"
        )
    
    # Sélectionner le meilleur
    best = ModelComparison.select_best_model()
    if best:
        print(f"\n🏆 Meilleur modèle: {best.version} (R²={best.r2:.4f})")


# ════════════════════════════════════════════════════════════════
# 6. ANALYSER UN MODÈLE
# ════════════════════════════════════════════════════════════════

from apps.recommendations.training import ModelEnhancer

def example_5_analyze_model():
    """Analyser les performances d'un modèle"""
    
    # Récupérer le modèle actif
    model = MLModelVersion.get_active_model('recommendation')
    
    if not model:
        print("❌ Aucun modèle actif")
        return
    
    print(f"📋 Analyse du modèle {model.version}")
    print(f"   Status: {model.status}")
    print(f"   R²: {model.r2:.4f}")
    print(f"   RMSE: {model.rmse:.4f}")
    print(f"   MAE: {model.mae:.4f}")
    print(f"   Samples: {model.training_samples}")
    
    # Domaines d'amélioration
    improvements = ModelEnhancer.identify_improvement_areas(model)
    if improvements:
        print(f"\n🔧 Domaines d'amélioration:")
        for improvement in improvements:
            print(f"   • {improvement}")
    
    # Suggestions
    suggestions = ModelEnhancer.suggest_next_version(model)
    print(f"\n💡 Suggestions pour v3.0:")
    for category in suggestions:
        print(f"   {category}:")
        for suggestion in suggestions[category].values():
            print(f"     • {suggestion}")


# ════════════════════════════════════════════════════════════════
# 7. VÉRIFIER LE BESOIN DE RETRAINING
# ════════════════════════════════════════════════════════════════

def example_6_check_retraining():
    """Vérifier si le retraining est nécessaire"""
    
    needed, reason = ModelComparison.recommend_retraining()
    
    print("🔄 Statut du retraining:")
    
    if needed:
        print(f"   ⚠️  RETRAINING RECOMMANDÉ")
        print(f"   Raison: {reason}")
    else:
        print(f"   ✓ Modèle OK")
        print(f"   Raison: {reason}")


# ════════════════════════════════════════════════════════════════
# 8. CACHE DES PRÉDICTIONS
# ════════════════════════════════════════════════════════════════

def example_7_cache():
    """Gérer le cache des prédictions"""
    
    from apps.recommendations.models_ml import ModelPredictionCache
    
    model = MLModelVersion.get_active_model('recommendation')
    
    # Nombre de cache entries
    cache_count = ModelPredictionCache.objects.filter(model=model).count()
    print(f"📦 Cache des prédictions")
    print(f"   Total entries: {cache_count}")
    
    # Vider le cache
    print(f"\n   Nettoyage du cache...")
    deleted, _ = ModelPredictionCache.objects.all().delete()
    print(f"   ✓ {deleted} entries supprimées")


# ════════════════════════════════════════════════════════════════
# 9. INTÉGRATION AVEC RECOMMANDATIONS
# ════════════════════════════════════════════════════════════════

def example_8_recommendations():
    """Utiliser le modèle dans les recommandations"""
    
    from apps.recommendations.utils import generate_recommendations
    
    student = User.objects.filter(role='student').first()
    if not student:
        return
    
    # Générer les recommandations (utilise le modèle internement)
    recommendations = generate_recommendations(student, limit=5)
    
    print(f"🎯 Recommandations pour {student.email}")
    print(f"\n{'Cours':<30} {'Score':<10} {'Confiance':<10}")
    print("-" * 50)
    
    for rec in recommendations:
        print(
            f"{rec['course'].title:<30} "
            f"{rec['score']:<10.2f} "
            f"{rec.get('confidence', 0):<10.2f}"
        )


# ════════════════════════════════════════════════════════════════
# 10. ENTRAÎNER AVEC DONNÉES PERSONNALISÉES
# ════════════════════════════════════════════════════════════════

def example_9_custom_data():
    """Entraîner avec des données personnalisées"""
    
    import pandas as pd
    from sklearn.ensemble import GradientBoostingRegressor
    from sklearn.preprocessing import StandardScaler
    
    # Récupérer les données
    df = DataPreparation.get_training_data(
        min_samples=100,
        days_back=365
    )
    
    if df is None:
        return
    
    # Préparer
    X, y, feature_names, scaler = DataPreparation.prepare_features(df)
    
    # Entraîner
    model = GradientBoostingRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=7,
        random_state=42
    )
    
    model.fit(X[:int(len(X)*0.8)], y[:int(len(y)*0.8)])
    
    # Évaluer
    from sklearn.metrics import r2_score, mean_squared_error
    
    y_pred = model.predict(X[int(len(X)*0.8):])
    r2 = r2_score(y[int(len(y)*0.8):], y_pred)
    rmse = mean_squared_error(y[int(len(y)*0.8):], y_pred) ** 0.5
    
    print(f"🎓 Modèle personnalisé")
    print(f"   R²: {r2:.4f}")
    print(f"   RMSE: {rmse:.4f}")
    
    # Feature importance
    importance = pd.Series(
        model.feature_importances_,
        index=feature_names
    ).sort_values(ascending=False)
    
    print(f"\n📊 Feature Importance (Top 5):")
    for feature, importance_val in importance.head(5).items():
        print(f"   {feature}: {importance_val:.4f}")


# ════════════════════════════════════════════════════════════════
# EXEMPLE DE SHELL DJANGO
# ════════════════════════════════════════════════════════════════

"""
python manage.py shell

from apps.recommendations.training import ModelTrainer
from apps.recommendations.predict import ModelPredictor
from django.contrib.auth import get_user_model

User = get_user_model()

# Exemple 1: Entraîner
model = ModelTrainer.train_recommendation_model(
    model_type='gradient_boosting',
    version='2.0.0'
)
print(f"Modèle entraîné: R²={model.r2:.4f}")

# Exemple 2: Prédire
student = User.objects.filter(role='student').first()
exercise = Exercise.objects.first()

pred = ModelPredictor.predict_student_score(student, exercise)
print(f"Prédiction: {pred['prediction']:.2f}")

# Exemple 3: Comparer
from apps.recommendations.predict import ModelComparison
ModelComparison.compare_models()
"""


# ════════════════════════════════════════════════════════════════
# LANCER LES EXEMPLES
# ════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    import os
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    import django
    django.setup()
    
    print("🚀 Exemples du Système de Recommandation IA\n")
    
    # Exécuter les exemples
    examples = [
        ("1. Entraîner un modèle", example_1_train_model),
        ("2. Prédire pour un étudiant", example_2_predict),
        ("3. Prédictions batch", example_3_batch_predictions),
        ("4. Comparer les modèles", example_4_compare_models),
        ("5. Analyser un modèle", example_5_analyze_model),
        ("6. Vérifier le retraining", example_6_check_retraining),
        ("7. Gérer le cache", example_7_cache),
        ("8. Recommandations", example_8_recommendations),
        ("9. Données personnalisées", example_9_custom_data),
    ]
    
    for title, func in examples:
        print(f"\n{'='*60}")
        print(f"{title}")
        print('='*60)
        try:
            func()
        except Exception as e:
            print(f"❌ Erreur: {e}")
