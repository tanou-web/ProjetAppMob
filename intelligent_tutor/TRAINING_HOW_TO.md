# 🤖 GUIDE COMPLET D'ENTRAÎNEMENT DES MODÈLES ML

## Vue d'ensemble

Ce guide vous montre comment entraîner les modèles ML pour votre système de recommandations.

---

## 🚀 Démarrage Rapide (5 minutes)

### Option 1: Script Automatisé (Recommandé)

```bash
# Rendre le script exécutable
chmod +x setup_and_train.sh

# Exécuter le setup complet
./setup_and_train.sh
```

Le script va:
1. ✅ Créer les migrations Django
2. ✅ Générer des données d'entraînement
3. ✅ Entraîner les modèles (GB + RF)
4. ✅ Vérifier les résultats
5. ✅ Afficher un rapport complet

**Temps estimé**: 3-5 minutes

---

## 📋 Démarrage Manuel (Étape par Étape)

Si vous préférez faire manuellement:

### ÉTAPE 1: Migrations Django

```bash
python manage.py makemigrations recommendations
python manage.py migrate recommendations
```

### ÉTAPE 2: Générer des données d'entraînement

```bash
python manage.py shell
```

Puis copiez-collez:

```python
import random
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from apps.exercises.models import Exercise, ExerciseAttempt

User = get_user_model()

# 1. Créer 5 étudiants test
students = []
for i in range(5):
    email = f"student{i+1}@example.com"
    user, created = User.objects.get_or_create(
        email=email,
        defaults={'password': 'testpass', 'first_name': f'Student{i+1}', 'role': 'student'}
    )
    students.append(user)

# 2. Récupérer les exercices existants
exercises = Exercise.objects.filter(is_active=True)[:10]

# 3. Créer 2 tentatives par (étudiant × exercice)
for student in students:
    for exercise in exercises:
        for _ in range(2):
            is_correct = random.random() < 0.7  # 70% de succès
            ExerciseAttempt.objects.create(
                student=student,
                exercise=exercise,
                status='submitted',
                student_answer=exercise.correct_answer if is_correct else "wrong",
                is_correct=is_correct,
                score=exercise.points if is_correct else 0,
                hints_used=random.randint(0, 2),
                time_spent_seconds=random.randint(30, 300),
                started_at=datetime.now() - timedelta(days=random.randint(0, 30)),
                submitted_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )

print(f"✓ {ExerciseAttempt.objects.count()} tentatives créées")
```

### ÉTAPE 3: Entraîner les modèles

```bash
# Entraîner Gradient Boosting (défaut)
python manage.py train_ml_models

# Ou entraîner les deux (GB + RF)
python manage.py train_ml_models --all

# Ou utiliser le script shell
./train_models.sh train-all
```

### ÉTAPE 4: Vérifier les résultats

```bash
# Comparer les modèles
python manage.py train_ml_models --compare

# Analyser un modèle en détail
python manage.py train_ml_models --analyze 1

# Vérifier si retraining est nécessaire
python manage.py train_ml_models --check-retraining
```

---

## 📊 Commandes Principales

### Formation

```bash
# Entraîner Gradient Boosting (par défaut)
python manage.py train_ml_models

# Entraîner les deux modèles (GB + RF)
python manage.py train_ml_models --all

# Entraîner un modèle spécifique
python manage.py train_ml_models --model-type gradient_boosting

# Spécifier une version
python manage.py train_ml_models --all --version 2.0
```

### Analyse et Comparaison

```bash
# Comparer tous les modèles
python manage.py train_ml_models --compare

# Évaluer tous les modèles
python manage.py train_ml_models --evaluate-all

# Analyser un modèle spécifique (ID=1)
python manage.py train_ml_models --analyze 1

# Vérifier si retraining est nécessaire
python manage.py train_ml_models --check-retraining
```

### Via Shell Script

```bash
chmod +x train_models.sh

# Former
./train_models.sh train
./train_models.sh train-all

# Comparer
./train_models.sh compare

# Évaluer
./train_models.sh evaluate

# Vérifier le status
./train_models.sh status
```

---

## 📈 Résultats Attendus

### Performance des Modèles

Après entraînement avec ~100 tentatives:

```
┌──────────────────────────┬──────────┬──────────┐
│ Métrique                 │    GB    │    RF    │
├──────────────────────────┼──────────┼──────────┤
│ R² (variance expliquée)   │   0.75   │   0.72   │
│ RMSE (erreur RMS)         │   14.2   │   15.1   │
│ MAE (erreur moyenne)      │   10.5   │   11.3   │
│ CV Score (5-fold)         │ 0.73±05  │ 0.70±06  │
│ Temps prédiction          │ < 10ms   │ < 10ms   │
└──────────────────────────┴──────────┴──────────┘

GB (Gradient Boosting) généralement meilleur pour la régression
RF (Random Forest) plus robust et plus facile à interpréter
```

