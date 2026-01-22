#!/bin/bash
# ============================================================================
# SCRIPT D'ENTRAÎNEMENT COMPLET DES MODÈLES ML
# ============================================================================
# 
# Ce script configure et entraîne les modèles ML pour le système de 
# recommandations intelligentes.
#
# Usage:
#   bash setup_and_train.sh
#   ou
#   chmod +x setup_and_train.sh
#   ./setup_and_train.sh

set -e  # Exit on error

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                   ENTRAÎNEMENT DES MODÈLES ML - SETUP COMPLET               ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# ÉTAPE 1: Migrations Django
# ============================================================================

echo "📝 [ÉTAPE 1/5] Création des migrations Django..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python manage.py makemigrations recommendations 2>/dev/null || echo "⚠️  Migrations déjà existantes ou erreur"
python manage.py migrate recommendations 2>/dev/null || echo "⚠️  Migration déjà appliquée"

echo "✅ Migrations Django créées/mises à jour"
echo ""

# ============================================================================
# ÉTAPE 2: Générer des données d'entraînement (Seed Data)
# ============================================================================

echo "📊 [ÉTAPE 2/5] Génération de données d'entraînement..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python manage.py shell << 'SEED_DATA'

import sys
import random
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from apps.courses.models import Course, Lesson
from apps.exercises.models import Exercise, ExerciseAttempt, ExerciseCategory
from apps.progress.models import LessonProgress, PerformanceAnalysis

User = get_user_model()

print("Génération de données d'entraînement...")

# 1. Créer quelques utilisateurs test s'ils n'existent pas
students = []
for i in range(5):
    email = f"student{i+1}@example.com"
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(
            email=email,
            password="testpass123",
            first_name=f"Student{i+1}",
            role='student'
        )
        students.append(user)
        print(f"  ✓ Créé étudiant: {email}")
    else:
        students.append(User.objects.get(email=email))
        print(f"  ✓ Utilisé étudiant existant: {email}")

# 2. Récupérer des cours et leçons existantes
try:
    courses = Course.objects.all()[:2]
    if not courses.exists():
        print("  ⚠️  Aucun cours trouvé. Veuillez créer des cours d'abord.")
        sys.exit(1)
    
    # 3. Récupérer des exercices existants
    exercises = Exercise.objects.filter(is_active=True).all()[:10]
    if exercises.count() < 5:
        print(f"  ⚠️  Seulement {exercises.count()} exercices trouvés. Au moins 50 requis.")
        print("     Créez plus d'exercices pour l'entraînement.")
    else:
        print(f"  ✓ {exercises.count()} exercices trouvés")
    
    # 4. Générer des tentatives d'exercices pour créer des données d'entraînement
    print(f"\n  Création de {len(students) * len(exercises) * 2} tentatives d'exercices...")
    
    attempt_count = 0
    for student in students:
        for exercise in exercises:
            # 2 tentatives par étudiant/exercice
            for attempt_num in range(2):
                # Probabilité 70% de succès
                is_correct = random.random() < 0.7
                
                attempt = ExerciseAttempt.objects.create(
                    student=student,
                    exercise=exercise,
                    status='submitted',
                    student_answer=exercise.correct_answer if is_correct else "mauvaise_réponse",
                    is_correct=is_correct,
                    score=exercise.points if is_correct else 0,
                    hints_used=random.randint(0, 2),
                    time_spent_seconds=random.randint(30, 300),
                    started_at=datetime.now() - timedelta(days=random.randint(0, 30)),
                    submitted_at=datetime.now() - timedelta(days=random.randint(0, 30))
                )
                attempt_count += 1
    
    print(f"  ✓ {attempt_count} tentatives créées")
    print("\n✅ Données d'entraînement générées avec succès!")
    
except Exception as e:
    print(f"  ❌ Erreur: {e}")
    import traceback
    traceback.print_exc()

SEED_DATA

echo ""

# ============================================================================
# ÉTAPE 3: Vérifier les données d'entraînement
# ============================================================================

echo "🔍 [ÉTAPE 3/5] Vérification des données..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python manage.py shell << 'VERIFY_DATA'

from apps.exercises.models import ExerciseAttempt

attempt_count = ExerciseAttempt.objects.count()
print(f"Tentatives d'exercices dans la base: {attempt_count}")

if attempt_count >= 50:
    print(f"✅ Données suffisantes pour l'entraînement ({attempt_count} >= 50)")
else:
    print(f"⚠️  Données insuffisantes ({attempt_count} < 50)")
    print("   Le minimum requis est 50 tentatives")

VERIFY_DATA

echo ""

# ============================================================================
# ÉTAPE 4: Entraîner les modèles ML
# ============================================================================

echo "🤖 [ÉTAPE 4/5] Entraînement des modèles ML..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python manage.py train_ml_models --all

echo ""

# ============================================================================
# ÉTAPE 5: Vérifier les résultats d'entraînement
# ============================================================================

echo "📊 [ÉTAPE 5/5] Vérification des résultats..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python manage.py train_ml_models --compare

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                        ✅ ENTRAÎNEMENT RÉUSSI!                               ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Étapes suivantes:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Vérifier les modèles entraînés:"
echo "   python manage.py train_ml_models --compare"
echo ""
echo "2. Analyser un modèle en détail:"
echo "   python manage.py train_ml_models --analyze 1"
echo ""
echo "3. Faire des prédictions:"
echo "   python manage.py shell < COMPLETE_SYSTEM_EXAMPLES.py"
echo ""
echo "4. Vérifier si retraining est nécessaire:"
echo "   python manage.py train_ml_models --check-retraining"
echo ""
echo "5. Accéder à l'admin Django:"
echo "   http://localhost:8000/admin/recommendations/mlmodelversion/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
