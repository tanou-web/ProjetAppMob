import os
import django
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.users.models import User
from apps.courses.models import Course, CourseEnrollment

# Check the user most likely logged in (e.g. last active or by email if known)
# We'll just check the last one for now as a heuristic.
u = User.objects.last()

if u:
    print(f"--- User: {u.email} (ID: {u.id}) ---")
    print(f"Level: {u.level}")
    
    # Check all enrollments
    all_enrollments = CourseEnrollment.objects.filter(student=u)
    print(f"Total Enrollments in DB: {all_enrollments.count()}")
    
    for e in all_enrollments:
        print(f" - {e.course.title} (Status: {e.status}) [Course ID: {e.course.id}]")
        
    # Check active enrollments specifically
    active_count = CourseEnrollment.objects.filter(student=u, status='enrolled').count()
    print(f"Active Enrollments: {active_count}")

else:
    print("No users found in database.")
