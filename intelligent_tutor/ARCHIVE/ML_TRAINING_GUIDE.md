# 🤖 GUIDE D'ENTRAÎNEMENT DES MODÈLES IA

## 🎯 Vue d'ensemble

Ce guide explique comment créer, entraîner, évaluer et améliorer les modèles de machine learning pour le système de recommandation intelligent.

---

## 📚 Architecture du système ML

### Composants

```
┌─────────────────────────────────────────────────────┐
│          DONNÉES (Exercices, Résultats)             │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│     PRÉPARATION DES DONNÉES (DataPreparation)      │
│  • Extraction des features                          │
│  • Normalisation (StandardScaler)                   │
│  • Train/Test split (80/20)                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│    ENTRAÎNEMENT (ModelTrainer)                      │
│  • Gradient Boosting                                │
│  • Random Forest                                    │
│  • Validation croisée (5-fold)                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│    ÉVALUATION (ModelEvaluation)                     │
│  • RMSE, MAE, R²                                   │
│  • Feature importance                               │
│  • Cross-validation scores                          │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│    PRÉDICTION (ModelPredictor)                      │
│  • Cache des prédictions                            │
│  • Fallback mode                                    │
│  • Batch predictions                                │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Entraînement des modèles

### 1. Entraînement simple

```bash
# Entraîner un modèle Gradient Boosting
python manage.py train_ml_models --model-type gradient_boosting --version 2.0.0

# Entraîner un modèle Random Forest
python manage.py train_ml_models --model-type random_forest --version 2.0.0_rf
```

### 2. Entraînement multiple

```bash
# Entraîner tous les modèles recommandés
python manage.py train_ml_models --all
```

### 3. Options avancées

```bash
# Comparer les modèles existants
python manage.py train_ml_models --compare

# Évaluer tous les modèles
python manage.py train_ml_models --evaluate-all

# Analyser un modèle spécifique
python manage.py train_ml_models --analyze 1

# Vérifier si le retraining est nécessaire
python manage.py train_ml_models --check-retraining
```

---

## 📊 Utilisation du modèle entraîné

### Prédiction simple

```python
from apps.recommendations.predict import ModelPredictor
from apps.users.models import User
from apps.exercises.models import Exercise

student = User.objects.get(role='student', pk=1)
exercise = Exercise.objects.get(pk=1)

# Prédire le score
prediction = ModelPredictor.predict_student_score(student, exercise)
print(f"Score prédit: {prediction['prediction']:.2f}")
print(f"Confiance: {prediction['confidence']:.2f}")
print(f"Source: {prediction['source']}")

# Prédire la probabilité de succès
success = ModelPredictor.predict_student_success_probability(student, exercise)
print(f"Probabilité: {success['probability']:.2f}")
print(f"Recommandation: {success['recommendation']}")
```

### Prédictions batch

```python
from apps.recommendations.predict import ModelPredictor

student = User.objects.get(pk=1)
exercises = Exercise.objects.filter(course_id=1)

predictions = ModelPredictor.predict_batch(student, exercises)

for pred in predictions:
    print(f"{pred['exercise_title']}: {pred['prediction']:.2f}")
```

### Utilisation dans les recommandations

```python
from apps.recommendations.predict import ModelPredictor
from apps.recommendations.utils import generate_recommendations

student = User.objects.get(pk=1)

# Générer les recommandations
recommendations = generate_recommendations(student, limit=5)

for rec in recommendations:
    # Le modèle est utilisé internement pour scorer
    print(f"Recommandé: {rec['course'].title}")
```

---

## 🔧 Entraînement personnalisé

### Entraîner depuis Python

```python
from apps.recommendations.training import ModelTrainer, DataPreparation

# Préparer les données
df = DataPreparation.get_training_data(min_samples=50, days_back=180)

if df is not None:
    print(f"Données: {len(df)} samples, {len(df.columns)} features")
    
    # Entraîner
    model = ModelTrainer.train_recommendation_model(
        model_type='gradient_boosting',
        version='2.1.0'
    )
    
    print(f"Status: {model.status}")
    print(f"R²: {model.r2:.4f}")
    print(f"RMSE: {model.rmse:.4f}")
    print(f"MAE: {model.mae:.4f}")
