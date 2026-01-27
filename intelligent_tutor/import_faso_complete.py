#!/usr/bin/env python
"""
Script d'import complet et détaillé de TOUTES les leçons FASO
"""
import os
import sys
import django
import json
from collections import defaultdict

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Subject, Course, Lesson


def map_level(faso_level):
    """Mappe les niveaux FASO aux niveaux Django"""
    mapping = {
        'primaire_cp': 'primary_cp1',
        'primaire_ce1': 'primary_ce1',
        'primaire_ce2': 'primary_ce2',
        'primaire_cm1': 'primary_cm1',
        'primaire_cm2': 'primary_cm2',
        'postprimaire_6e': 'secondary_6eme',
        'postprimaire_5e': 'secondary_5eme',
        'postprimaire_4e': 'secondary_4eme',
        'postprimaire_3e': 'secondary_3eme',
        'secondaire_2nde': 'secondary_2nde',
        'secondaire_1ere': 'secondary_1ere',
        'secondaire_tle': 'secondary_tle',
    }
    return mapping.get(faso_level, faso_level)


def extract_subject(title):
    """Extrait la matière du titre"""
    title_lower = title.lower()
    
    if 'mathématiques' in title_lower or 'maths' in title_lower:
        return 'Mathématiques'
    elif 'français' in title_lower or 'lecture' in title_lower or 'grammaire' in title_lower:
        return 'Français'
    elif 'anglais' in title_lower:
        return 'Anglais'
    else:
        return 'Français'


def get_subject(name):
    """Récupère ou crée une matière"""
    subject, _ = Subject.objects.get_or_create(
        name=name,
        defaults={'description': f'Cours de {name}'}
    )
    return subject


def main():
    print("="*80)
    print("🚀 IMPORT COMPLET DE FASO - TOUTES LES 264 LEÇONS")
    print("="*80)
    
    with open('faso_courses.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    stats = {'courses': 0, 'lessons': 0}
    
    for level_key, lessons_list in data.items():
        if not lessons_list:
            continue
        
        django_level = map_level(level_key)
        print(f"\n📚 {level_key} ({len(lessons_list)} leçons)")
        
        by_subject = defaultdict(list)
        for lesson in lessons_list:
            subject_name = extract_subject(lesson['title'])
            by_subject[subject_name].append(lesson)
        
        for subject_name, subject_lessons in by_subject.items():
            subject = get_subject(subject_name)
            
            course, created = Course.objects.get_or_create(
                title=f"{subject_name} - {level_key}",
                subject=subject,
                level=django_level,
                defaults={
                    'description': f"Cours FASO de {subject_name}",
                    'duration_hours': len(subject_lessons) * 0.5,
                    'difficulty_level': 2,
                    'status': 'published'
                }
            )
            
            if created:
                stats['courses'] += 1
                print(f"  ✅ {subject_name}: {len(subject_lessons)} leçons")
            
            for idx, lesson_data in enumerate(subject_lessons, 1):
                _, created = Lesson.objects.get_or_create(
                    course=course,
                    title=lesson_data['title'][:255],
                    defaults={
                        'description': lesson_data['title'],
                        'content': f"Source FASO: {lesson_data.get('url', 'N/A')}",
                        'order': idx,
                        'duration_minutes': 30
                    }
                )
                if created:
                    stats['lessons'] += 1
    
    print(f"\n" + "="*80)
    print("✅ IMPORT TERMINÉ")
    print(f"   Cours créés: {stats['courses']}")
    print(f"   Leçons créées: {stats['lessons']}")
    print(f"   Total leçons en base: {Lesson.objects.count()}")
    print("="*80)


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
