import sys
import os
import django
import requests
from io import BytesIO
from pypdf import PdfReader
import logging

# Setup Django
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Lesson, Course, Subject

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def import_pdf(url, title, level, subject_name, subject_code, category="Fiches API"):
    logger.info(f"🚀 Starting import for: {title}")
    
    # 1. Extract Text
    try:
        logger.info(f"    📄 Downloading and extracting PDF: {url}")
        response = requests.get(url, timeout=30, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        response.raise_for_status()
        
        text = ""
        with BytesIO(response.content) as f:
            reader = PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if not text or len(text) < 100:
            logger.error("    ❌ Extracted text is too short or empty.")
            return
            
    except Exception as e:
        logger.error(f"    ❌ PDF Extraction failed: {e}")
        return

    # 2. Save to Database
    # Ensure subject exists
    subject = Subject.objects.filter(code=subject_code).first()
    if not subject:
        subject, _ = Subject.objects.get_or_create(name=subject_name, defaults={'code': subject_code})
        logger.info(f"    ✅ Subject created/found: {subject.name}")
    
    # Ensure course exists
    course_title = f"{category} - {subject_name} ({level})"
    course, _ = Course.objects.get_or_create(
        title=course_title,
        subject=subject,
        level=level,
        defaults={'status': 'published', 'description': f'Ressources pour {category}'}
    )
    logger.info(f"    ✅ Course created/found: {course.title}")
    
    # Create lesson
    full_title = f"{title}"
    if not Lesson.objects.filter(title=full_title, course=course).exists():
        Lesson.objects.create(
            course=course,
            title=full_title,
            description=f"Ressource pédagogique : {title}",
            content=f"<div class='teacher-resource'>{text}</div>\n<hr/><p>Source: <a href='{url}'>{url}</a></p>"
        )
        logger.info(f"    ✅ Lesson created: {full_title}")
    else:
        logger.info(f"    ℹ️ Lesson already exists: {full_title}")

if __name__ == "__main__":
    pdf_url = "https://fasoeducation.bf/espace_enseignants/fiches_aide_preparation/ce2/expression_ecrite_ce2.pdf"
    import_pdf(
        url=pdf_url,
        title="Expression Écrite CE2",
        level="primary_ce2",
        subject_name="Français",
        subject_code="french"
    )
