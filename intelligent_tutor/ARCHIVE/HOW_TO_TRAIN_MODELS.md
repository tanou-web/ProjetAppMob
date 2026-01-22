# 🎓 GUIDE COMPLET: ENTRAÎNER LES MODÈLES IA

## 📋 Vue d'ensemble rapide

Vous avez un système IA pour aider les élèves burkinabè avec:
- ✅ Correction automatique d'exercices
- ✅ Détection des erreurs  
- ✅ Explications pédagogiques
- ✅ Recommandations d'exercices

**Le problème:** Comment entraîner les modèles?

**La solution:** Ce guide complet!

---

## 🚀 DÉMARRAGE RAPIDE (5 minutes)

### Étape 1: Installation

```bash
cd /home/tanou/Bur/projetWeb/intelligent_tutor

# Installer les dépendances ML
pip install -r requirements.txt
pip install scikit-learn joblib pandas

# Initialiser la base de données
python manage.py migrate
```

### Étape 2: Lancer l'entraînement

**Option A: Tous les modèles (recommandé)**
```bash
python manage.py train_ml_models --all --activate
```

**Option B: Modèle de correction seulement**
```bash
python manage.py train_ml_models --correction --activate
```

### Étape 3: Vérifier les résultats

```bash
# Voir le fichier des résultats
cat training_results.json

# Ou dans Django admin
# http://localhost:8000/admin/recommendations/mlmodelversion/
```

✅ **C'est terminé!** Votre modèle est maintenant en production.

---

## 📚 ARCHITECTURE COMPLÈTE

### 4 Modèles à entraîner

```
1. MODÈLE DE CORRECTION
   - Input: Question + Réponse élève
   - Output: Correct/Incorrect (+ confiance)
   - Type: Classification binaire
   - Framework: Random Forest
   - Accuracy cible: > 85%

2. MODÈLE D'ANALYSE D'ERREURS
   - Input: Réponse incorrecte + Question
   - Output: Type d'erreur (calcul/compréhension/logique)
   - Type: Classification multi-classe
   - Framework: Gradient Boosting
   - Accuracy cible: > 75%

3. MODÈLE DE RECOMMANDATION
   - Input: Profil élève + Historique
   - Output: Exercices à recommander
   - Type: Content-based filtering
   - Framework: Scikit-learn
   - Precision cible: > 70%

4. MODÈLE DE PERFORMANCE
   - Input: Historique réponses
   - Output: Score futur prédit
   - Type: Régression
   - Framework: XGBoost
   - R² cible: > 0.75
```

### Pipeline d'entraînement

```
Curriculum Burkina
        ↓
    [Préparation des données]
    - Extraire exercices (500+)
    - Générer erreurs synthétiques
    - Nettoyer et valider
        ↓
    [Feature Engineering]
    - TF-IDF (texte)
    - Embeddings (BERT optionnel)
    - Métadonnées curriculum
        ↓
    [Entraînement]
    - Train: 70%
    - Validation: 15%
    - Test: 15%
        ↓
    [Évaluation]
    - Accuracy, Precision, Recall, F1
    - Validation croisée
        ↓
    [Versioning]
    - Sauvegarde en pickle
    - Enregistrement en DB
        ↓
    [Déploiement]
    - Setter comme "active"
    - Monitoring en production
```

---

## 💾 DONNÉES D'ENTRAÎNEMENT

### Minimum requis

**Pour un MVP (Produit Minimum Viable):**
- 500 exercices de base
- 2,000+ variations (avec erreurs synthétiques)
- 10 niveaux × 6 matières

**Vous avez déjà:**
- ✅ Curriculum complet du Burkina Faso (CP1-CP2)
- ✅ Structures de cours et leçons dans Django
- ❌ Réponses d'élèves réelles

### Générer les données

**Option 1: Extraire du curriculum (Automatique)**
```python
from apps.recommendations.training_pipeline import DatasetPreparer

preparer = DatasetPreparer()
exercises = preparer.load_curriculum_exercises()
print(f"Exercices chargés: {len(exercises)}")

# Générer erreurs synthétiques
training_data = preparer.generate_synthetic_errors(exercises, num_variations=5)
print(f"Samples après augmentation: {len(training_data)}")
```

**Option 2: Importer depuis CSV**
```python
import pandas as pd

# Format CSV requis:
# question,correct_answer,level,subject,explanation
df = pd.read_csv('exercices_burkina.csv')

from apps.recommendations.training_pipeline import DatasetPreparer
preparer = DatasetPreparer()
training_data = preparer.generate_synthetic_errors(df)
```

**Option 3: Créer depuis zéro (Manuel)**
```python
import pandas as pd

data = {
    'question': [
        'Quelle est la décomposition additive de 7?',
        'Quel est le résultat de 5 + 3?',
    ],
    'correct_answer': [
        '7 = 3 + 4',
        '8',
    ],
    'level': [
        'primary_cp1',
        'primary_cp1',
    ],
    'subject': [
        'math',
        'math',
    ],
    'explanation': [
        'La décomposition additive...',
        'Additionner 5 et 3...',
    ]
}

df = pd.DataFrame(data)
```

