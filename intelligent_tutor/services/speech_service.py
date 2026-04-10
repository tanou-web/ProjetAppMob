"""
Speech Service - Google Cloud Text-to-Speech Integration
Generates high-quality audio for lessons and feedback.
"""
import os
import hashlib
import logging
from typing import Optional
from django.conf import settings
from django.core.files.storage import default_storage

logger = logging.getLogger(__name__)

try:
    from google.cloud import texttospeech
    TTS_AVAILABLE = True
except ImportError:
    TTS_AVAILABLE = False
    logger.warning("google-cloud-texttospeech not installed.")

class SpeechService:
    """Service to generate speech from text using Google TTS."""
    
    @staticmethod
    def generate_speech(text: str, voice_name: str = "fr-FR-Neural2-B") -> Optional[str]:
        """
        Generate audio from text and return the URL to the file.
        Uses local/cloud storage caching.
        """
        if not TTS_AVAILABLE:
            return None

        try:
            # Generate a unique filename based on text and voice
            text_hash = hashlib.md5(f"{text}{voice_name}".encode()).hexdigest()
            filename = f"audio/cache/{text_hash}.mp3"
            
            # Check if already in cache
            if default_storage.exists(filename):
                return default_storage.url(filename)
            
            # Initialize client using API Key from settings
            client = texttospeech.TextToSpeechClient(
                client_options={"api_key": settings.GEMINI_API_KEY}
            )
            
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Note: Neural2 or Studio voices are premium but sound very natural
            voice = texttospeech.VoiceSelectionParams(
                language_code="fr-FR",
                name=voice_name
            )
            
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )
            
            response = client.synthesize_speech(
                input=synthesis_input, 
                voice=voice, 
                audio_config=audio_config
            )
            
            # Save to storage
            from io import BytesIO
            audio_file = BytesIO(response.audio_content)
            default_storage.save(filename, audio_file)
            
            return default_storage.url(filename)
            
        except Exception as e:
            logger.error(f"TTS generation (Cloud API) failed: {str(e)}")
            
            # Fallback to gTTS (Standard Google TTS without API Key requirement)
            logger.info("Attempting fallback to gTTS...")
            try:
                from gtts import gTTS
                tts = gTTS(text=text, lang='fr')
                
                from io import BytesIO
                audio_file = BytesIO()
                tts.write_to_fp(audio_file)
                audio_file.seek(0)
                
                default_storage.save(filename, audio_file)
                return default_storage.url(filename)
            except Exception as ge:
                logger.error(f"gTTS fallback also failed: {str(ge)}")
                return None
