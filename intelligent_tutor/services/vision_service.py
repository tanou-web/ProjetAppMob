"""
Vision Service - Google Cloud Vision Integration
Handles handwriting recognition (OCR) for exercises.
"""
import os
import io
import base64
import logging
from typing import Dict, Optional
from django.conf import settings

logger = logging.getLogger(__name__)

try:
    from google.cloud import vision
    VISION_AVAILABLE = True
    
    # Check for credentials
    if not os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
        logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set - Vision AI service will be limited.")
except ImportError:
    VISION_AVAILABLE = False
    logger.warning("google-cloud-vision not installed.")

class VisionService:
    """Service to process images using Google Cloud Vision."""
    
    @staticmethod
    def extract_text_from_image(image_content: bytes) -> str:
        """
        Extract handwriting or printed text from an image.
        """
        if not VISION_AVAILABLE:
            return "Vision AI service non disponible."

        try:
            client = vision.ImageAnnotatorClient(
                client_options={"api_key": settings.GEMINI_API_KEY}
            )
            image = vision.Image(content=image_content)
            
            # Document Text Detection is better for handwriting and dense text
            response = client.document_text_detection(image=image)
            
            if response.error.message:
                raise Exception(f"Vision API Error: {response.error.message}")
            
            return response.full_text_annotation.text if response.full_text_annotation else ""
        except Exception as e:
            logger.error(f"OCR Extraction (Vision API) failed: {str(e)}")
            
            # Fallback to Gemini if Vision API fails
            logger.info("Attempting fallback to Gemini for OCR...")
            from .ai_service import AIService
            return AIService.extract_text_from_image(image_content)

    @staticmethod
    def analyze_exercise_photo(image_b64: str, exercise_context: str) -> Dict[str, any]:
        """
        Process a photo of a student's exercise and return analysis.
        """
        try:
            # Decode Base64
            if ',' in image_b64:
                image_b64 = image_b64.split(',')[1]
            image_bytes = base64.b64decode(image_b64)
            
            # Extract Text
            extracted_text = VisionService.extract_text_from_image(image_bytes)
            
            if not extracted_text:
                return {
                    'success': False,
                    'error': "Aucun texte n'a pu être détecté sur la photo. Assure-toi que l'image est bien éclairée."
                }
            
            return {
                'success': True,
                'extracted_text': extracted_text,
                'context': exercise_context
            }
        except Exception as e:
            logger.error(f"Image analysis failed: {str(e)}")
            return {'success': False, 'error': str(e)}