---

## 🤖 ENTRAÎNER LES MODÈLES

### Méthode 1: Ligne de commande (Plus simple)

```bash
# TOUS les modèles
python manage.py train_ml_models --all --activate

# Seulement correction
python manage.py train_ml_models --correction --activate

# Seulement analyse d'erreurs
python manage.py train_ml_models --error-analysis --activate

# Avec curriculum custom
python manage.py train_ml_models --all --curriculum=/path/to/data.json

# Données synthétiques seulement
python manage.py train_ml_models --all --synthetic-only
```

**Options disponibles:**
```
--all                   Tous les modèles
--correction            Modèle correction
--error-analysis        Modèle erreurs
--curriculum PATH       Chemin custom
--synthetic-only        Pas de données réelles
--activate              Setter comme actif
```

### Méthode 2: Script Python

```python
# train_script.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.recommendations.training_pipeline import TrainingOrchestrator

# Lancer l'entraînement
orchestrator = TrainingOrchestrator()
results = orchestrator.train_all_models(
    curriculum_path=None,
    use_synthetic_data=True
)

# Afficher résultats
print("\n" + "="*60)
print("RÉSULTATS D'ENTRAÎNEMENT")
print("="*60)

for model_type, result in results.items():
    if 'metrics' in result:
        print(f"\n{model_type}:")
        for metric, value in result['metrics'].items():
            print(f"  {metric}: {value:.2%}")

print("\nFichier résultats: training_results.json")
```

### Méthode 3: Jupyter Notebook

```python
# Notebook cell 1
import sys
sys.path.insert(0, '/home/tanou/Bur/projetWeb/intelligent_tutor')

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

# Notebook cell 2
from apps.recommendations.training_pipeline import *
import pandas as pd

# Préparation des données
print("📊 Préparation des données...")
preparer = DatasetPreparer()
exercises = preparer.load_curriculum_exercises()
print(f"✅ {len(exercises)} exercices chargés")

# Augmentation
training_data = preparer.generate_synthetic_errors(exercises, num_variations=3)
print(f"✅ {len(training_data)} samples après augmentation")

# Splits
train_df, val_df, test_df = preparer.create_splits(training_data)

# Notebook cell 3
# Entraînement du modèle de correction
print("\n🤖 Entraînement modèle correction...")
trainer = ExerciseCorrectionTrainer()
metrics = trainer.train(train_df, val_df)

print(f"✅ Accuracy: {metrics['accuracy']:.2%}")
print(f"✅ Precision: {metrics['precision']:.2%}")
print(f"✅ Recall: {metrics['recall']:.2%}")
print(f"✅ F1-Score: {metrics['f1']:.2%}")

# Notebook cell 4
# Sauvegarde du modèle
print("\n💾 Sauvegarde du modèle...")
persistence = ModelPersistenceManager()
version = persistence.save_model_version(
    model=trainer.model,
    model_type='correction',
    metrics=metrics,
    feature_engineer=trainer.feature_engineer,
    training_config={
        'train_samples': len(train_df),
        'model_type': 'RandomForest'
    }
)
print(f"✅ Modèle sauvegardé: {version.version}")
```

---

## ✅ TESTER LES MODÈLES

### Test 1: Vérifier les métriques

```python
from apps.recommendations.models_ml import MLModelVersion

# Charger le modèle actif
model = MLModelVersion.objects.filter(
    model_type='correction',
    status='active'
).latest('trained_at')

print(f"Modèle: {model.version}")
print(f"Accuracy: {model.accuracy:.2%}")
print(f"F1-Score: {model.f1_score:.2%}")
```

### Test 2: Prédire sur des exercices réels

```python
from apps.recommendations.training_pipeline import PredictionService

service = PredictionService()

# Test: Réponse correcte
result = service.correct_exercise(
    question="Quel est le résultat de 2 + 3?",
    student_answer="5",
    subject="math",
    level="primary_cp1"
)

print(f"Réponse correcte: {result['is_correct']}")  # True
print(f"Confiance: {result['confidence']:.2%}")     # ~92%

# Test: Réponse incorrecte
result = service.correct_exercise(
    question="Quel est le résultat de 2 + 3?",
    student_answer="4",
    subject="math",
    level="primary_cp1"
)

print(f"Réponse correcte: {result['is_correct']}")  # False
print(f"Confiance: {result['confidence']:.2%}")     # ~87%
print(f"Type d'erreur: {result['error_type']}")     # off_by_one
```

### Test 3: Dashboard Django Admin

Allez à: **http://localhost:8000/admin/recommendations/mlmodelversion/**

