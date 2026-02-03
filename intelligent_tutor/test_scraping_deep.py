import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import os
import sys

# Mock for testing
BASE_URL = "https://fasoeducation.bf"

def get_soup(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_deep_content(url):
    print(f"Scraping Content from: {url}")
    soup = get_soup(url)
    if not soup: return
    
    # 1. Check for Scenari / Opale structure
    # Usually has a sidebar with .item or main content in .scroller
    scroller = soup.select_one('div.scroller')
    main_content = soup.select_one('div#main') or soup.select_one('article')
    
    content = scroller or main_content or soup.body
    
    # Extract text and links
    # Look for "Unités d'exposition" (Course text) and "Unités de pratique" (Exercises)
    lessons = []
    exercises = []
    
    # Find links to other sub-pages in the same folder
    links = content.find_all('a', href=True)
    for link in links:
        href = link['href']
        text = link.get_text(strip=True)
        # Filters for common Scenari lesson/exercise links
        if any(x in href for x in ['expUc', 'practUc', 'quiz', 'exercice']):
            full_url = urljoin(url, href)
            print(f"  Found sub-content: {text} ({href})")
            
    # Sample content extraction
    print("\n--- Content Snippet ---")
    if scroller:
        # Get actual text, keeping some structure
        text_content = scroller.get_text(separator='\n', strip=True)
        print(text_content[:500] + "...")
    else:
        print("Scroller div not found, might not be a Scenari module or deep enough.")

if __name__ == "__main__":
    # Test on the Terminale Math module
    test_url = "https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/maths-terminale/courbes-parametrees-plan.html"
    extract_deep_content(test_url)
