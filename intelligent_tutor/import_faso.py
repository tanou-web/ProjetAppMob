#!/usr/bin/env python
"""
Script d'import des cours FASO depuis faso_courses.json
"""
import os
import sys
import django
import json
from collections import defaultdict

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Subject, Course, Lesson
from django.utils.text import slugify


def extract_subject_from_title(title):
    """Extrait la matière du titre du cours"""
    title_lower = title.lower()
    
    if 'mathématiques' in title_lower or 'maths' in title_lower:
        return 'Mathématiques'
    elif 'français' in title_lower or 'lecture' in title_lower or 'expression orale' in title_lower or 'grammaire' in title_lower:
        return 'Français'
    elif 'sciences' in title_lower or 'histoire' in title_lower or 'géographie' in title_lower or 'découverte du monde' in title_lower:
        return 'Sciences'
    elif 'anglais' in title_lower:
        return 'Anglais'
    elif 'histoire' in title_lower:
        return 'Histoire'
    elif 'géographie' in title_lower:
        return 'Géographie'
    else:
        return 'Français'  # Default


def get_or_create_subject(subject_name):
    """Récupère ou crée une matière"""
    subject, created = Subject.objects.get_or_create(
        name=subject_name,
        defaults={
            'description': f'Cours de {subject_name}',
            'code': slugify(subject_name)
        }
    )
    return subject


def import_faso_courses():
    """Importe les cours depuis le fichier FASO JSON"""
    
    print("="*70)
    print("🚀 IMPORT DES COURS FASO")
    print("="*70)
    
    # Charge le JSON
    with open('faso_courses.json', 'r', encoding='utf-8') as f:
        faso_data = json.load(f)
    
    # Counters
    stats = {
        'subjects': 0,
        'courses': 0,
        'lessons': 0,
        'skipped': 0
    }
    
    # Organise les cours par niveau et matière
    courses_by_level = defaultdict(lambda: defaultdict(list))
    
    for level, lessons in faso_data.items():
        for lesson in lessons:
            subject = extract_subject_from_title(lesson['title'])
            courses_by_level[level][subject].append(lesson)
    
    # Importe les données
    for level, subjects_dict in courses_by_level.items():
        print(f"\n📚 Niveau: {level}")
        
        for subject_name, lessons_list in subjects_dict.items():
            print(f"  📖 Matière: {subject_name} ({len(lessons_list)} leçons)")
            
            # Crée ou récupère la matière
            subject = get_or_create_subject(subject_name)
            if subject.pk:
                stats['subjects'] += 1 if not Subject.objects.filter(pk=subject.pk).exists() else 0
            
            # Crée les cours groupés par matière et niveau
            course_key = f"{subject_name} - {level}"
            
            course, created = Course.objects.get_or_create(
                title=course_key,
                subject=subject,
                level=level,
                defaults={
                    'description': f"Cours de {subject_name} pour {level}",
                    'duration_hours': len(lessons_list) * 0.5,
                    'difficulty_level': 2,
                    'status': 'published'
                }
            )
            
            if created:
                stats['courses'] += 1
                print(f"    ✅ Cours créé: {course_key}")
            else:
                print(f"    ℹ️  Cours existant: {course_key}")
            
            # Crée les leçons
            for idx, lesson_data in enumerate(lessons_list, 1):
                lesson_key = f"{lesson_data['title']}"
                
                lesson, created = Lesson.objects.get_or_create(
                    course=course,
                    title=lesson_data['title'],
                    defaults={
                        'description': lesson_data.get('description', lesson_data['title']),
                        'content': f"Source: {lesson_data.get('source', 'FASO')}\nURL: {lesson_data.get('url', '')}",
                        'order': idx,
                        'duration_minutes': 30
                    }
                )
                
                if created:
                    stats['lessons'] += 1
                else:
                    stats['skipped'] += 1
    
    # Affiche les statistiques
    print(f"\n" + "="*70)
    print("✅ IMPORT TERMINÉ")
    print("="*70)
    print(f"📊 Statistiques:")
    print(f"   Matières créées: {stats['subjects']}")
    print(f"   Cours créés: {stats['courses']}")
    print(f"   Leçons créées: {stats['lessons']}")
    print(f"   Leçons existantes: {stats['skipped']}")
    print("="*70)


if __name__ == '__main__':
    try:
        import_faso_courses()
    except FileNotFoundError:
        print("❌ Erreur: fichier faso_courses.json non trouvé")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Erreur lors de l'import: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
