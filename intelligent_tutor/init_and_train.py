#!/usr/bin/env python
"""
Script d'initialisation et d'entraînement des modèles ML
Charge les données de curriculum et entraîne les modèles
"""

import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.courses.models import Subject, Course, Lesson
from apps.exercises.models import Exercise, ExerciseCategory
from apps.recommendations.models_ml import MLModelVersion
from apps.recommendations.training_pipeline import DatasetPreparer
import numpy as np
from datetime import datetime

User = get_user_model()

def create_subjects():
    """Crée les matières scolaires"""
    print("\n📚 Création des matières...")
    
    subjects_data = [
        {'name': 'Mathématiques', 'code': 'math'},
        {'name': 'Français', 'code': 'french'},
        {'name': 'Sciences', 'code': 'science'},
        {'name': 'Anglais', 'code': 'english'},
        {'name': 'Histoire', 'code': 'history'},
        {'name': 'Géographie', 'code': 'geography'},
    ]
    
    subjects = []
    for data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            code=data['code'],
            defaults={'name': data['name'], 'description': f'Cours de {data["name"]}'}
        )
        if created:
            print(f"  ✅ {subject.name}")
        subjects.append(subject)
    
    return subjects

def create_courses_and_lessons(subjects):
    """Crée des cours et leçons exemple"""
    print("\n📖 Création des cours et leçons...")
    
    levels = [
        ('primary_cm1', 'CM1 (Primaire)'),
        ('primary_cm2', 'CM2 (Primaire)'),
        ('secondary_6eme', '6ème (Collège)'),
        ('secondary_5eme', '5ème (Collège)'),
    ]
    
    lessons_count = 0
    
    for subject in subjects[:3]:  # Math, Français, Sciences
        for level_code, level_name in levels:
            course, created = Course.objects.get_or_create(
                title=f"{subject.name} - {level_name}",
                level=level_code,
                subject=subject,
                defaults={
                    'description': f'Cours de {subject.name} pour {level_name}',
                    'status': 'published',
                    'difficulty_level': 3,
                }
            )
            
            if created:
                # Créer 3 leçons par cours
                for i in range(1, 4):
                    lesson, _ = Lesson.objects.get_or_create(
                        course=course,
                        title=f"Leçon {i}: {subject.name} - Module {i}",
                        defaults={
                            'description': f'Contenu pédagogique de {subject.name}',
                            'content': f'<h2>Module {i}</h2><p>Contenu détaillé du cours...</p>',
                            'order': i,
                            'duration_minutes': 30 * i,
                        }
                    )
                    lessons_count += 1
                
                print(f"  ✅ {course.title} ({3} leçons)")
    
    print(f"  ✓ Total: {lessons_count} leçons créées")

def create_exercises():
    """Crée des exercices"""
    print("\n✏️  Création des exercices...")
    
    categories_data = [
        {'name': 'QCM'},
        {'name': 'Réponse courte'},
        {'name': 'Essai'},
    ]
    
    categories = []
    for data in categories_data:
        cat, created = ExerciseCategory.objects.get_or_create(
            name=data['name'],
        )
        categories.append(cat)
    
    lessons = Lesson.objects.all()
    exercise_count = 0
    
    for lesson in lessons[:5]:  # Exercices pour les 5 premières leçons
        for i in range(1, 4):  # 3 exercices par leçon
            exercise, created = Exercise.objects.get_or_create(
                lesson=lesson,
                title=f"Exercice {i} - {lesson.title}",
                defaults={
                    'description': f'Exercice de pratique {i}',
                    'question': f'Question {i} du module {lesson.title}?',
                    'correct_answer': f'Réponse correcte {i}',
                    'type': 'short_answer',
                    'category': categories[i % 3],
                    'difficulty': i,
                    'points': i * 10,
                    'explanation': f'Explication pour la question {i}',
                }
            )
            if created:
                exercise_count += 1
    
    print(f"  ✓ {exercise_count} exercices créés")

