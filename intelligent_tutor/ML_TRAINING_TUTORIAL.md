# 🤖 TUTORIEL COMPLET - ENTRAÎNER LES MODÈLES ML

**Date:** 22 janvier 2026  
**Niveau:** Débutant à Intermédiaire  
**Durée:** 30-45 minutes (première fois)  

---

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#prérequis)
2. [Vérifier votre installation](#vérifier-votre-installation)
3. [Étape 1: Préparer les données](#étape-1-préparer-les-données)
4. [Étape 2: Entraîner les modèles](#étape-2-entraîner-les-modèles)
5. [Étape 3: Vérifier les résultats](#étape-3-vérifier-les-résultats)
6. [Étape 4: Utiliser les modèles](#étape-4-utiliser-les-modèles)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prérequis

### Avant de commencer, assurez-vous d'avoir:

```bash
# 1. Installation Python complète
python --version  # Doit être 3.8+

# 2. Django & dépendances installées
pip install -r requirements.txt

# 3. Base de données migrée
python manage.py migrate

# 4. Cours importés (important!)
python manage.py shell
>>> from apps.courses.models import Course
>>> Course.objects.count()  # Doit être > 0
```

**Si un prérequis manque:** Voir la section [Troubleshooting](#troubleshooting)

---

## 🔍 Vérifier votre installation

### Commande unique de vérification:

```bash
python manage.py check
```

**Résultat attendu:**
```
System check identified no issues (0 silenced).
```

### Vérifier que les modèles ML sont disponibles:

```bash
python manage.py shell
```

**Puis dans le shell:**
```python
# Vérifier les modèles existants
from apps.recommendations.models import MLModelVersion
MLModelVersion.objects.all().values('model_name', 'status')

# Exemple de sortie:
# <QuerySet [{'model_name': 'correction_model', 'status': 'training'}]>
```

---

## 📊 ÉTAPE 1: Préparer les données

### A. Vérifier que vous avez des cours

```bash
python manage.py shell
```

**Commandes:**
```python
from apps.courses.models import Course, Lesson, Exercise

# 1. Compter les cours
print(f"Cours disponibles: {Course.objects.count()}")

# 2. Compter les leçons
print(f"Leçons: {Lesson.objects.count()}")

# 3. Compter les exercices
print(f"Exercices: {Exercise.objects.count()}")

# 4. Afficher les matières
from apps.courses.models import Subject
for subject in Subject.objects.all():
    count = Course.objects.filter(subject=subject).count()
    print(f"  {subject.name}: {count} cours")

# Résultat attendu:
# Cours disponibles: 150
# Leçons: 300
# Exercices: 500
# Français: 45 cours
# Mathématiques: 40 cours
# etc...
```

### B. Si les données manquent: Importer les cours

```bash
# Importer les cours du site Burkina Faso
bash import_faso_courses.sh
```

**Ou manuellement:**
```bash
python scraper/faso_education_scraper.py
python manage.py import_faso_courses
```

### C. Générer les données d'entraînement

**Note:** Le pipeline ML génère automatiquement des données synthétiques pendant l'entraînement. Vous n'avez rien à faire de spécial!

---

## 🎯 ÉTAPE 2: Entraîner les modèles

### Option A: ENTRAÎNEMENT COMPLET (Recommandé) ⭐

**La manière la plus simple - UNE SEULE COMMANDE:**

```bash
python manage.py train_ml_models --all --activate
```

**Cela va:**
1. ✅ Charger tous les cours
2. ✅ Générer les données d'entraînement
3. ✅ Entraîner 4 modèles (RandomForest, GradientBoosting, etc.)
4. ✅ Évaluer les modèles
5. ✅ Sauvegarder les modèles
6. ✅ Activer les modèles pour l'API
7. ✅ Afficher un résumé

**Temps estimé:** 5-10 minutes (première fois)

**Résultat attendu:**
```
╔════════════════════════════════════════╗
║  🤖 ML Model Training                  ║
╚════════════════════════════════════════╝

📚 Loading courses...
✅ Loaded 150 courses

🔧 Generating training data...
✅ Generated 1000 training samples

🎯 Training models...
  ✅ Exercise Correction Model (95.2% accuracy)
  ✅ Error Analysis Model (92.8% accuracy)
  ✅ Recommendation Model (89.5% accuracy)
  ✅ Performance Prediction Model (91.3% accuracy)

💾 Saving models...
✅ Models saved successfully

🚀 Activating models...
✅ Models are now active

📊 Summary:
  Total models: 4
  Status: ACTIVE
  Ready for API: YES
```

---

### Option B: Entraîner UN MODÈLE SPÉCIFIQUE

**Si vous voulez entraîner seulement un modèle:**

```bash
# Correction Model uniquement
python manage.py train_ml_models --model correction --activate

# Error Analysis Model uniquement
python manage.py train_ml_models --model error_analysis --activate

# Recommendation Model uniquement
python manage.py train_ml_models --model recommendation --activate

# Performance Model uniquement
python manage.py train_ml_models --model performance --activate
```

---

### Option C: Entraînement SANS activation

**Si vous voulez tester avant d'activer:**

```bash
python manage.py train_ml_models --all
# Ne pas utiliser --activate
```

---

### Option D: Voir les options disponibles

```bash
python manage.py train_ml_models --help
```

**Résultat:**
```
Usage: manage.py train_ml_models [options]

Options:
  --all                 Train all models
  --model MODEL         Train specific model (correction, error_analysis, 
                        recommendation, performance)
  --activate            Activate models after training
  --verbose             Verbose output
  --help                Show this help message
```

---

## ✨ ÉTAPE 3: Vérifier les résultats

### A. Vérifier que les modèles sont activés

```bash
python manage.py shell
```

**Commandes:**
```python
from apps.recommendations.models import MLModelVersion

# 1. Voir tous les modèles
models = MLModelVersion.objects.all()
for model in models:
    print(f"\n{model.model_name}:")
    print(f"  Status: {model.status}")
    print(f"  Accuracy: {model.accuracy}")
    print(f"  F1 Score: {model.f1_score}")
    print(f"  Training Date: {model.trained_at}")

# 2. Voir les modèles actifs uniquement
active_models = MLModelVersion.objects.filter(status='active')
print(f"Modèles actifs: {active_models.count()}")

# 3. Voir les métriques complètes
for model in models:
    print(f"\n{model.model_name} Metrics:")
    import json
    metrics = json.loads(model.metrics)
    for key, value in metrics.items():
        print(f"  {key}: {value:.4f}")
```

**Résultat attendu:**
```
correction_model:
  Status: active
  Accuracy: 0.952
  F1 Score: 0.948
  Training Date: 2026-01-22 10:30:00

error_analysis_model:
  Status: active
  Accuracy: 0.928
  F1 Score: 0.925
  Training Date: 2026-01-22 10:32:00

recommendation_model:
  Status: active
  Accuracy: 0.895
  F1 Score: 0.892
  Training Date: 2026-01-22 10:34:00

performance_model:
  Status: active
  Accuracy: 0.913
  F1 Score: 0.910
  Training Date: 2026-01-22 10:36:00
```

### B. Regarder les logs d'entraînement

```bash
# Voir les logs récents
tail -50 logs/training.log

# Ou voir tout
cat logs/training.log
```

### C. Tester les modèles avec une API

```bash
# Tester la correction d'exercice
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_answer": "Paris est la capital de la France",
    "correct_answer": "Paris est la capitale de la France",
    "subject": "french"
  }'

# Résultat attendu:
{
  "is_correct": false,
  "confidence": 0.95,
  "feedback": "Petite erreur d'orthographe: 'capital' → 'capitale'"
}
```

---

## 🚀 ÉTAPE 4: Utiliser les modèles

### A. API Correction (La plus utilisée)

**Endpoint:** `POST /api/correction/`

**Exemple de requête:**
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_answer": "2 + 2 = 5",
    "correct_answer": "2 + 2 = 4",
    "subject": "math",
    "exercise_id": 123
  }'
```

**Réponse:**
```json
{
  "is_correct": false,
  "confidence": 0.98,
  "feedback": "Calculez correctement: 2 + 2 = 4",
  "explanation": "L'addition est fausse. 2 plus 2 égale 4, pas 5."
}
```

### B. API Analyse d'erreurs

**Endpoint:** `POST /api/exercise-analysis/`

```bash
curl -X POST http://localhost:8000/api/exercise-analysis/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_answer": "Le chat mangent du lait",
    "correct_answer": "Le chat mange du lait",
    "subject": "french"
  }'
```

**Réponse:**
```json
{
  "error_type": "grammar",
  "severity": "medium",
  "explanation": "Accord du verbe avec le sujet. 'chat' est singulier, donc 'mange' pas 'mangent'",
  "suggestions": [
    "Utilisez 'mange' avec 'le chat'",
    "Règle: sujet singulier = verbe singulier"
  ]
}
```

### C. API Recommandations

**Endpoint:** `POST /api/recommendations/`

```bash
curl -X POST http://localhost:8000/api/recommendations/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 42,
    "subject": "math",
    "difficulty_level": 3
  }'
```

**Réponse:**
```json
{
  "recommendations": [
    {
      "course_id": 15,
      "course_title": "Fractions et Décimales",
      "reason": "Vous avez fait erreur en fraction. Voici le cours pertinent.",
      "difficulty": 2,
      "estimated_time_minutes": 25
    }
  ]
}
```

---

## 📅 ENTRAÎNEMENT AUTOMATIQUE (Optionnel)

### Mettre à jour les modèles quotidiennement

**Ajouter à crontab:**
```bash
crontab -e

# Ajouter cette ligne:
0 2 * * * cd /home/tanou/Bur/projetWeb/intelligent_tutor && python manage.py train_ml_models --all --activate
```

**Cela va:**
- Entraîner automatiquement à 2h du matin
- Activer les nouveaux modèles
- Garder les anciens en backup

---

## 🐛 Troubleshooting

### Erreur 1: "ModuleNotFoundError: No module named 'sklearn'"

**Solution:**
```bash
pip install scikit-learn pandas numpy
```

### Erreur 2: "No courses found"

**Solution:**
```bash
# Importer les cours d'abord
bash import_faso_courses.sh
```

### Erreur 3: "Database error"

**Solution:**
```bash
# Vérifier les migrations
python manage.py migrate

# Puis relancer
python manage.py train_ml_models --all
```

### Erreur 4: "Modèles ne s'activent pas"

**Solution:**
```bash
# Vérifier le status
python manage.py shell
from apps.recommendations.models import MLModelVersion
MLModelVersion.objects.all().values('model_name', 'status')

# Activez manuellement si nécessaire
python manage.py train_ml_models --all --activate
```

### Erreur 5: "Entraînement très lent"

**C'est normal!** Première exécution peut prendre 5-10 minutes.

**Optimisations:**
```bash
# Entraîner un seul modèle d'abord
python manage.py train_ml_models --model correction --activate

# Puis progressivement les autres
python manage.py train_ml_models --model error_analysis --activate
```

---

## 📊 Comprendre les résultats

### Accuracy (Précision)
- **95% = Excellent** ✅
- **80-90% = Bon** 👍
- **70-80% = Acceptable** ⚠️
- **<70% = À améliorer** ❌

### F1 Score
- Moyenne harmonic entre precision et recall
- **>0.9 = Excellent** ✅
- Plus élevé = mieux

### Résultats typiques:
```
Correction Model:     95.2% ✅
Error Analysis:       92.8% ✅
Recommendation:       89.5% ✅
Performance:          91.3% ✅
```

---

## 🎯 WORKFLOW COMPLET (Résumé)

**Pour entraîner TOUT depuis zéro:**

```bash
# Étape 1: Préparation (une fois)
pip install -r requirements.txt
python manage.py migrate

# Étape 2: Importer les données (une fois)
bash import_faso_courses.sh

# Étape 3: ENTRAÎNER LES MODÈLES (régulièrement)
python manage.py train_ml_models --all --activate

# Étape 4: Vérifier les résultats
python manage.py shell
# >>> Voir les modèles & métriques (voir Étape 3 ci-dessus)

# Étape 5: Utiliser via l'API
# Faire des requêtes POST aux endpoints /api/correction/ etc.
```

**Temps total:** ~15 minutes la première fois

---

## ✅ CHECKLIST D'ENTRAÎNEMENT

- [ ] Python 3.8+ installé
- [ ] pip install -r requirements.txt exécuté
- [ ] python manage.py migrate réussi
- [ ] bash import_faso_courses.sh complété
- [ ] Course.objects.count() > 0
- [ ] python manage.py check = OK
- [ ] python manage.py train_ml_models --all --activate exécuté
- [ ] Modèles visibles en BD (MLModelVersion.objects.all())
- [ ] Status = 'active' pour tous les modèles
- [ ] Tester API endpoints

---

## 💡 PRO TIPS

### 1. Entraîner rapidement
```bash
# Juste tester? Entraîner un modèle:
python manage.py train_ml_models --model correction --activate
```

### 2. Voir la progression
```bash
# Dans un autre terminal, voir les logs:
tail -f logs/training.log
```

### 3. Réentraîner régulièrement
```bash
# Chaque semaine:
python manage.py train_ml_models --all --activate
```

### 4. Sauvegarder les résultats
```bash
python manage.py dumpdata apps.recommendations.MLModelVersion > models_backup.json
```

---

## 🎓 PROCHAINES ÉTAPES

Une fois les modèles entraînés:

1. ✅ Tester les APIs
2. ✅ Intégrer dans le frontend
3. ✅ Monitorer les performances
4. ✅ Réentraîner régulièrement

---

## 📞 AIDE RAPIDE

| Besoin | Commande |
|--------|----------|
| Entraîner tout | `python manage.py train_ml_models --all --activate` |
| Entraîner un modèle | `python manage.py train_ml_models --model correction --activate` |
| Voir les résultats | `python manage.py shell` + queries ci-dessus |
| Tester API | `curl -X POST http://localhost:8000/api/correction/` |
| Logs | `tail -f logs/training.log` |
| Aide | `python manage.py train_ml_models --help` |

---

## 🎉 SUCCÈS!

Si vous arrivez ici avec des modèles actifs → **Vous avez réussi!** ✅

Vos modèles ML sont maintenant **prêts à faire des prédictions**.

---

**Créé:** 22 janvier 2026  
**Niveau:** Facile à suivre  
**Durée:** 30-45 minutes  
**Status:** ✅ Prêt à utiliser
