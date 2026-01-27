#!/usr/bin/env python
"""
🔍 DIAGNOSTIC SCRIPT - Vérifier l'état de l'importation et l'IA

Utilisation:
    python diagnostic.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Course, Lesson, Subject
from apps.exercises.models import Exercise
from apps.recommendations.models_ml import MLModelVersion
from apps.progress.models import LessonProgress
from apps.users.models import User
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

def print_header(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def check_courses_imported():
    """Vérifie si les cours sont importés"""
    print_header("1️⃣  IMPORTATION DES COURS")
    
    total = Course.objects.count()
    print(f"Total de cours importés: {total}")
    
    if total == 0:
        print("❌ AUCUN COURS IMPORTÉ! Lancer:")
        print("   python manage.py import_faso_courses --all")
        return False
    
    # Par niveau
    levels = Course.objects.values('level').annotate(count=Count('id')).order_by('level')
    print(f"\n📚 Répartition par niveau:")
    for level in levels:
        print(f"   {level['level']}: {level['count']} cours")
    
    # Par matière
    subjects = Course.objects.values('subject__name').annotate(count=Count('id')).order_by('-count')
    print(f"\n📖 Répartition par matière:")
    for subject in subjects:
        print(f"   {subject['subject__name']}: {subject['count']} cours")
    
    # Derniers imports
    recent = Course.objects.latest('created_at')
    print(f"\n🕒 Dernier cours importé: {recent.title} ({recent.created_at.strftime('%d/%m/%Y %H:%M')})")
    
    return True

def check_lessons():
    """Vérifie les leçons"""
    print_header("2️⃣  LEÇONS")
    
    lessons = Lesson.objects.count()
    print(f"Total de leçons: {lessons}")
    
    courses_with_lessons = Course.objects.annotate(lesson_count=Count('lessons')).filter(lesson_count__gt=0).count()
    courses_without = Course.objects.annotate(lesson_count=Count('lessons')).filter(lesson_count=0).count()
    
    print(f"\n📝 Statut des leçons:")
    print(f"   Cours avec leçons: {courses_with_lessons}")
    print(f"   Cours sans leçons: {courses_without} ❌")
    
    if courses_without > 0:
        print(f"\n⚠️  {courses_without} cours sont vides! Vérifier l'import.")

def check_exercises():
    """Vérifie les exercices"""
    print_header("3️⃣  EXERCICES")
    
    try:
        total_exercises = Exercise.objects.count()
        print(f"Total d'exercices: {total_exercises}")
        
        if total_exercises == 0:
            print("❌ AUCUN EXERCICE! À implémenter:")
            print("   - Créer le modèle Exercise")
            print("   - Lier à ExerciseAnswer")
            print("   - Importer depuis le scraper")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        print("   - Modèle Exercise pas encore créé")

def check_student_data():
    """Vérifie les données des élèves"""
    print_header("4️⃣  DONNÉES DES ÉLÈVES")
    
    users = User.objects.filter(user_type='student').count()
    print(f"Total d'élèves: {users}")
    
    if users == 0:
        print("❌ Aucun élève enregistré")
        return
    
    # Élèves actifs (derniers 7 jours)
    week_ago = timezone.now() - timedelta(days=7)
    active_users = LessonProgress.objects.filter(
        last_accessed__gte=week_ago
    ).values('student').distinct().count()
    print(f"Élèves actifs (7 derniers jours): {active_users}")
    
    # Progression moyenne
    total_progress = LessonProgress.objects.count()
    print(f"Total de progressions enregistrées: {total_progress}")
    
    if total_progress > 0:
        avg_percentage = LessonProgress.objects.aggregate(avg=models.Avg('progress_percentage'))['avg']
        print(f"Progression moyenne: {avg_percentage:.1f}%")
    else:
        print("❌ Aucune progression enregistrée!")

def check_ml_models():
    """Vérifie les modèles ML"""
    print_header("5️⃣  MODÈLES ML & IA")
    
    models = MLModelVersion.objects.all().order_by('-trained_at')
    print(f"Total de versions de modèles: {models.count()}")
    
    if models.count() == 0:
        print("❌ AUCUN MODÈLE ML! Lancer l'entraînement:")
        print("   python manage.py train_ml_models")
        return
    
    print(f"\n🤖 Modèles disponibles:")
    for model in models:
        status = "✅" if model.status == 'active' else "⚠️ " if model.status == 'training' else "❌"
        print(f"\n   {status} {model.model_type} v{model.version}")
        print(f"      Statut: {model.status}")
        print(f"      Entraîné: {model.trained_at.strftime('%d/%m/%Y') if model.trained_at else 'N/A'}")
        
        if model.accuracy:
            print(f"      Metrics:")
            print(f"         - Accuracy: {model.accuracy:.2%}")
            print(f"         - Precision: {model.precision:.2%}")
            print(f"         - Recall: {model.recall:.2%}")
            print(f"         - F1: {model.f1_score:.2%}")

def check_ai_learning():
    """Vérifie si l'IA apprend des élèves"""
    print_header("6️⃣  IA APPREND DES ÉLÈVES?")
    
    print("Vérification de l'apprentissage continu...\n")
    
    try:
        from apps.exercises.models import ExerciseAnswer
        answers = ExerciseAnswer.objects.count()
        print(f"❌ Réponses d'exercices enregistrées: {answers}")
    except:
        print(f"❌ Modèle ExerciseAnswer pas créé")
    
    print(f"\n❌ PROBLÈME: L'IA n'apprend PAS des élèves!")
    print(f"\nActuellement l'IA ne s'entraîne que sur:")
    print(f"  ✅ Le curriculum (cours importés)")
    print(f"  ❌ Les données des élèves (À IMPLÉMENTER)")
    print(f"  ❌ Les erreurs types (À ANALYSER)")
    print(f"  ❌ Les patterns de performance (À TRACKER)")
    
    print(f"\nÀ FAIRE URGENCE:")
    print(f"  1. Créer modèle ExerciseAnswer")
    print(f"  2. Implémenter OnlineLearningPipeline")
    print(f"  3. Ajouter réentraînement régulier")

def main():
    """Run all diagnostics"""
    print("\n" + "="*60)
    print("  🔍 DIAGNOSTIC - Système de Tuteur Intelligent")
    print("="*60)
    
    check_courses_imported()
    check_lessons()
    check_exercises()
    check_student_data()
    check_ml_models()
    check_ai_learning()
    
    print_header("✅ DIAGNOSTIC TERMINÉ")
    print("\nProchaines étapes:")
    print("  1. Vérifier l'importation des cours")
    print("  2. Implémenter le tracking des réponses")
    print("  3. Ajouter l'apprentissage continu")
    print("  4. Tester les recommandations\n")

if __name__ == '__main__':
    main()