### Interpréter les Résultats

| Métrique | Bon | Acceptable | Faible |
|----------|-----|-----------|--------|
| **R²** | > 0.75 | 0.60-0.75 | < 0.60 |
| **RMSE** | < 15 | 15-20 | > 20 |
| **MAE** | < 12 | 12-15 | > 15 |

---

## 🔍 Dashboard Admin

Accédez à l'interface d'administration:

```
http://localhost:8000/admin/
```

### Modèles ML:

- **MLModelVersion** - Voir tous les modèles entraînés
  - Status (training, active, archived, failed)
  - Métriques (R², RMSE, MAE)
  - Hyperparameters
  - Fichiers de modèle

- **TrainingLog** - Logs détaillés de chaque entraînement
  - Perte par époque
  - Temps de training
  - Samples utilisés

- **ModelEvaluation** - Résultats d'évaluation
  - Cross-validation scores
  - Feature importance
  - Test set performance

- **ModelPredictionCache** - Cache de prédictions
  - Hash des entrées
  - Prédictions en cache
  - TTL (validité)

---

## 💡 Cas d'Usage Courants

### Cas 1: Premier Entraînement

```bash
# 1. Setup complet
./setup_and_train.sh

# 2. Vérifier les modèles
python manage.py train_ml_models --compare

# 3. Sélectionner le meilleur
# (Normalement Gradient Boosting avec R² > 0.75)
```

### Cas 2: Améliorer R² Faible (<0.60)

**Problème**: R² faible signifie le modèle ne capture pas bien les patterns.

**Solutions**:

```bash
# Solution 1: Plus de données
# Ajouter plus de tentatives d'exercices (au moins 200+)

# Solution 2: Feature engineering
# Modifier training.py pour ajouter des features:
# - Interactions entre features
# - Polynomiales
# - Ratios

# Solution 3: Hyperparameters
# Modifier dans training.py:
# - Augmenter n_estimators (300, 400)
# - Ajuster learning_rate (0.05, 0.1)
# - Modifier max_depth (8, 10)

# Solution 4: Ré-entraîner avec plus de données
python manage.py train_ml_models --all
```

### Cas 3: Retraining Mensuel

```bash
# Chaque mois, vérifier si retraining nécessaire
python manage.py train_ml_models --check-retraining

# Si nécessaire:
python manage.py train_ml_models --all

# Vérifier les nouveaux résultats
python manage.py train_ml_models --compare
```

### Cas 4: A/B Testing de Modèles

```bash
# Entraîner GB
python manage.py train_ml_models --model-type gradient_boosting --version 2.0

# Entraîner RF
python manage.py train_ml_models --model-type random_forest --version 2.0

# Comparer
python manage.py train_ml_models --compare

# Le meilleur R² sera activé automatiquement
```

---

## 🐛 Troubleshooting

### Erreur: "Minimum samples required: 50"

**Cause**: Pas assez de données d'entraînement.

**Solution**:
```bash
# Générer plus de données
python manage.py shell < COMPLETE_SYSTEM_EXAMPLES.py

# Ou vérifier combien vous avez
python manage.py shell
>>> from apps.exercises.models import ExerciseAttempt
>>> ExerciseAttempt.objects.count()
# Doit être >= 50
```

### Erreur: "No active model found"

**Cause**: Aucun modèle n'a été entraîné.

**Solution**:
```bash
# Entraîner les modèles
python manage.py train_ml_models --all

# Vérifier
python manage.py train_ml_models --compare
```

### R² Très Faible (<0.3)

**Causes possibles**:
1. Features mal choisies
2. Données pas représentatives
3. Hyperparameters mal tuning
4. Problème de normalisation

**Solutions**:

```python
# Modifier training.py et essayer:

# 1. Augmenter hyperparameters
ModelTrainer.GB_HYPERPARAMS = {
    'n_estimators': 500,  # Augmenté
    'learning_rate': 0.05,
    'max_depth': 10,  # Augmenté
}

# 2. Ajouter plus de features dans _extract_features()

# 3. Utiliser MinMaxScaler au lieu de StandardScaler
from sklearn.preprocessing import MinMaxScaler
```

### Models pas Sauvegardés

**Cause**: Erreur pendant la sauvegarde.