```

### Utiliser des données personnalisées

```python
from apps.recommendations.training import DataPreparation
import pandas as pd

# Récupérer les données
df = DataPreparation.get_training_data(
    min_samples=100,      # Minimum 100 samples
    days_back=365         # 1 année d'historique
)

# Préparer les features
X, y, feature_names, scaler = DataPreparation.prepare_features(df)

print(f"Shape: X={X.shape}, y={y.shape}")
print(f"Features: {feature_names}")
print(f"Scaler type: {type(scaler).__name__}")
```

---

## 📈 Évaluation des modèles

### Récupérer les métriques

```python
from apps.recommendations.models_ml import MLModelVersion

# Obtenir le modèle actif
model = MLModelVersion.get_active_model('recommendation')

print(f"Version: {model.version}")
print(f"Status: {model.status}")
print(f"R²: {model.r2:.4f}")
print(f"RMSE: {model.rmse:.4f}")
print(f"MAE: {model.mae:.4f}")
print(f"Samples: {model.training_samples}")

# Évaluation détaillée
if hasattr(model, 'evaluation'):
    eval_data = model.evaluation.to_dict()
    print(f"CV Mean: {eval_data['cv_mean']:.4f}")
    print(f"CV Std: {eval_data['cv_std']:.4f}")
    
    # Feature importance
    for feature, importance in eval_data['feature_importance'].items():
        print(f"  {feature}: {importance:.4f}")
```

### Comparer les modèles

```python
from apps.recommendations.predict import ModelComparison

# Comparer tous les modèles
comparison = ModelComparison.compare_models()

for model_data in comparison:
    print(f"{model_data['version']} ({model_data['status']})")
    print(f"  R²: {model_data['r2']:.4f}")
    print(f"  RMSE: {model_data['rmse']:.4f}")

# Sélectionner le meilleur
best_model = ModelComparison.select_best_model()
print(f"Meilleur: {best_model.version}")
```

### Vérifier le besoin de retraining

```python
from apps.recommendations.predict import ModelComparison

needed, reason = ModelComparison.recommend_retraining()

if needed:
    print(f"⚠️ Retraining nécessaire: {reason}")
else:
    print(f"✓ Modèle OK: {reason}")
```

---

## 🎯 Features du modèle

### Features utilisées

Le modèle utilise ces features pour les prédictions:

```python
FEATURES = [
    'student_level',           # Niveau scolaire (1-10)
    'exercise_difficulty',     # Difficulté (1-5)
    'exercise_type',           # Type d'exercice (0-7)
    'subject_id',              # ID de la matière
    'previous_attempts',       # Nombre de tentatives antérieures
    'success_rate',            # Taux de réussite (%)
    'avg_course_score',        # Score moyen du cours (%)
    'overall_performance',     # Performance générale (0-100)
    'time_spent',              # Temps passé (secondes)
    'hints_used',              # Indices utilisés
]
```

### Ajouter des features

Pour ajouter des features:

1. Modifier `DataPreparation._extract_features()` dans `training.py`
2. Ajouter la colonne au DataFrame
3. Adapter le nombre de features dans les prédictions

```python
# Exemple: ajouter le nombre d'instructeurs
def _extract_features(attempt):
    # ... code existant ...
    
    # Ajouter une nouvelle feature
    teacher_count = attempt.exercise.lesson.course.created_by.count()
    
    return {
        # ... features existantes ...
        'teacher_count': teacher_count,
    }
