import os
import django
import sys
import logging
import re
from urllib.parse import urljoin

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Lesson, Course
from scraper.deep_scraper import ScenariScraper

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def extract_url(content):
    """Extracts the FASO URL from the lesson content string."""
    # Pattern: Source FASO: /path/to/resource or http://...
    match = re.search(r'Source FASO:\s*(https?://[^\s<>"]+|/[^\s<>"]+)', content)
    if match:
        url = match.group(1)
        if url.startswith('/'):
            url = f"https://fasoeducation.bf{url}"
        return url
    return None

def enrich_lessons(limit=None, level_filter='secondary_tle', subject_filter=None):
    scraper = ScenariScraper()
    
    # Filter lessons that only have the "Source FASO" link
    lessons = Lesson.objects.filter(content__startswith='Source FASO:')
    
    if level_filter:
        lessons = lessons.filter(course__level=level_filter)
        
    if subject_filter:
        lessons = lessons.filter(course__subject__name__icontains=subject_filter)

    total = lessons.count()
    logger.info(f"Found {total} lessons to enrich for Level: {level_filter}, Subject: {subject_filter}")
    
    count = 0
    for lesson in lessons:
        if limit and count >= limit:
            break
            
        url = extract_url(lesson.content)
        if not url:
            logger.warning(f"Could not extract URL from lesson: {lesson.title}")
            continue
            
        logger.info(f"Enriching [{lesson.course.subject.name}] {lesson.title} from {url}")
        
        try:
            entry_url = scraper.find_module_entry(url)
            if entry_url:
                full_content = scraper.scrape_module(entry_url)
                if full_content and len(full_content) > 200:
                    # Keep the original source link at the bottom for reference
                    source_footer = f"\n<hr/><p><em>Source: <a href='{url}'>{url}</a></em></p>"
                    lesson.content = full_content + source_footer
                    lesson.save()
                    count += 1
                    logger.info(f"  Successfully enriched with {len(full_content)} chars.")
                else:
                    logger.warning(f"  Scraped content too short or empty for {url}")
            else:
                logger.warning(f"  Could not find module entry for {url}")
        except Exception as e:
            logger.error(f"  Error enriching {lesson.title}: {e}")
            
    logger.info(f"Enrichment completed. {count} lessons updated.")

if __name__ == "__main__":
    # For testing, let's limit to 5 lessons
    # Target Terminale (secondary_tle)
    import argparse
    parser = argparse.ArgumentParser(description='Enrich lessons with full Scenari content.')
    parser.add_argument('--limit', type=int, default=None, help='Limit number of lessons to process')
    parser.add_argument('--subject', type=str, default=None, help='Filter by subject name')
    parser.add_argument('--level', type=str, default='lycee_tles', help='Filter by course level')
    
    args = parser.parse_args()
    
    level = None if args.level == 'all' else args.level
    enrich_lessons(limit=args.limit, level_filter=level, subject_filter=args.subject)
