#!/usr/bin/env python
import os
import django
import sys
from datetime import datetime

# Configuration Django
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Course, Lesson, Subject
from apps.exercises.models import Exercise, ExerciseAttempt, ExerciseCategory
from apps.users.models import User

def create_sample_data():
    """Créer des données d'exemple pour l'entraînement ML"""

    print("CREATION DE DONNEES D'EXEMPLE")
    print("=" * 40)

    # Créer des catégories d'exercices
    print("Création des catégories...")
    categories = {}
    for name in ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Géographie']:
        cat, created = ExerciseCategory.objects.get_or_create(
            name=name,
            defaults={'description': f'Cours de {name}'}
        )
        categories[name] = cat
        if created:
            print(f"  [OK] {name}")

    # Créer des matières (subjects)
    print("\nCréation des matières...")
    subjects_data = [
        ('Mathématiques', 'math'),
        ('Français', 'french'),
        ('Sciences', 'science'),
        ('Histoire', 'history'),
        ('Géographie', 'geography'),
    ]

    subjects = {}
    for name, code in subjects_data:
        subject, created = Subject.objects.get_or_create(
            code=code,
            defaults={
                'name': name,
                'description': f'Matière: {name}'
            }
        )
        subjects[code] = subject
        if created:
            print(f"  [OK] {name}")

    # Créer des cours
    print("\nCréation des cours...")
    courses_data = [
        ('Mathématiques 6ème', 'math', subjects['math']),
        ('Français 6ème', 'french', subjects['french']),
        ('Sciences 6ème', 'science', subjects['science']),
        ('Histoire 6ème', 'history', subjects['history']),
        ('Géographie 6ème', 'geography', subjects['geography']),
    ]

    courses = {}
    for title, code, subject in courses_data:
        course, created = Course.objects.get_or_create(
            title=title,
            defaults={
                'description': f'Cours de {title}',
                'subject': subject,
                'level': 'secondary_6eme',  # 6ème = secondary_6eme
                'status': 'published'
            }
        )
        courses[code] = course
        if created:
            print(f"  [OK] {title}")

    # Créer des leçons
    print("\nCréation des leçons...")
    lessons_data = [
        ('Additions et soustractions', courses['math'], 'additions_soustractions'),
        ('Multiplication et division', courses['math'], 'multiplication_division'),
        ('Fractions', courses['math'], 'fractions'),
        ('Les verbes', courses['french'], 'verbes'),
        ('La grammaire', courses['french'], 'grammaire'),
        ('La lecture', courses['french'], 'lecture'),
        ('Le système solaire', courses['science'], 'systeme_solaire'),
        ('Les animaux', courses['science'], 'animaux'),
        ('Les plantes', courses['science'], 'plantes'),
    ]

    lessons = {}
    for title, course, code in lessons_data:
        lesson, created = Lesson.objects.get_or_create(
            title=title,
            course=course,
            defaults={
                'content': f'Contenu de la leçon: {title}',
                'order': len(lessons) + 1
            }
        )
        lessons[code] = lesson
        if created:
            print(f"  [OK] {title}")

    # Créer des exercices
    print("\nCréation des exercices...")
    exercises_data = [
        # Mathématiques
        ('2 + 2 = ?', '4', lessons['additions_soustractions'], categories['Mathématiques'], 'Calcul simple'),
        ('5 + 3 = ?', '8', lessons['additions_soustractions'], categories['Mathématiques'], 'Addition basique'),
        ('10 - 4 = ?', '6', lessons['additions_soustractions'], categories['Mathématiques'], 'Soustraction'),
        ('3 × 4 = ?', '12', lessons['multiplication_division'], categories['Mathématiques'], 'Multiplication'),
        ('15 ÷ 3 = ?', '5', lessons['multiplication_division'], categories['Mathématiques'], 'Division'),
        ('1/2 + 1/2 = ?', '1', lessons['fractions'], categories['Mathématiques'], 'Fractions simples'),

        # Français
        ('Comment s\'appelle le passé du verbe "aller"?', 'allé', lessons['verbes'], categories['Français'], 'Verbes au passé'),
        ('Quel est le féminin de "chat"?', 'chatte', lessons['grammaire'], categories['Français'], 'Genre des noms'),
        ('Comment s\'écrit "maison" au pluriel?', 'maisons', lessons['grammaire'], categories['Français'], 'Pluriel des noms'),

        # Sciences
        ('Quelle planète est la plus proche du Soleil?', 'Mercure', lessons['systeme_solaire'], categories['Sciences'], 'Système solaire'),
        ('Quel animal pond des œufs?', 'oiseau', lessons['animaux'], categories['Sciences'], 'Classification animale'),
        ('Quel organe permet aux plantes de respirer?', 'feuilles', lessons['plantes'], categories['Sciences'], 'Parties des plantes'),
    ]

    exercises = []
    for question, answer, lesson, category, description in exercises_data:
        exercise, created = Exercise.objects.get_or_create(
            question=question,
            lesson=lesson,
            defaults={
                'title': question[:50],  # Utiliser le début de la question comme titre
                'description': description,
                'correct_answer': answer,
                'category': category,
                'type': 'multiple_choice',
                'difficulty': 2,  # Facile
                'points': 10,
                'options': ['A', 'B', 'C', 'D']  # Options d'exemple
            }
        )
        exercises.append(exercise)
        if created:
            print(f"  [OK] {question[:30]}...")

    # Créer un utilisateur test
    print("\nCréation d'un utilisateur test...")
    user, created = User.objects.get_or_create(
        username='test_student',
        defaults={
            'email': 'test@student.com',
            'first_name': 'Test',
            'last_name': 'Student'
        }
    )
    if created:
        user.set_password('password123')
        user.save()
        print("  [OK] Utilisateur test créé")

    # Créer quelques tentatives d'exercices
    print("\nCréation de tentatives d'exercices...")
    for i, exercise in enumerate(exercises[:5]):  # 5 premières tentatives
        attempt, created = ExerciseAttempt.objects.get_or_create(
            student=user,
            exercise=exercise,
            defaults={
                'student_answer': exercise.correct_answer,  # Bonne réponse
                'is_correct': True,
                'score': exercise.points,
                'time_spent_seconds': 60 + i * 30,  # Temps variable
                'status': 'submitted'
            }
        )
        if created:
            print(f"  [OK] Tentative réussie pour {exercise.question[:20]}...")

    # Quelques tentatives avec erreurs
    error_exercises = exercises[5:8]  # 3 exercices pour créer des erreurs
    for i, exercise in enumerate(error_exercises):
        attempt, created = ExerciseAttempt.objects.get_or_create(
            student=user,
            exercise=exercise,
            defaults={
                'student_answer': 'mauvaise_reponse',  # Mauvaise réponse
                'is_correct': False,
                'score': 0,
                'time_spent_seconds': 120 + i * 45,
                'status': 'submitted'
            }
        )
        if created:
            print(f"  [OK] Tentative échouée pour {exercise.question[:20]}...")

    print("\n" + "=" * 40)
    print("DONNEES D'EXEMPLE CREEES AVEC SUCCES!")
    print(f"Cours: {Course.objects.count()}")
    print(f"Leçons: {Lesson.objects.count()}")
    print(f"Exercices: {Exercise.objects.count()}")
    print(f"Tentatives: {ExerciseAttempt.objects.count()}")
    print("=" * 40)

if __name__ == "__main__":
    create_sample_data()