```

---

## 🔄 Pipeline d'amélioration continue

### 1. Collecte de données

```bash
# Le système collecte automatiquement:
# • Tentatives d'exercices
# • Scores et résultats
# • Temps passé
# • Feedback des utilisateurs
# • Performance globale
```

### 2. Entraînement régulier

```bash
# Entraîner mensuellement (ou après 500+ nouvelles données)
python manage.py train_ml_models --all
```

### 3. Évaluation

```bash
# Évaluer les performances
python manage.py train_ml_models --compare
python manage.py train_ml_models --evaluate-all
```

### 4. Déploiement

```bash
# Le meilleur modèle devient actif automatiquement
# Voir ModelComparison.select_best_model()
```

---

## 💡 Optimisation des modèles

### Augmenter la performance

1. **Plus de données**
   ```python
   # Collecter 6-12 mois d'historique
   df = DataPreparation.get_training_data(days_back=365)
   ```

2. **Ajuster les hyperparameters**
   ```python
   # Dans ModelTrainer.MODELS_CONFIG
   MODELS_CONFIG = {
       'gradient_boosting': {
           'n_estimators': 300,      # Augmenter
           'learning_rate': 0.05,    # Diminuer (plus précis)
           'max_depth': 8,           # Ajuster
           # ...
       }
   }
   ```

3. **Ajouter des features**
   ```python
   # Ajouter interaction entre features
   'difficulty_match': student_level / exercise_difficulty
   ```

4. **Ensemble methods**
   ```python
   # Combiner plusieurs modèles
   from sklearn.ensemble import VotingRegressor
   
   ensemble = VotingRegressor([
       ('gb', gb_model),
       ('rf', rf_model),
   ])
   ```

### Monitoring

```python
from apps.recommendations.training import ModelEnhancer

# Analyser le modèle
model = MLModelVersion.get_active_model('recommendation')
stats = ModelEnhancer.analyze_model_performance(model)

print(f"R²: {stats['r2_score']:.4f}")
print(f"RMSE: {stats['rmse']:.4f}")

# Identifier les domaines d'amélioration
improvements = ModelEnhancer.identify_improvement_areas(model)
for improvement in improvements:
    print(f"  • {improvement}")
```

---

## 🗄️ Gestion des modèles

### Sauvegarde et chargement

```python
from apps.recommendations.models_ml import MLModelVersion

model_record = MLModelVersion.get_active_model('recommendation')

# Charger le modèle
model = model_record.load_model()
scaler = model_record.load_scaler()

# Utiliser
prediction = model.predict(X_scaled)
```

### Versioning

```python
# Les modèles sont versionés
model = MLModelVersion.objects.filter(
    model_type='recommendation'
).order_by('-trained_at')

for m in model:
    print(f"{m.version} - {m.status} - {m.r2:.4f}")
```

### Archivage

```python
# Archiver un ancien modèle
old_model = MLModelVersion.objects.get(version='1.0.0')
old_model.status = 'archived'
old_model.save()
```

---

## 🔐 Best Practices

### ✅ À faire

- Entraîner avec au moins 100 samples
- Valider avec cross-validation
- Monitorer les métriques
- Réentraîner tous les 30 jours ou après 500+ nouvelles données
- Garder un historique des versions
- Tester en staging avant production
- Mettre en cache les prédictions

### ❌ À éviter

- Entraîner avec très peu de données (<50)
- Overfitting (trop de features, trop complexe)
- Ignorer la validation croisée
- Déployer sans tests
- Laisser un modèle sans maintenance
- Ne pas monitorer la performance

---

## 📞 Dépannage

### Le modèle n'entraîne pas

```bash
# Vérifier les données
python manage.py shell
>>> from apps.recommendations.training import DataPreparation
>>> df = DataPreparation.get_training_data()
>>> print(len(df), len(df.columns))

# Doit afficher: nombre > 0 et colonnes > 0
```

### Performance faible (R² < 0.6)

```python
# Options:
# 1. Ajouter plus de données
# 2. Ajouter des features pertinentes
# 3. Ajuster les hyperparameters
# 4. Utiliser un modèle plus complexe
```

### Cache des prédictions

```bash
# Vider le cache
python manage.py shell
>>> from apps.recommendations.models_ml import ModelPredictionCache
>>> ModelPredictionCache.objects.all().delete()
```

---

## 📚 Ressources

- scikit-learn: https://scikit-learn.org/
- Gradient Boosting: https://en.wikipedia.org/wiki/Gradient_boosting
- Feature Engineering: https://machinelearningmastery.com/feature-engineering/
- Model Evaluation: https://scikit-learn.org/stable/modules/model_evaluation.html

---

**Version**: 1.0.0  
**Dernière mise à jour**: 21 janvier 2026
