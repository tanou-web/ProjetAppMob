import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.courses.models import Lesson
from django.db.models import Count
print(f'Total Terminale Lessons: {Lesson.objects.filter(course__level="lycee_tles").count()}')
courses = Lesson.objects.filter(course__level="lycee_tles").values('course__title').annotate(count=Count('id'))
for c in courses:
    print(f" - {c['course__title']}: {c['count']}")