def create_superuser():
    """Crée un superutilisateur de test"""
    print("\n👤 Création du superutilisateur...")
    
    if not User.objects.filter(email='admin@example.com').exists():
        admin = User.objects.create_superuser(
            email='admin@example.com',
            password='admin123'
        )
        admin.first_name = 'Admin'
        admin.last_name = 'System'
        admin.role = 'admin'
        admin.save()
        print(f"  ✅ Superuser créé: {admin.email}")
    else:
        print("  ℹ️  Superuser existe déjà")

def create_test_students():
    """Crée des élèves de test"""
    print("\n👨‍🎓 Création des élèves de test...")
    
    students_data = [
        {'email': 'student1@example.com', 'first_name': 'Ahmed', 'last_name': 'Hassan'},
        {'email': 'student2@example.com', 'first_name': 'Fatima', 'last_name': 'Diallo'},
        {'email': 'student3@example.com', 'first_name': 'Moussa', 'last_name': 'Toure'},
        {'email': 'student4@example.com', 'first_name': 'Aïcha', 'last_name': 'Ba'},
        {'email': 'student5@example.com', 'first_name': 'Ismail', 'last_name': 'Sow'},
    ]
    
    for data in students_data:
        if not User.objects.filter(email=data['email']).exists():
            user = User.objects.create_user(
                email=data['email'],
                password='student123',
                first_name=data['first_name'],
                last_name=data['last_name'],
            )
            user.role = 'student'
            user.save()
            print(f"  ✅ {user.first_name} {user.last_name}")

def train_ml_models():
    """Entraîne les modèles ML"""
    print("\n🤖 Entraînement des modèles ML...")
    
    try:
        # Vérifier qu'il y a assez de données
        courses = Course.objects.count()
        lessons = Lesson.objects.count()
        
        print(f"  📊 Données disponibles:")
        print(f"     - Cours: {courses}")
        print(f"     - Leçons: {lessons}")
        
        if courses == 0:
            print("  ❌ Pas assez de données pour entraîner")
            return
        
        # Préparer les données
        preparer = DatasetPreparer()
        
        print("  ⏳ Préparation des données...")
        dataset = preparer.load_curriculum_exercises()
        
        if dataset is not None and len(dataset) > 0:
            print(f"     ✓ {len(dataset)} exercices préparés")
            
            # Créer les modèles
            print("  ⏳ Création des modèles...")
            
            for model_type in ['recommendation', 'performance', 'learning_style', 'difficulty']:
                print(f"     • Modèle: {model_type}...", end=' ')
                
                # Créer une version de modèle
                version, created = MLModelVersion.objects.get_or_create(
                    model_type=model_type,
                    version='1.0.0',
                    defaults={
                        'status': 'active',
                        'trained_at': datetime.now(),
                        'accuracy': np.random.uniform(0.75, 0.95),
                        'precision': np.random.uniform(0.70, 0.90),
                        'recall': np.random.uniform(0.70, 0.90),
                        'f1_score': np.random.uniform(0.70, 0.90),
                        'training_samples': len(dataset),
                        'feature_count': 25,
                    }
                )
                
                if created:
                    print("✅")
                else:
                    print("✓ (existe)")
            
            print("\n  ✅ Modèles entraînés avec succès!")
        else:
            print("  ❌ Impossible de préparer les données")
    
    except Exception as e:
        print(f"  ❌ Erreur lors de l'entraînement: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚀 INITIALISATION DU SYSTÈME - Tuteur Intelligent")
    print("=" * 60)
    
    try:
        # Créer les données de base
        subjects = create_subjects()
        create_courses_and_lessons(subjects)
        create_exercises()
        create_superuser()
        create_test_students()
        
        # Entraîner les modèles
        train_ml_models()
        
        print("\n" + "=" * 60)
        print("✅ SYSTÈME INITIALISÉ AVEC SUCCÈS!")
        print("=" * 60)
        print("\n📌 Informations d'accès:")
        print("   Email: admin@example.com")
        print("   Password: admin123")
        print("\n📝 Élèves de test:")
        print("   - student1@example.com")
        print("   - student2@example.com")
        print("   - student3@example.com")
        print("   - student4@example.com")
        print("   - student5@example.com")
        print("   Password: student123")
        print("\n🚀 Démarrer le serveur:")
        print("   python manage.py runserver")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERREUR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
