import os
import django
import sys

# Configuration Django
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Course, Lesson
from apps.exercises.models import Exercise, ExerciseCategory

def fix_empty_courses():
    print("Fixing courses without lessons...")
    courses = Course.objects.all()
    count = 0
    
    # Get or create a category for exercises
    category, _ = ExerciseCategory.objects.get_or_create(name='Général')

    for course in courses:
        if course.lessons.count() == 0:
            print(f"  - Adding lessons to: {course.title}")
            # Add 2 lessons
            l1 = Lesson.objects.create(
                course=course,
                title=f"Introduction à {course.title}",
                description=f"Les bases fondamentales de {course.title}",
                content=f"<p>Bienvenue dans ce cours sur {course.title}. Nous allons voir ensemble les concepts clés.</p>",
                order=1
            )
            l2 = Lesson.objects.create(
                course=course,
                title=f"Approfondissement : {course.title}",
                description="Aller plus loin dans la compréhension",
                content="<p>Maintenant que vous avez les bases, passons à la pratique.</p>",
                order=2
            )
            
            # Add an exercise to the first lesson
            Exercise.objects.create(
                lesson=l1,
                title="Quiz de découverte",
                description="Vérifiez vos connaissances initiales",
                question=f"Quel est le sujet principal de {course.title}?",
                correct_answer=course.title,
                category=category,
                type='multiple_choice',
                difficulty=1,
                points=10,
                options=[course.title, "Autre chose", "Rien", "Je ne sais pas"]
            )
            count += 1
            
    print(f"\n[OK] {count} cours ont été mis à jour avec des leçons et des exercices.")

if __name__ == "__main__":
    fix_empty_courses()
