import sys
import os
import django
import requests
from bs4 import BeautifulSoup
import logging
from pypdf import PdfReader
from io import BytesIO
import re
import time
from urllib.parse import urljoin

# Setup Django
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Lesson, Course, Subject

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

LEVEL_MAPPING = {
    "Fiches API CP1": "primary_cp1",
    "Fiches API CP2": "primary_cp2",
    "Fiches API CE1": "primary_ce1",
    "Fiches API CE2": "primary_ce2",
    "Fiches API CM1": "primary_cm1",
    "Fiches API CM2": "primary_cm2",
}

SUBJECT_KEYWORDS = {
    'Français': ['lecture', 'expression orale', 'écriture', 'grammaire', 'conjugaison', 'orthographe', 'vocabulaire', 'français'],
    'Mathématiques': ['arithmétique', 'géométrie', 'système métrique', 'calcul', 'maths', 'mathématiques'],
    'Eveil': ['histoire', 'géographie', 'observation', 'sciences', 'tic', 'vivre ensemble', 'ghm', 'hygiène'],
}

SUBJECT_TO_CODE = {
    'Français': 'french',
    'Mathématiques': 'math',
    'Eveil': 'science',
    'Général': 'pe',
}

class TeacherResourcesScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
        })

    def extract_pdf_text(self, url):
        try:
            logger.info(f"    📄 Extracting PDF: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            with BytesIO(response.content) as f:
                reader = PdfReader(f)
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text
        except Exception as e:
            logger.error(f"    ❌ PDF Extraction failed for {url}: {e}")
            return None

    def get_subject_info(self, title):
        title_lower = title.lower()
        for subject_name, keywords in SUBJECT_KEYWORDS.items():
            if any(kw in title_lower for kw in keywords):
                return subject_name, SUBJECT_TO_CODE[subject_name]
        return "Général", SUBJECT_TO_CODE['Général']

    def save_lesson(self, title, content, pdf_url, level, category):
        subject_name, subject_code = self.get_subject_info(title)
        
        # Ensure subject exists
        subject = Subject.objects.filter(code=subject_code).first()
        if not subject:
            subject, _ = Subject.objects.get_or_create(name=subject_name, defaults={'code': subject_code})
        
        # Ensure course exists
        course_title = f"{category} - {subject_name}"
        if level != "all":
            course_title += f" ({level})"
            
        course, _ = Course.objects.get_or_create(
            title=course_title,
            subject=subject,
            level=level if level != "all" else "primary_cm2", # Default level if general
            defaults={'status': 'published', 'description': f'Ressources enseignants pour {category}'}
        )
        
        # Create lesson if not exists
        full_title = f"{title} (Ressource Enseignant)"
        if not Lesson.objects.filter(title=full_title, course=course).exists():
            Lesson.objects.create(
                course=course,
                title=full_title,
                description=f"Extrait de ressource pédagogique : {title}",
                content=f"<div class='teacher-resource'>{content}</div>\n<hr/><p>Source: <a href='{pdf_url}'>{pdf_url}</a></p>"
            )
            logger.info(f"    ✅ Saved: {full_title}")
            return True
        return False

    def scrape_fiches_api(self):
        url = "https://fasoeducation.bf/espace-enseignants/fiches-aide-preparation.html"
        logger.info(f"🚀 Scraping Fiches API: {url}")
        response = self.session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        headers = soup.select('button.accordion-header')
        for header in headers:
            title_el = header.select_one('span') or header
            acc_title = title_el.get_text(strip=True)
            level = next((lvl for key, lvl in LEVEL_MAPPING.items() if key in acc_title), None)
            
            if not level: continue
            
            logger.info(f"  📂 category: {acc_title}")
            content_div = header.find_next_sibling('div', class_='accordion-content') or header.find_next_sibling('div')
            if not content_div: continue
            
            links = content_div.find_all('a', href=re.compile(r'\.pdf$'))
            for link in links:
                parent_row = link.find_parent('tr')
                title = parent_row.find_all('td')[0].get_text(strip=True) if parent_row and len(parent_row.find_all('td')) > 0 else link.get_text(strip=True)
                if not title or title.lower() in ["télécharger", "visualiser"]:
                    title = link.get('title') or link['href'].split('/')[-1]
                
                pdf_url = urljoin(url, link['href'])
                text = self.extract_pdf_text(pdf_url)
                if text and len(text) > 100:
                    self.save_lesson(title, text, pdf_url, level, "Fiches API")
                time.sleep(0.5)

    def scrape_pdf_table(self, url, category, level="all"):
        logger.info(f"🚀 Scraping PDF Table: {url} ({category})")
        response = self.session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for tables with PDF links
        tables = soup.find_all('table')
        for table in tables:
            rows = table.find_all('tr')
            for row in rows:
                pdf_link = row.find('a', href=re.compile(r'\.pdf$'))
                if not pdf_link: continue
                
                cells = row.find_all('td')
                title = cells[0].get_text(strip=True) if len(cells) > 0 else pdf_link.get_text(strip=True)
                if not title or title.lower() in ["télécharger", "visualiser"]:
                    title = pdf_link.get('title') or pdf_link['href'].split('/')[-1]
                
                pdf_url = urljoin(url, pdf_link['href'])
                text = self.extract_pdf_text(pdf_url)
                if text and len(text) > 100:
                    self.save_lesson(title, text, pdf_url, level, category)
                time.sleep(0.5)

    def scrape_radio_emissions(self):
        url = "https://fasoeducation.bf/espace-enseignants/emissions-radiophoniques.html"
        logger.info(f"🚀 Scraping Radio Emissions: {url}")
        response = self.session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Audio tabs pattern
        audio_blocks = soup.select('.as-audio-wrapper, .audio-player, audio')
        if not audio_blocks:
            # Fallback to tables with audio links
            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    audio_link = row.find('audio') or row.find('source') or row.find('a', href=re.compile(r'\.mp3$'))
                    if not audio_link: continue
                    
                    cells = row.find_all('td')
                    title = cells[0].get_text(strip=True) if len(cells) > 0 else "Emission Radio"
                    mp3_url = urljoin(url, audio_link.get('src') or audio_link.get('href'))
                    
                    # Store as a lesson with the link
                    content = f"<p>Lien vers l'émission : <audio controls src='{mp3_url}'>Ecouter</audio></p>"
                    self.save_lesson(title, content, mp3_url, "primary_cm2", "Emissions Radiophoniques")

    def run_all(self):
        # 1. Fiches API
        self.scrape_fiches_api()
        # 2. Ressources GHM
        self.scrape_pdf_table("https://fasoeducation.bf/espace-enseignants/ressources-enseignants/ressources-ghm.html", "Ressources GHM")
        # 3. Supports PAQER-CEC
        self.scrape_pdf_table("https://fasoeducation.bf/espace-enseignants/ressources-enseignants/supports-paqercec.html", "Supports PAQER-CEC")
        # 4. Radio
        self.scrape_radio_emissions()

if __name__ == "__main__":
    scraper = TeacherResourcesScraper()
    scraper.run_all()