**Solution**:
```bash
# Vérifier les fichiers
ls -la /home/tanou/Bur/projetWeb/intelligent_tutor/ml_models/

# Supprimer les modèles corrompus
rm -rf ml_models/

# Réentraîner
python manage.py train_ml_models --all
```

---

## 📊 Monitoring Avancé

### Suivi en Temps Réel

```python
# Dans Django Shell
from apps.recommendations.models import MLModelVersion, TrainingLog

# Voir les modèles actifs
active = MLModelVersion.objects.filter(status='active')
for model in active:
    print(f"{model.model_type}: R²={model.r2_score:.3f}, RMSE={model.rmse:.2f}")

# Voir les derniers logs
logs = TrainingLog.objects.order_by('-created_at')[:10]
for log in logs:
    print(f"Epoch {log.epoch}: Loss={log.loss:.4f}")

# Voir les feature importance
eval = ModelEvaluation.objects.latest('created_at')
print(eval.feature_importance)
```

### Graphiques (avec matplotlib)

```python
import matplotlib.pyplot as plt
from apps.recommendations.models import MLModelVersion

models = MLModelVersion.objects.all()
r2_scores = [m.r2_score for m in models]
rmse_scores = [m.rmse for m in models]

plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.bar([m.model_type for m in models], r2_scores)
plt.title('R² Scores')
plt.ylabel('R²')

plt.subplot(1, 2, 2)
plt.bar([m.model_type for m in models], rmse_scores)
plt.title('RMSE Scores')
plt.ylabel('RMSE')

plt.tight_layout()
plt.savefig('model_performance.png')
plt.show()
```

---

## 🔄 Cycle de Vie du Modèle

```
1. ENTRAÎNEMENT
   ↓
   python manage.py train_ml_models --all
   
2. ÉVALUATION
   ↓
   python manage.py train_ml_models --compare
   
3. ACTIVATION
   ↓
   Meilleur modèle activé automatiquement
   
4. UTILISATION
   ↓
   Prédictions via API/recommandations
   
5. MONITORING
   ↓
   python manage.py train_ml_models --check-retraining
   
6. RETRAINING (mensuel)
   ↓
   python manage.py train_ml_models --all
   ↓
   REVENIR À 2 (ÉVALUATION)
```

---

## 📈 Optimisation des Hyperparameters

### Gradient Boosting

```python
# Dans training.py, modifier:

GB_HYPERPARAMS = {
    'n_estimators': 200,      # Nombre d'arbres (100-500)
    'learning_rate': 0.08,    # Vitesse apprentissage (0.01-0.2)
    'max_depth': 7,           # Profondeur arbres (3-10)
    'subsample': 0.8,         # Fraction samples (0.5-1.0)
}
```

### Random Forest

```python
RF_HYPERPARAMS = {
    'n_estimators': 300,      # Nombre d'arbres (100-500)
    'max_depth': 15,          # Profondeur arbres (5-20)
    'min_samples_split': 5,   # Min samples par split (2-10)
}
```

### Guide Tuning

| Hyperparameter | Trop bas | OK | Trop haut |
|---|---|---|---|
| **n_estimators** | Underfitting | ✓ | Overfitting |
| **learning_rate** | Lent | ✓ | Instable |
| **max_depth** | Underfitting | ✓ | Overfitting |
| **subsample** | Élevé bruit | ✓ | Perte info |

---

## 🎯 Cibles de Performance

### Acceptable pour Production

```
✅ R² ≥ 0.70         (explique 70% variance)
✅ RMSE ≤ 18         (erreur acceptable)
✅ MAE ≤ 13          (erreur moyenne)
✅ Temps < 50ms      (assez rapide)
```

### Excellent

```
🌟 R² ≥ 0.80         (excellent modèle)
🌟 RMSE ≤ 12         (très bon)
🌟 MAE ≤ 9           (très bon)
🌟 Temps < 10ms      (très rapide)
```

---

## 📚 Ressources Supplémentaires

- [ML_TRAINING_GUIDE.md](ML_TRAINING_GUIDE.md) - Guide technique détaillé
- [training.py](apps/recommendations/training.py) - Code source des modèles
- [predict.py](apps/recommendations/predict.py) - Système de prédiction
- [COMPLETE_SYSTEM_EXAMPLES.py](COMPLETE_SYSTEM_EXAMPLES.py) - Exemples pratiques

---

**Besoin d'aide?**

1. Vérifier le log dans Django admin: **TrainingLog**
2. Consulter les erreurs: `python manage.py train_ml_models --analyze 1`
3. Lire la documentation: **ML_TRAINING_GUIDE.md**

**Bon entraînement!** 🚀
