"""
Web Scraper pour Faso e-Education
Récupère tous les cours, leçons et ressources du site officiel
"""

import requests
from bs4 import BeautifulSoup
import logging
from typing import List, Dict
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class FasoEducationScraper:
    """Scrape les ressources de fasoeducation.bf"""
    
    BASE_URL = "https://fasoeducation.bf"
    
    # URLs des sections
    COURSE_LEVELS = {
        'primaire_cp': 'espace-eleves/primaire/primaire-classique/cours-cp.html',
        'primaire_ce1': 'espace-eleves/primaire/primaire-classique/cours-ce1.html',
        'primaire_ce2': 'espace-eleves/primaire/primaire-classique/cours-ce2.html',
        'primaire_cm1': 'espace-eleves/primaire/primaire-classique/cours-cm1.html',
        'primaire_cm2': 'espace-eleves/primaire/primaire-classique/cours-cm2.html',
        
        'postprimaire_6e': 'espace-eleves/postprimaire/postprimaire-general/cours-6e.html',
        'postprimaire_5e': 'espace-eleves/postprimaire/postprimaire-general/cours-5e.html',
        'postprimaire_4e': 'espace-eleves/postprimaire/postprimaire-general/cours-4e.html',
        'postprimaire_3e': 'espace-eleves/postprimaire/postprimaire-general/cours-troisieme.html',
        
        'secondaire_2nde': 'espace-eleves/secondaire/secondaire-general/cours-seconde.html',
        'secondaire_1ere': 'espace-eleves/secondaire/secondaire-general/cours-premiere.html',
        'secondaire_tle': 'espace-eleves/secondaire/secondaire-general/cours-terminale-generale.html',
    }
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get_page(self, path: str) -> BeautifulSoup:
        """Récupère et parse une page"""
        try:
            url = f"{self.BASE_URL}/{path}"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            logger.info(f"✅ Fetched: {path}")
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            logger.error(f"❌ Error fetching {path}: {e}")
            return None
    
    def extract_courses(self, level_key: str, soup: BeautifulSoup) -> List[Dict]:
        """Extrait les cours d'une page"""
        courses = []
        
        if not soup:
            return courses
        
        # Chercher les cours dans la page
        # Structure: <div class="course"> ou <li> avec liens
        course_links = soup.find_all('a', class_='cours-link')
        
        if not course_links:
            # Fallback: chercher tous les liens avec "cours" dans le texte
            for link in soup.find_all('a'):
                text = link.get_text(strip=True)
                if any(keyword in text.lower() for keyword in ['français', 'math', 'science', 'histoire', 'geographie', 'emc', 'english', 'arabe', 'eps', 'art']):
                    courses.append({
                        'title': text,
                        'url': link.get('href', ''),
                        'level': level_key,
                        'source': 'fasoeducation.bf'
                    })
        else:
            for link in course_links:
                courses.append({
                    'title': link.get_text(strip=True),
                    'url': link.get('href', ''),
                    'level': level_key,
                    'source': 'fasoeducation.bf'
                })
        
        logger.info(f"Found {len(courses)} courses for {level_key}")
        return courses
    
    def scrape_all_courses(self) -> Dict:
        """Scrape tous les cours"""
        all_courses = {}
        
        logger.info(f"Starting scrape from {self.BASE_URL}")
        
        for level_key, path in self.COURSE_LEVELS.items():
            logger.info(f"Scraping {level_key}...")
            
            soup = self.get_page(path)
            courses = self.extract_courses(level_key, soup)
            
            all_courses[level_key] = courses
        
        logger.info(f"✅ Scraping complete! Total levels: {len(all_courses)}")
        return all_courses
    
    def save_to_json(self, data: Dict, filename: str = 'faso_courses.json'):
        """Sauvegarde les données en JSON"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"✅ Data saved to {filename}")
        except Exception as e:
            logger.error(f"❌ Error saving to {filename}: {e}")


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    
    scraper = FasoEducationScraper()
    courses = scraper.scrape_all_courses()
    scraper.save_to_json(courses)
    
    # Afficher résumé
    total_courses = sum(len(c) for c in courses.values())
    print(f"\n✅ Scraping complete!")
    print(f"Total levels: {len(courses)}")
    print(f"Total courses: {total_courses}")
    print(f"\nDetailed breakdown:")
    for level, courses_list in courses.items():
        print(f"  {level}: {len(courses_list)} courses")
