import os
import django
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys
import time
import logging
import re

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Course, Lesson, Subject
from apps.exercises.models import Exercise, ExerciseCategory

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_URL = "https://fasoeducation.bf"

URL_LEVEL_MAP = {
    # Lycée (Secondaire) - PRIORITIZED
    "https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale.html": "lycee_tles",
    "https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-premiere.html": "lycee_1ere",
    "https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-seconde.html": "lycee_2nde",

    # Primaire
    "https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-ce1.html": "primary_ce1",
    "https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-ce2.html": "primary_ce2",
    "https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-cm1.html": "primary_cm1",
    "https://fasoeducation.bf/espace-eleves/primaire/primaire-classique/cours-cm2.html": "primary_cm2",
    
    # Collège (Post-primaire)
    "https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-6e.html": "secondary_6eme",
    "https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-5e.html": "secondary_5eme",
    "https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-4e.html": "secondary_4eme",
    "https://fasoeducation.bf/espace-eleves/postprimaire/postprimaire-general/cours-troisieme.html": "secondary_3eme",
}

SUBJECT_MAPPING = {
    "mathématiques": "math", "maths": "math",
    "français": "french", "anglais": "english", "allemand": "german",
    "histoire-géographie": "history-geo", "histoire": "history", "géographie": "geography",
    "sciences": "sciences", "svt": "svt", "physique-chimie": "physics-chem", "sciences physiques": "physics-chem",
    "philosophie": "philosophy",
}

class FasoScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.visited_urls = set()

    def get_soup(self, url):
        try:
            time.sleep(0.5) # Be nice
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None

    def get_or_create_subject(self, name):
        name_clean = name.strip()
        lower_name = name_clean.lower()
        code = "other"
        for key, val in SUBJECT_MAPPING.items():
            if key in lower_name:
                code = val
                break
        if code == "other":
            code = lower_name.replace(" ", "_")[:20]
        
        # Check by name first (unique=True)
        subject = Subject.objects.filter(name__iexact=name_clean).first()
        if subject:
            return subject
            
        # Check by code (unique=True)
        subject = Subject.objects.filter(code=code).first()
        if subject:
            return subject

        # Create if neither exists
        subject = Subject.objects.create(
            name=name_clean,
            code=code,
            description=f"Cours de {name_clean}"
        )
        return subject

    def scrape_lesson_content(self, url, course, title, parent_lesson=None):
        if url in self.visited_urls: return
        self.visited_urls.add(url)
        
        lower_title = title.lower()
        is_exercise_page = any(x in url.lower() or x in lower_title for x in ['practuc', 'exercice', 'quiz', 'activite', 'test'])
        
        logger.info(f"      - Scraping {'Exercise' if is_exercise_page else 'Page'}: {title}")
        soup = self.get_soup(url)
        if not soup: return

        # Scenari/Opale selectors
        content_area = soup.select_one('div.scroller') or soup.select_one('div#main') or soup.select_one('article') \
                       or soup.select_one('.module-content') or soup.select_one('.item-page') \
                       or soup.select_one('#content') or soup.select_one('.mainContent')
        if not content_area:
            content_area = soup.body

        # Clean content but keep images and basic formatting
        for tag in content_area(["script", "style", "nav", "footer"]):
            tag.decompose()

        # Fix relative URLs
        for a in content_area.find_all('a', href=True):
            a['href'] = urljoin(url, a['href'])
        for img in content_area.find_all('img', src=True):
            img['src'] = urljoin(url, img['src'])

        html_content = str(content_area)
        text_content = content_area.get_text(separator=' ', strip=True)

        if parent_lesson:
            # APPEND to parent if it's a "grain" or "activity"
            if len(text_content) > 50: # Avoid merging empty wrappers
                parent_lesson.content += f"<hr/><h3>{title}</h3>" + html_content
                parent_lesson.save()
                target_lesson = parent_lesson
        else:
            # CREATE new lesson
            target_lesson, created = Lesson.objects.get_or_create(
                course=course,
                title=title[:255],
                defaults={
                    'content': html_content,
                    'order': course.lessons.count() + 1
                }
            )
            if not created:
                target_lesson.content = html_content
                target_lesson.save()

        # 2. Extract Exercises
        if is_exercise_page:
            Exercise.objects.get_or_create(
                lesson=target_lesson,
                title=title[:255],
                defaults={
                    'question': text_content,
                    'correct_answer': "Voir le contenu interactif ci-dessus.",
                    'type': 'short_answer',
                    'difficulty': 3
                }
            )
        self.extract_exercises(soup, target_lesson)

        # 3. Aggressive Logic: MERGE sub-modules for ENGLISH ONLY
        # This provides "direct visibility" requested by user for English
        is_english = 'anglais' in url.lower() or (course and 'anglais' in course.title.lower())
        
        if is_english:
            # Follow "Commencer" links but merge their results
            start_button = content_area.select_one('a.btn-start') or \
                           content_area.select_one('a.btn-primary') or \
                           content_area.find('a', string=re.compile(r'Commencer', re.I))
            
            if start_button and start_button.get('href'):
                start_url = urljoin(url, start_button['href'])
                if start_url not in self.visited_urls:
                    logger.info(f"        * Merging 'Start' link content (English): {start_url}")
                    self.scrape_lesson_content(start_url, course, f"{title} (Suite)", parent_lesson=target_lesson)

            # 4. Proactive Hunting for Scenari grains (English Only)
            base_dir = url if url.endswith('/') else os.path.dirname(url) + '/'
            common_grains = [
                "activiteapprentissage.html", "activiteeval.html", 
                "module_Conception.html", "Publication_web.html",
                "Introduction.html", "Conclusion.html",
                "ReadingComprehension1.html", "ReadingComprehension2.html", 
                "EssentialMineralsRCTleDC.html"
            ]

            for grain in common_grains:
                grain_url = urljoin(base_dir, grain)
                if grain_url not in self.visited_urls:
                    self.scrape_lesson_content(grain_url, course, f"{title} > Content", parent_lesson=target_lesson)

            # Standard internal navigation links
            module_dir = os.path.dirname(url)
            for link in content_area.find_all('a', href=True):
                href = link['href']
                if href.startswith(module_dir) and href.endswith('.html') and '#' not in href:
                    sub_title = link.get_text(strip=True)
                    if len(sub_title) > 2 and sub_title.lower() not in ['suivant', 'précédent', 'accueil', 'sommaire', 'retour', 'quitter']:
                        if href not in self.visited_urls:
                            self.scrape_lesson_content(href, course, sub_title, parent_lesson=target_lesson)
        else:
            # Standard behavior for non-English modules: follow links normally (create separate lessons)
            # This maintains the original structure for Math, SVT, etc.
            # Original recursion logic here (simplified)
            start_button = content_area.select_one('a.btn-start') or \
                           content_area.select_one('a.btn-primary') or \
                           content_area.find('a', string=re.compile(r'Commencer', re.I))
            
            if start_button and start_button.get('href'):
                start_url = urljoin(url, start_button['href'])
                if start_url not in self.visited_urls:
                    self.scrape_lesson_content(start_url, course, f"{title} > Contenu")

    def extract_exercises(self, soup, lesson):
        # Heuristic for exercises in Scenari
        # Look for blocks that might be questions
        exercise_blocks = soup.select('.practUc') or soup.select('.quiz') or soup.select('.exercise')
        
        for i, block in enumerate(exercise_blocks):
            title = block.select_one('.title') or block.select_one('h2') or block.select_one('h3')
            title_text = title.get_text(strip=True) if title else f"Exercice {i+1}"
            
            question = block.get_text(separator='\n', strip=True)
            
            # Try to find solution/answer
            answer = ""
            sol_btn = block.select_one('.btn_sol') or block.select_one('.solution')
            if sol_btn:
                # Often the solution is in a sibling or a hidden child
                answer = "Consultez la source pour la solution interactive."

            Exercise.objects.get_or_create(
                lesson=lesson,
                title=title_text[:255],
                defaults={
                    'question': question,
                    'correct_answer': answer,
                    'type': 'short_answer',
                    'difficulty': 3
                }
            )

    def process_subject_link(self, url, name, level_code):
        logger.info(f"    -> Subject: {name}")
        subject = self.get_or_create_subject(name)
        
        course_title = f"{subject.name} - {level_code}"
        course, _ = Course.objects.get_or_create(
            title=course_title,
            level=level_code,
            defaults={'subject': subject, 'status': 'published'}
        )

        # Step 1: Check if the link is a list of modules or a module itself
        soup = self.get_soup(url)
        if not soup: return

        # If it's a module directly (Scenari), it usually has a specific class or ID
        # or we just treat the subject landing page as the first lesson
        self.scrape_lesson_content(url, course, subject.name)

    def run(self):
        logger.info("Starting Deep Scraper for Faso Education...")
        for url, level_code in URL_LEVEL_MAP.items():
            logger.info(f"Processing Level: {level_code}")
            soup = self.get_soup(url)
            if not soup: continue

            # Find buttons "Accéder" (SPPageBuilder style)
            subject_buttons = soup.select('a.sppb-btn-custom') or soup.find_all('a', text=re.compile(r'Accéder', re.I))
            
            if not subject_buttons:
                # Fallback to general links in main body
                content_main = soup.select_one('.item-page') or soup.body
                subject_buttons = content_main.find_all('a', href=True)

            for btn in subject_buttons:
                href = btn.get('href')
                # Find the subject name: usually in a heading above the button
                # Search parents or siblings
                subject_name = ""
                parent = btn.parent
                for _ in range(5):
                    if not parent: break
                    header = parent.find(['h1', 'h2', 'h3', 'h4'])
                    if header:
                        subject_name = header.get_text(strip=True)
                        break
                    parent = parent.parent
                
                if not subject_name:
                    subject_name = btn.get_text(strip=True)
                
                # Filter out garbage
                if subject_name.lower() in ['accéder', 'lire la suite', 'voir plus', '']:
                    continue

                full_url = urljoin(BASE_URL, href)
                if 'fasoeducation.bf' in full_url:
                    self.process_subject_link(full_url, subject_name, level_code)

if __name__ == '__main__':
    import re
    scraper = FasoScraper()
    scraper.run()
