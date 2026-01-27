#!/usr/bin/env python
import os
import django
import sys

# Configuration Django
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Course, Lesson
from apps.exercises.models import Exercise

def check_data():
    print("VERIFICATION DES DONNEES D'ENTRAINEMENT")
    print("=" * 50)

    # Vérifier les cours
    courses_count = Course.objects.count()
    print(f"Cours: {courses_count}")

    # Vérifier les leçons
    lessons_count = Lesson.objects.count()
    print(f"Lecons: {lessons_count}")

    # Vérifier les exercices
    exercises_count = Exercise.objects.count()
    print(f"Exercices: {exercises_count}")

    print("=" * 50)

    if courses_count == 0:
        print("AUCUN COURS TROUVE!")
        print("   -> Importez les cours avec: bash import_faso_courses.sh")
        return False
    else:
        print("DONNEES PRETES POUR L'ENTRAINEMENT!")
        return True

if __name__ == "__main__":
    check_data()
