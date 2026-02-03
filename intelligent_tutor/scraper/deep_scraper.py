import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging
import time

logger = logging.getLogger(__name__)

class ScenariScraper:
    """
    Scraper specialized in extracting content from Scenari/Opale modules.
    These modules are typically interactive and paginated.
    """
    
    def __init__(self, session=None):
        self.session = session or requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.visited_urls = set()

    def get_soup(self, url):
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None

    def find_module_entry(self, landing_url, depth=0):
        """Finds the actual content entry point, following redirections and iframes."""
        if depth > 3: return landing_url # Prevent infinite recursion
        
        soup = self.get_soup(landing_url)
        if not soup: return landing_url
        
        # 1. Check for Meta Refresh (common in Scenari index.html)
        meta_refresh = soup.find('meta', attrs={'http-equiv': lambda v: v and v.lower() == 'refresh'})
        if meta_refresh:
            content = meta_refresh.get('content', '')
            if 'url=' in content.lower():
                # Extract URL preserving case
                parts = content.lower().split('url=')
                # Find where 'url=' starts in original string to get exact case
                url_index = content.lower().find('url=') + 4
                refresh_url = content[url_index:].strip()
                return self.find_module_entry(urljoin(landing_url, refresh_url), depth + 1)

        # 2. Look for explicit "Commencer" buttons, iframes, or module links
        potential_triggers = [
            soup.find('a', class_='startBtn'),
            soup.find('a', class_='btnNxt'),
            soup.find('a', string=lambda t: t and any(kw in t for kw in ['Commencer', 'Démarrer', 'accéder au module'])),
            soup.find('a', href=lambda h: h and ('Publication_web.html' in h or 'index.html' in h)),
            soup.find('iframe', src=lambda s: s and ('index.html' in s or 'module' in s or 'cours_esu' in s or 'Publication_web.html' in s))
        ]
        
        for trigger in potential_triggers:
            if not trigger: continue
            link = trigger.get('href') or trigger.get('src')
            if link:
                full_link = urljoin(landing_url, link)
                # If it's a different URL, recurse to find the final landing
                if full_link != landing_url:
                    return self.find_module_entry(full_link, depth + 1)
        
        return landing_url

    def clean_content(self, soup):
        """Removes navigation elements, footers, and scripts from Scenari pages."""
        if not soup: return ""
        
        # Target common Scenari/Opale content containers
        content_container = (
            soup.select_one('div.scroller') or 
            soup.select_one('article#main') or 
            soup.select_one('main') or
            soup.select_one('div#main')
        )
        
        if not content_container:
            # Fallback: remove non-content elements and use body
            for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'div.mnu', 'div.nav']):
                tag.decompose()
            content_container = soup.body
            
        if not content_container:
            return ""

        # Clean up Internal Scenari links (prevent them from breaking)
        for a in content_container.find_all('a', href=True):
            # If it's a relative link within the module, we might want to strip it or keep it as text
            if not a['href'].startswith('http'):
                # For now, let's keep the text but remove the link to avoid broken relative paths
                a.replace_with(a.get_text())

        # Clean images (try to make them absolute if possible, or just fix paths)
        # Note: In a real app, we'd might want to download images too.
        
        return str(content_container)

    def scrape_module(self, start_url):
        """Traverses the module pages and merges content."""
        if not start_url: return ""
        
        merged_content = []
        current_url = start_url
        
        # We'll follow "Next" buttons and also check the menu if possible
        # To avoid infinite loops or re-visiting pages
        
        while current_url and current_url not in self.visited_urls:
            logger.info(f"Scraping page: {current_url}")
            self.visited_urls.add(current_url)
            
            soup = self.get_soup(current_url)
            if not soup: break
            
            # Extract and clean content from this page
            page_content = self.clean_content(soup)
            if page_content:
                merged_content.append(page_content)
            
            # Find the "Next" link
            next_link = (
                soup.select_one('a.nextBtn') or 
                soup.select_one('a.btnNxt') or
                soup.find('a', string=lambda t: t and 'Suivant' in t)
            )
            
            if next_link and next_link.get('href'):
                current_url = urljoin(current_url, next_link['href'])
                # Avoid going back to same directory index if it points back
                if current_url == start_url or '#' in current_url:
                    current_url = None
            else:
                current_url = None
                
            time.sleep(0.5) # Gentle scraping
            
        return "\n<hr/>\n".join(merged_content)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    scraper = ScenariScraper()
    
    # Test with a known module
    test_url = "https://fasoeducation.bf/espace-eleves/secondaire/secondaire-general/cours-terminale-generale/maths-terminale/courbes-parametrees-plan.html"
    entry = scraper.find_module_entry(test_url)
    print(f"Entry found: {entry}")
    
    if entry:
        content = scraper.scrape_module(entry)
        print(f"Scraped {len(content)} characters.")
        with open("scraped_test.html", "w", encoding="utf-8") as f:
            f.write(content)
