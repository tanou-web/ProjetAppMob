"""
Django management command to import courses from Faso Education website
"""

from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify
import json
import logging
from apps.courses.models import Course, Subject, Lesson
from apps.exercises.models import Exercise, ExerciseCategory
from apps.users.models import User

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Import courses from fasoeducation.bf scraper'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='faso_courses.json',
            help='Path to JSON file with scraped courses'
        )
        parser.add_argument(
            '--level',
            type=str,
            help='Import only specific level (e.g., primaire_cp)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be imported without saving'
        )

    def handle(self, *args, **options):
        file_path = options['file']
        level_filter = options.get('level')
        dry_run = options['dry_run']

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except FileNotFoundError:
            raise CommandError(f'File not found: {file_path}')
        except json.JSONDecodeError:
            raise CommandError(f'Invalid JSON file: {file_path}')

        # Get or create default user (admin)
        admin_user, _ = User.objects.get_or_create(
            email='admin@intelligenttutor.bf',
            defaults={'first_name': 'Admin', 'last_name': 'System', 'is_staff': True}
        )

        # Create subject mappings
        subject_mapping = {
            'français': 'french',
            'math': 'math',
            'mathématiques': 'math',
            'english': 'english',
            'anglais': 'english',
            'science': 'science',
            'sciences': 'science',
            'histoire': 'history',
            'histoire-géographie': 'history',
            'géographie': 'geography',
            'geographie': 'geography',
            'art': 'art',
            'arts plastiques': 'art',
            'musique': 'music',
            'pe': 'pe',
            'éducation physique': 'pe',
        }

        # Create subject instances
        subjects = {}
        for subject_code in Subject.SUBJECT_CHOICES:
            code = subject_code[0]
            subject, _ = Subject.objects.get_or_create(
                code=code,
                defaults={'name': subject_code[1]}
            )
            subjects[code] = subject

        # Level mapping
        level_mapping = {
            'primaire_cp': 'primary_1',
            'primaire_ce1': 'primary_2',
            'primaire_ce2': 'primary_3',
            'primaire_cm1': 'primary_4',
            'primaire_cm2': 'primary_5',
            'postprimaire_6e': 'secondary_1',
            'postprimaire_5e': 'secondary_2',
            'postprimaire_4e': 'secondary_3',
            'postprimaire_3e': 'secondary_4',
            'secondaire_2nde': 'secondary_1',
            'secondaire_1ere': 'secondary_2',
            'secondaire_tle': 'secondary_4',
        }

        # Import courses
        total_imported = 0
        total_failed = 0

        self.stdout.write(self.style.SUCCESS('🚀 Starting course import...'))

        for level_key, courses in data.items():
            if level_filter and level_key != level_filter:
                continue

            level_display = level_mapping.get(level_key, 'unknown')
            self.stdout.write(f"\n📚 Processing {level_key} ({len(courses)} courses)...")

            for idx, course_data in enumerate(courses, 1):
                try:
                    title = course_data.get('title', f'Course {idx}')
                    
                    # Extract subject from title
                    subject_code = 'math'  # default
                    for subject_name, code in subject_mapping.items():
                        if subject_name.lower() in title.lower():
                            subject_code = code
                            break

                    if dry_run:
                        self.stdout.write(f"  - Would create: {title} ({subject_code})")
                    else:
                        course, created = Course.objects.get_or_create(
                            title=title,
                            level=level_display,
                            defaults={
                                'description': f'Course from {course_data.get("source", "faso education")}',
                                'subject': subjects[subject_code],
                                'created_by': admin_user,
                                'status': 'published',
                            }
                        )

                        if created:
                            self.stdout.write(
                                self.style.SUCCESS(f"  ✅ Created: {title}")
                            )
                            total_imported += 1
                        else:
                            self.stdout.write(f"  ⏭️  Already exists: {title}")

                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f"  ❌ Error importing '{title}': {str(e)}")
                    )
                    logger.exception(f"Error importing course: {e}")
                    total_failed += 1

        # Summary
        self.stdout.write("\n" + "="*60)
        if dry_run:
            self.stdout.write(
                self.style.WARNING('🔍 DRY RUN - No changes saved')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f"✅ Import complete!")
            )
        self.stdout.write(f"📊 Total imported: {total_imported}")
        self.stdout.write(f"⚠️  Total failed: {total_failed}")
        self.stdout.write("="*60)


def create_sample_exercises():
    """Helper to create sample exercises for imported courses"""
    categories = [
        'Compréhension',
        'Application',
        'Analyse',
        'Synthèse',
        'Évaluation'
    ]

    for cat_name in categories:
        ExerciseCategory.objects.get_or_create(
            name=cat_name,
            defaults={'description': f'Exercices de {cat_name}'}
        )