Vous verrez:
- Version du modèle
- Status (training, active, archived)
- Métriques (Accuracy, Precision, Recall, F1)
- Date d'entraînement
- Chemin du fichier

---

## 📈 MONITORER EN PRODUCTION

### Métriques importantes

```python
# Dashboard de monitoring
from django.db.models import Avg, Count
from apps.recommendations.models_ml import MLModelVersion

# Modèles actifs
active_models = MLModelVersion.objects.filter(status='active')
for model in active_models:
    print(f"{model.version}: Accuracy={model.accuracy:.2%}")

# Historique d'entraînement
history = MLModelVersion.objects.filter(
    model_type='correction'
).order_by('-trained_at')[:5]

for model in history:
    print(f"{model.trained_at}: {model.accuracy:.2%} → {model.status}")

# Tendance (accuracy improve over time?)
import pandas as pd
df = pd.DataFrame(
    list(MLModelVersion.objects.values('trained_at', 'accuracy'))
)
df['trained_at'] = pd.to_datetime(df['trained_at'])
df.set_index('trained_at').plot(title='Accuracy Over Time')
```

### Logs d'entraînement

```bash
# Voir les logs
tail -f logs/training.log

# Ou chercher des erreurs
grep -i "error" logs/training.log

# Extraire les métriques
grep "Accuracy" logs/training.log
```

---

## 🔧 RÉSOLUTION DES PROBLÈMES

### ❌ "Pas d'exercices trouvés"

```
ERROR: No exercises loaded
```

**Solution:**
```python
from apps.courses.models import Course, Lesson

# Vérifier qu'il y a des cours
courses = Course.objects.filter(status='published')
print(f"Courses: {courses.count()}")

# Vérifier qu'il y a des leçons
lessons = Lesson.objects.all()
print(f"Lessons: {lessons.count()}")

# Si vide, créer manuellement:
from apps.courses.models import Subject
subject = Subject.objects.first()
course = Course.objects.create(
    subject=subject,
    level='primary_cp1',
    title='Math CP1'
)
lesson = Lesson.objects.create(
    course=course,
    title='Décomposition additive',
    content='<p>Apprendre à décomposer...</p>'
)
```

### ❌ "Accuracy très basse (< 70%)"

**Causes:**
1. Données insuffisantes → Augmenter num_variations
2. Features mal choisies → Améliorer feature engineering
3. Hyperparamètres → Tuner les paramètres

**Solution rapide:**
```python
# Augmenter les données
training_data = preparer.generate_synthetic_errors(
    exercises,
    num_variations=10  # ← Augmenter de 5 à 10
)

# Retrain
metrics = trainer.train(train_df, val_df)
```

### ❌ "Erreur: 'Vectorizer not fitted'"

**Cause:** Vectorizer utilisé sans fit préalable

**Solution:**
```python
# ✅ CORRECT
X_train = engineer.create_text_features(train_texts, fit=True)   # FIT
X_val = engineer.create_text_features(val_texts, fit=False)      # No re-fit

# ❌ INCORRECT
X_train = engineer.create_text_features(train_texts, fit=True)
X_val = engineer.create_text_features(val_texts, fit=True)       # Don't re-fit!
```

### ⚠️ "Modèle très lourd (> 100 MB)"

**Solution:**
```python
# Réduire complexité
trainer.model = RandomForestClassifier(
    n_estimators=50,    # ← Moins d'arbres
    max_depth=10,       # ← Moins de profondeur
)

# Ou utiliser XGBoost (plus compact)
from xgboost import XGBClassifier
trainer.model = XGBClassifier(n_estimators=50)
```

---

## 📊 CRITÈRES DE SUCCÈS

Après entraînement, vérifiez:

```
✅ MODÈLE DE CORRECTION
   Accuracy:  > 85%
   Precision: > 82%
   Recall:    > 80%
   F1-Score:  > 81%

✅ MODÈLE D'ERREURS
   Accuracy:  > 75%
   Macro-F1:  > 72%

✅ PERFORMANCE
   Latency:   < 100ms
   Memory:    < 50 MB
   Speed:     > 100 pred/sec

✅ UTILISATEURS
   Feedback:  > 4/5
   Clarity:   > 4/5
```

---

## 🎯 NEXT STEPS

1. **Collecte données réelles**
   - Intégrer vraies réponses d'élèves
   - Valider avec enseignants

2. **Fine-tuning avancé**
   - Hyperparameter search
   - Ensemble methods

3. **Explications IA**
   - LIME pour interpretability
   - T5 pour génération d'explications

4. **Recommandations**
   - Apprentissage par renforcement
   - Curriculum learning

5. **Production**
   - Docker
   - Monitoring (Prometheus)
   - A/B testing

---

## 📞 BESOIN D'AIDE?

- 📧 Email: support@intelligenttutor.bf
- 📚 Code: `/home/tanou/Bur/projetWeb/intelligent_tutor/`
- 📖 Docs: `ML_TRAINING_STRATEGY.md`

