"""
Tests pour le Faso Education Scraper
"""

import unittest
import json
from unittest.mock import Mock, patch, MagicMock
from scraper.faso_education_scraper import FasoEducationScraper
from scraper.config import COURSE_LEVELS, DJANGO_LEVEL_MAPPING


class TestFasoEducationScraper(unittest.TestCase):
    """Test suite for FasoEducationScraper"""

    def setUp(self):
        """Set up test fixtures"""
        self.scraper = FasoEducationScraper()

    def test_scraper_initialization(self):
        """Test scraper initializes correctly"""
        self.assertIsNotNone(self.scraper)
        self.assertEqual(self.scraper.BASE_URL, "https://fasoeducation.bf")
        self.assertIsNotNone(self.scraper.session)

    def test_course_levels_exist(self):
        """Test all course levels are defined"""
        self.assertGreater(len(COURSE_LEVELS), 0)
        
        # Check required levels
        required_levels = [
            'primaire_cp', 'primaire_ce1', 'primaire_ce2',
            'primaire_cm1', 'primaire_cm2',
            'postprimaire_6e', 'postprimaire_5e',
            'postprimaire_4e', 'postprimaire_3e',
            'secondaire_2nde', 'secondaire_1ere', 'secondaire_tle',
        ]
        
        for level in required_levels:
            self.assertIn(level, COURSE_LEVELS)

    def test_level_mapping_complete(self):
        """Test Django level mapping is complete"""
        self.assertEqual(len(COURSE_LEVELS), len(DJANGO_LEVEL_MAPPING))
        
        for key in COURSE_LEVELS.keys():
            self.assertIn(key, DJANGO_LEVEL_MAPPING)

    @patch('requests.Session.get')
    def test_get_page_success(self, mock_get):
        """Test successful page fetching"""
        # Mock the response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.content = b'<html><body>Test</body></html>'
        mock_get.return_value = mock_response

        result = self.scraper.get_page('test-path.html')
        
        self.assertIsNotNone(result)
        mock_get.assert_called_once()

    @patch('requests.Session.get')
    def test_get_page_failure(self, mock_get):
        """Test page fetching failure"""
        mock_get.side_effect = Exception("Connection error")

        result = self.scraper.get_page('test-path.html')
        
        self.assertIsNone(result)

    def test_extract_courses_empty(self):
        """Test extracting courses from empty soup"""
        result = self.scraper.extract_courses('test_level', None)
        
        self.assertEqual(result, [])

    def test_json_save(self):
        """Test saving data to JSON"""
        test_data = {
            'test_level': [
                {'title': 'Test Course', 'url': '/test', 'level': 'test_level'}
            ]
        }

        with patch('builtins.open', create=True) as mock_open:
            mock_open.return_value.__enter__ = Mock(return_value=MagicMock())
            mock_open.return_value.__exit__ = Mock(return_value=False)
            
            self.scraper.save_to_json(test_data, 'test.json')
            
            mock_open.assert_called_once()

    def test_scraper_config_paths(self):
        """Test all configured paths are non-empty"""
        for level, config in COURSE_LEVELS.items():
            if isinstance(config, dict):
                self.assertIn('path', config)
                self.assertGreater(len(config['path']), 0)

    def test_subject_extraction(self):
        """Test subject extraction from course title"""
        test_cases = [
            ('Français - CP', 'french'),
            ('Mathématiques primaires', 'math'),
            ('English for Beginners', 'english'),
        ]

        for title, expected_subject in test_cases:
            # This would test the subject extraction logic
            # Implementation depends on actual scraper logic
            pass


class TestScraperIntegration(unittest.TestCase):
    """Integration tests for the scraper"""

    @patch('scraper.faso_education_scraper.FasoEducationScraper.get_page')
    def test_full_scrape_simulation(self, mock_get_page):
        """Test full scrape with mocked responses"""
        mock_soup = MagicMock()
        mock_get_page.return_value = mock_soup

        scraper = FasoEducationScraper()
        
        # This would run the full scrape
        # with mocked page responses
        # Implementation depends on desired behavior


if __name__ == '__main__':
    unittest.main()
