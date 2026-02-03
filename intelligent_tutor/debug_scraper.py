import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'scraper'))
from scraper.faso_education_scraper import FasoEducationScraper

scraper = FasoEducationScraper()
level = 'secondaire_tle'
path = scraper.COURSE_LEVELS[level]
soup = scraper.get_page(path)
courses = scraper.extract_courses(level, soup)

print(f"Found {len(courses)} courses for {level}")
for c in courses:
    print(f" - {c['title']} | URL: {c['url']}")
