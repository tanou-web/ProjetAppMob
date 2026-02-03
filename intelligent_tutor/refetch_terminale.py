import os
import django
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import logging

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Lesson, Course, Subject

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

TERMINALE_SUBJECTS = {
    'Français': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/francais-terminale.html',
    'Anglais': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/anglais-terminale.html',
    'Allemand': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/allemand-terminale.html',
    'Philosophie': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/philosophie-terminale.html',
    'SVT': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/svt-terminale.html',
    'Physique-Chimie': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/sp-terminale.html',
    'Mathématiques': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/maths-terminale.html',
    'Histoire-Géographie': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/hg-terminale.html',
}

def get_soup(url, session):
    try:
        r = session.get(url, timeout=10)
        r.raise_for_status()
        return BeautifulSoup(r.content, 'html.parser')
    except Exception as e:
        logger.error(f"Error fetching {url}: {e}")
        return None

def refetch_all():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    })
    
    for subject_name, url in TERMINALE_SUBJECTS.items():
        logger.info(f"Refetching lessons for {subject_name}...")
        
        # Get or create subject
        subject, _ = Subject.objects.get_or_create(name=subject_name)
        
        # Get or create course
        course, created = Course.objects.get_or_create(
            title=f"{subject_name} - Terminale",
            subject=subject,
            level='lycee_tles',
            defaults={'description': f'Cours de {subject_name} pour Terminale'}
        )
        
        if not created:
            # Optionally clear existing lessons if they are incorrect
            # But let's be careful. If they have "Source FASO:", we can keep/update them.
            # For Terminale, since we know they are currently placeholders, let's clear them.
            if 'Limites' in course.lessons.first().title if course.lessons.exists() else False:
                 logger.info(f"  Clearing placeholder lessons for {course.title}")
                 course.lessons.all().delete()
        
        soup = get_soup(url, session)
        if not soup: continue
        
        # Use confirmed selectors to find actual lesson links (handles standard list and SP tabs)
        lesson_items = soup.select('.liste-cours li a, .tab-content .tab-pane a')
        lesson_count = 0
        
        for link in lesson_items:
            href = link.get('href')
            if not href: continue
            
            title = link.get_text(strip=True)
            # Remove the leading number (e.g., "1. ")
            import re
            title = re.sub(r'^\d+\.\s*', '', title)
            
            full_url = urljoin(url, href)
            
            Lesson.objects.get_or_create(
                course=course,
                title=title[:255],
                defaults={
                    'description': title,
                    'content': f"Source FASO: {full_url}",
                    'order': lesson_count + 1,
                    'duration_minutes': 60
                }
            )
            lesson_count += 1
            logger.info(f"  + Added lesson: {title}")
        
        logger.info(f"  Total lessons found: {lesson_count}")

if __name__ == "__main__":
    refetch_all()
