import os
import django
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import logging
import re
import time

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Lesson, Course, Subject

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Mapping from DB level key to Site Section URL
LEVEL_MAP = {
    'primary_ce1': 'https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-ce1.html',
    'primary_ce2': 'https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-ce2.html',
    'primary_cm1': 'https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-cm1.html',
    'primary_cm2': 'https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-cm2.html',
    'secondary_6eme': 'https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-6e.html',
    'secondary_5eme': 'https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-5e.html',
    'secondary_4eme': 'https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-4e.html',
    'secondary_3eme': 'https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-troisieme.html',
    'lycee_2nde': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-seconde.html',
    'lycee_1ere': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-premiere.html',
    'lycee_tles': 'https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale.html',
}

def get_soup(url, session):
    try:
        r = session.get(url, timeout=15)
        r.raise_for_status()
        return BeautifulSoup(r.content, 'html.parser')
    except Exception as e:
        logger.error(f"Error fetching {url}: {e}")
        return None

def extract_subject_links(level_url, session):
    soup = get_soup(level_url, session)
    if not soup: return []
    
    links = []
    
    # 1. Look for SP Page Builder containers (used in most levels)
    # Each subject is usually a column or an addon wrapper
    containers = soup.select('.sppb-addon-wrapper, .sppb-column')
    for container in containers:
        title_el = container.select_one('.sppb-addon-title, h3, h4, .sppb-text-center')
        button_el = container.select_one('a.sppb-btn, a.sppb-btn-custom, a.btn-primary, a.btn-success')
        
        if title_el and button_el:
            text = title_el.get_text(strip=True)
            href = button_el.get('href')
            if href and text and not any(x in text.lower() for x in ['accueil', 'retour']):
                links.append((text, urljoin(level_url, href)))
    
    # 2. Fallback for Terminale or other formats (direct buttons)
    if not links:
        subject_buttons = soup.select('.sppb-btn-custom, a.btn-primary, a.btn-success')
        for btn in subject_buttons:
            href = btn.get('href')
            text = btn.get_text(strip=True)
            if href and text and not any(x in text.lower() for x in ['accueil', 'retour']):
                 links.append((text, urljoin(level_url, href)))
    
    # 3. Last resort: look for a pattern in links
    if not links:
        for a in soup.find_all('a', href=re.compile(r'/cours-.*\.html|/.*-terminale\.html')):
            text = a.get_text(strip=True)
            if len(text) > 3:
                links.append((text, urljoin(level_url, a['href'])))
                
    # Filter out duplicates and "Accéder" junk if it survives
    unique_links = {}
    for text, url in links:
        if text.lower() == 'accéder' or len(text) < 2: continue
        if url not in unique_links:
            unique_links[url] = text
            
    return [(v, k) for k, v in unique_links.items()]

def get_subject_code(name):
    name_map = {
        'mathématiques': 'math',
        'français': 'french',
        'anglais': 'english',
        'sciences': 'science',
        'svt': 'science',
        'physique-chimie': 'science',
        'sp': 'science',
        'histoire': 'history',
        'géographie': 'geography',
        'histoire-géographie': 'history',
        'philosophie': 'other', # Fallback
        'allemand': 'other',
    }
    cleaned = name.lower()
    for k, v in name_map.items():
        if k in cleaned:
            return v
    return 'other'

def refetch_level(level_key, level_url, session):
    logger.info(f"Processing Level: {level_key} ({level_url})")
    subjects = extract_subject_links(level_url, session)
    
    if not subjects:
        logger.warning(f"  No subjects found for {level_key}")
        return

    for subject_name, subject_url in subjects:
        # Clean subject name
        subj_clean = re.sub(r'\s+(Tle|1ère|2nde|3ème|4ème|5ème|6ème|CP1|CP2|CE1|CE2|CM1|CM2)', '', subject_name, flags=re.IGNORECASE)
        
        logger.info(f"  - Subject: {subj_clean} ({subject_url})")
        
        code = get_subject_code(subj_clean)
        # Handle unique constraint on code by checking if it already exists
        subject = Subject.objects.filter(name=subj_clean).first()
        if not subject:
            # Check if code is taken by another name
            base_code = code
            i = 1
            while Subject.objects.filter(code=code).exists():
                code = f"{base_code}_{i}"
                i += 1
            subject = Subject.objects.create(name=subj_clean, code=code)
        
        course, _ = Course.objects.get_or_create(
            title=f"{subj_clean} - {level_key}",
            subject=subject,
            level=level_key,
            defaults={'description': f'Cours de {subj_clean} pour {level_key}'}
        )

        soup = get_soup(subject_url, session)
        if not soup: continue
        
        # Using refined selectors from Terminale success
        lesson_items = soup.select('.liste-cours li a, .tab-content .tab-pane a')
        lesson_count = 0
        
        for link in lesson_items:
            href = link.get('href')
            if not href: continue
            
            title = link.get_text(strip=True)
            title = re.sub(r'^\d+\.\s*', '', title) # Remove numbering
            
            full_url = urljoin(subject_url, href)
            
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
        
        logger.info(f"    + Found {lesson_count} lessons")
        time.sleep(0.5)

def main():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    })
    
    for level_key, level_url in LEVEL_MAP.items():
        refetch_level(level_key, level_url, session)

if __name__ == "__main__":
    main()
