import os
import django
import re
import logging

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Lesson

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def reset_all():
    lessons = Lesson.objects.filter(course__level='lycee_tles')
    count = 0
    for l in lessons:
        # Try to extract URL from the enriched footer first
        # Format: <hr/><p><em>Source: <a href='https://...'>https://...</a></em></p>
        match = re.search(r'href=\'([^\'\"]+)\'', l.content)
        url = match.group(1) if match else None
        
        if not url:
            # Fallback to standard Source FASO format
            match = re.search(r'Source FASO:\s*(https?://[^\s<>\"]+|/[^\s<>\"]+)', l.content)
            url = match.group(1) if match else None
            
        if url:
            l.content = f'Source FASO: {url}'
            l.save()
            count += 1
            if count % 10 == 0:
                logger.info(f"  Reset {count} lessons...")
        else:
            logger.warning(f"  Could not find URL for lesson: {l.title}")

    logger.info(f"Done. Reset {count} lessons.")

if __name__ == "__main__":
    reset_all()
