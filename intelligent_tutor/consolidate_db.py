import os
import django
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Lesson, Course, Subject

def consolidate_subjects():
    print("Consolidating Subjects...")
    # Map common variations to base names
    name_map = {
        'mathématiques': 'Mathématiques',
        'maths': 'Mathématiques',
        'arithmétique': 'Mathématiques',
        'géométrie': 'Mathématiques',
        'français': 'Français',
        'grammaire': 'Français',
        'conjugaison': 'Français',
        'orthographe': 'Français',
        'lecture': 'Français',
        'expression orale': 'Français',
        'anglais': 'Anglais',
        'sciences physiques': 'Physique-Chimie',
        'physique-chimie': 'Physique-Chimie',
        'svt': 'SVT',
        'sciences': 'SVT',
        'histoire': 'Histoire-Géographie',
        'géographie': 'Histoire-Géographie',
        'histoire-géographie': 'Histoire-Géographie',
        'philosophie': 'Philosophie',
        'allemand': 'Allemand',
    }
    
    # Standard subjects with their codes
    standard_subjects = {
        'Mathématiques': 'math',
        'Français': 'french',
        'Anglais': 'english',
        'Physique-Chimie': 'science',
        'SVT': 'science',
        'Histoire-Géographie': 'history',
        'Philosophie': 'other',
        'Allemand': 'other',
        'TIC': 'other',
    }

    # Ensure standard subjects exist with correct codes
    for name, code in standard_subjects.items():
        Subject.objects.get_or_create(name=name, defaults={'code': code})

    all_subjects = list(Subject.objects.all())
    for subject in all_subjects:
        if subject.name in standard_subjects:
            continue
            
        # Clean name: remove level suffixes like "6e", "1re", "Terminale"
        clean_name = re.sub(r'\s+(\d+re|\d+de|\d+e|Terminale|Tle|1ère|2nde|3ème|4ème|5ème|6ème|CP1|CP2|CE1|CE2|CM1|CM2)', '', subject.name, flags=re.IGNORECASE).lower()
        
        target_name = None
        for key, val in name_map.items():
            if key in clean_name:
                target_name = val
                break
        
        if target_name:
            target_subject = Subject.objects.filter(name=target_name).first()
            if target_subject and target_subject.id != subject.id:
                print(f"  Mapping {subject.name} -> {target_name}")
                # Move courses
                Course.objects.filter(subject=subject).update(subject=target_subject)
                # Delete old subject if no courses left
                if not subject.courses.exists():
                    subject.delete()
        else:
            print(f"  Unknown subject: {subject.name}")

def consolidate_courses():
    print("Consolidating Courses...")
    valid_levels = [
        'primary_cp1', 'primary_cp2', 'primary_ce1', 'primary_ce2', 'primary_cm1', 'primary_cm2',
        'secondary_6eme', 'secondary_5eme', 'secondary_4eme', 'secondary_3eme',
        'lycee_2nde', 'lycee_1ere', 'lycee_tles'
    ]
    
    # Map old/incorrect level keys
    level_map = {
        'secondary_tle': 'lycee_tles',
        'Terminale': 'lycee_tles',
    }

    # First, fix level keys
    for old, new in level_map.items():
        Course.objects.filter(level=old).update(level=new)

    # Delete courses with invalid levels
    invalid = Course.objects.exclude(level__in=valid_levels)
    if invalid.exists():
        print(f"  Deleting {invalid.count()} courses with invalid levels")
        invalid.delete()

    # Merge duplicate courses (same subject, same level)
    for level in valid_levels:
        subjects = Subject.objects.all()
        for subject in subjects:
            courses = Course.objects.filter(level=level, subject=subject).order_by('-id')
            if courses.count() > 1:
                # Keep the one with most lessons, or the latest
                main_course = None
                max_lessons = -1
                for c in courses:
                    l_count = c.lessons.count()
                    if l_count > max_lessons:
                        max_lessons = l_count
                        main_course = c
                
                print(f"  Merging courses for {subject.name} - {level} into {main_course.id}")
                for c in courses:
                    if c.id != main_course.id:
                        # Move lessons
                        # Update description if empty
                        if not main_course.description and c.description:
                            main_course.description = c.description
                            main_course.save()
                        
                        # Move lessons: handle title duplicates?
                        for lesson in c.lessons.all():
                            # If lesson with same title exists, delete this one
                            if main_course.lessons.filter(title=lesson.title).exists():
                                lesson.delete()
                            else:
                                lesson.course = main_course
                                lesson.save()
                        c.delete()

def main():
    consolidate_subjects()
    consolidate_courses()
    # Final cleanup of empty subjects
    for s in Subject.objects.all():
        if not s.courses.exists():
            print(f"Deleting unused subject: {s.name}")
            s.delete()
    
    print("Consolidation complete.")

if __name__ == "__main__":
    main()
