import json
import os
from django.core.management.base import BaseCommand
from apps.courses.models import Lesson, Course
from apps.exercises.models import Exercise, ExerciseCategory

class Command(BaseCommand):
    help = 'Import AI-generated exercises from JSON'

    def handle(self, *args, **options):
        file_path = 'ai_generated_exercises.json'
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File {file_path} not found'))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            exercises_data = json.load(f)

        # Ensure categories exist
        categories = {}
        cat_names = {
            'math': 'Mathématiques',
            'french': 'Français',
            'science': 'Sciences',
            'history': 'Histoire',
            'geography': 'Géographie'
        }
        
        for code, name in cat_names.items():
            cat, _ = ExerciseCategory.objects.get_or_create(name=name)
            categories[code] = cat

        total_created = 0
        
        for data in exercises_data:
            subject_code = data['subject']
            level_tag = data['level'] # 'primary' or 'secondary'
            keywords = data['keywords']
            
            # Find a suitable lesson
            # 1. Try to find a lesson whose title or course title matches keywords
            suitable_lesson = None
            
            # Filter lessons by level type
            potential_lessons = Lesson.objects.all()
            if level_tag == 'primary':
                potential_lessons = potential_lessons.filter(course__level__startswith='primary')
            else:
                potential_lessons = potential_lessons.filter(course__level__startswith='secondary')
            
            # Filter by subject
            potential_lessons = potential_lessons.filter(course__subject__code=subject_code)
            
            # Match keywords
            for lesson in potential_lessons:
                if any(kw.lower() in lesson.title.lower() or kw.lower() in lesson.course.title.lower() for kw in keywords):
                    suitable_lesson = lesson
                    break
            
            # Fallback to any lesson of that subject/level if no keyword match
            if not suitable_lesson:
                suitable_lesson = potential_lessons.first()
            
            if suitable_lesson:
                exercise, created = Exercise.objects.get_or_create(
                    question=data['question'],
                    lesson=suitable_lesson,
                    defaults={
                        'title': data['question'][:50],
                        'description': data.get('description', 'Exercice d\'entraînement'),
                        'type': 'multiple_choice',
                        'difficulty': data['difficulty'],
                        'points': 10,
                        'correct_answer': data['correct_answer'],
                        'explanation': data['explanation'],
                        'options': data['options'],
                        'category': categories.get(subject_code)
                    }
                )
                if created:
                    total_created += 1
                    self.stdout.write(self.style.SUCCESS(f'✅ Created exercise for: {suitable_lesson.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'⚠️ No suitable lesson found for: {data["question"][:30]}'))

        self.stdout.write(self.style.SUCCESS(f'Done! Created {total_created} exercises.'))
