"""
Module de gestion de l'Intelligence Artificielle - Projet Tuteur
Ce service fait le pont entre le backend Django et les modèles Google Gemini.
"""
import os
from typing import Dict, List, Optional
import logging

# Config du logger pour suivre les appels IA
logger = logging.getLogger(__name__)

from django.conf import settings

# On vérifie si la bibliothèque genai est bien installée dans l'environnement
try:
    import google.generativeai as genai
    AI_DISPONIBLE = True
    
    # Récupération de la clé API depuis les settings Django
    cle_ia = getattr(settings, 'GEMINI_API_KEY', None)
    if cle_ia:
        genai.configure(api_key=cle_ia)
        
        try:
            # On liste les modèles dispos pour choisir le plus récent/efficace
            modeles_trouves = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods and 'gemini' in m.name]
            
            # Ordre de préférence perso (on privilégie le flash 2.0 si dispo)
            priorite = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-flash-latest', 'gemini-1.5-flash', 'gemini-pro-latest']
            
            nom_modele_elu = None
            for p in priorite:
                for am in modeles_trouves:
                    if p in am:
                        nom_modele_elu = am
                        break
                if nom_modele_elu:
                    break
            
            if not nom_modele_elu and modeles_trouves:
                nom_modele_elu = modeles_trouves[0]
                
            if nom_modele_elu:
                # Initialisation de l'objet modèle global
                moteur_ia = genai.GenerativeModel(nom_modele_elu)
                active_model = moteur_ia
                AI_DISPONIBLE = True
                logger.info(f"Serveur IA initialisé sur : {nom_modele_elu}")
            else:
                raise Exception("Aucun modèle Gemini compatible trouvé sur ce compte.")
        except Exception as e:
            logger.warning(f"Echec init Gemini: {str(e)}")
            AI_DISPONIBLE = False
            moteur_ia = None
            active_model = None
    else:
        AI_DISPONIBLE = False
        moteur_ia = None
        active_model = None
        logger.warning("Clé GEMINI_API_KEY absente du fichier settings.py")
except ImportError:
    AI_DISPONIBLE = False
    moteur_ia = None
    active_model = None
    logger.warning("Bibliothèque google-generativeai non installée. Mode dégradé actif.")


class AIService:
    """Service for AI-powered educational features using Google Gemini."""
    
    @staticmethod
    def extract_text_from_image(image_bytes: bytes) -> str:
        """
        Use Gemini Flash to extract text from an image (OCR fallback).
        """
        if not GEMINI_AVAILABLE or model is None:
            return ""
            
        try:
            # Prepare image for Gemini
            image_part = {
                "mime_type": "image/jpeg",
                "data": image_bytes
            }
            
            prompt = "Reconnais tout le texte manuscrit ou imprimé sur cette image. Renvoie UNIQUEMENT le texte brut détecté, sans commentaires."
            
            response = model.generate_content([prompt, image_part])
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Gemini OCR extraction failed: {str(e)}")
            return ""

    @staticmethod
    def analyze_error(
        question: str,
        student_answer: str,
        correct_answer: str,
        student_level: str,
        subject: str,
        context: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Analyze student's error and generate intelligent feedback.
        
        Args:
            question: The exercise question
            student_answer: What the student answered
            correct_answer: The correct answer
            student_level: Student's grade level (CP1, CP2, CE1, 3ème, etc.)
            subject: Subject (Mathématiques, Français, etc.)
            context: Optional lesson context
            
        Returns:
            Dict with error_type, explanation, recommendations
        """
        prompt = f"""Tu es un tuteur pédagogique expert au Burkina Faso.

CONTEXTE:
- Niveau: {student_level}
- Matière: {subject}
- Question: {question}
- Réponse de l'élève: {student_answer}
- Bonne réponse: {correct_answer}
{f"- Contexte de la leçon: {context}" if context else ""}

TÂCHE:
Analyse l'erreur de l'élève et fournis:
1. TYPE D'ERREUR (calcul, lecture, compréhension, méthode, etc.)
2. EXPLICATION SIMPLE (en français adapté au niveau {student_level})
3. CONSEIL PÉDAGOGIQUE (comment corriger)
4. EXEMPLE SIMILAIRE (pour renforcer la compréhension)

Format ta réponse en JSON:
{{
    "error_type": "type d'erreur",
    "explanation": "explication claire et simple",
    "recommendation": "conseil pour progresser",
    "similar_example": "exemple concret similaire"
}}
"""
        
        # Check if Gemini is available
        if not GEMINI_AVAILABLE or model is None:
            return {
                'success': False,
                'error_type': 'Erreur de calcul',
                'explanation': f'La bonne réponse est {correct_answer}. Révise cette notion.',
                'recommendation': 'Revois la leçon et réessaie.',
                'similar_example': '',
                'confidence': 0.5
            }
        
        try:
            response = model.generate_content(prompt)
            result = response.text
            
            # Parse JSON response
            import json
            # Remove markdown code blocks if present
            if '```json' in result:
                result = result.split('```json')[1].split('```')[0].strip()
            elif '```' in result:
                result = result.split('```')[1].split('```')[0].strip()
            
            analysis = json.loads(result)
            
            logger.info(f"AI error analysis successful for {subject} - {student_level}")
            return {
                'success': True,
                'error_type': analysis.get('error_type', 'Erreur non classifiée'),
                'explanation': analysis.get('explanation', ''),
                'recommendation': analysis.get('recommendation', ''),
                'similar_example': analysis.get('similar_example', ''),
                'confidence': 0.85  # Gemini is generally reliable
            }
            
        except Exception as e:
            logger.error(f"AI error analysis failed: {str(e)}")
            return {
                'success': False,
                'error_type': 'Erreur technique',
                'explanation': 'Analyse IA temporairement indisponible.',
                'recommendation': 'Revois la leçon et réessaie.',
                'similar_example': '',
                'confidence': 0.0
            }
    
    @staticmethod
    def assess_student_level(
        student_name: str,
        current_level: str,
        statistics: Dict,
        subject_scores: Dict[str, float],
        recent_performance: List[Dict]
    ) -> Dict[str, any]:
        """
        AI evaluates the student's 'real' level based on comprehensive data.
        """
        if not GEMINI_AVAILABLE or not model:
            return {
                "real_level": current_level,
                "explanation": "L'évaluation par l'IA est temporairement indisponible.",
                "confidence": 0.5
            }

        prompt = f"""Tu es un expert en orientation pédagogique au Burkina Faso.
Analyse les performances de {student_name}, officiellement en classe de {current_level}.

DONNÉES DE PERFORMANCE:
- Score moyen global: {statistics.get('avg_score', 0):.1f}%
- Exercices complétés: {statistics.get('total_exercises', 0)}
- Temps d'étude: {statistics.get('study_time_hours', 0):.1f}h
- Scores par matière: {subject_scores}

RECENTES RÉSULTATS:
{recent_performance[:5]}

TÂCHE:
1. Détermine son "Niveau Réel" (est-ce qu'il a le niveau de sa classe, est-il en retard, ou en avance ?).
2. Fournis une explication pédagogique bienveillante en français simple.
3. Donne un indice de confiance (0.0 à 1.0).

Format JSON:
{{
    "real_level": "CP2 (Équivalent)",
    "status": "advance/on_track/behind",
    "explanation": "Ton explication ici...",
    "confidence": 0.85
}}
"""
        try:
            # Use analysis_model for better reasoning if available
            target_model = analysis_model if analysis_model else model
            response = target_model.generate_content(prompt)
            text = response.text
            
            # Extract JSON
            import json
            import re
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                # Ensure all keys exist
                if 'real_level' not in data: data['real_level'] = current_level
                if 'status' not in data: data['status'] = 'on_track'
                if 'explanation' not in data: data['explanation'] = "Ton niveau est en cours d'évaluation."
                if 'confidence' not in data: data['confidence'] = 0.7
                return data
            
            return {
                "real_level": current_level,
                "status": "on_track",
                "explanation": "L'analyse a identifié que tu es sur la bonne voie. Continue tes efforts !",
                "confidence": 0.6
            }
        except Exception as e:
            logger.error(f"Level assessment failed: {str(e)}")
            return {
                "real_level": current_level,
                "status": "on_track",
                "explanation": "L'IA n'a pas pu finaliser l'analyse détaillée, mais ton parcours reste positif.",
                "confidence": 0.5
            }

    @staticmethod
    def chatbot_response(
        student_message: str,
        student_level: str,
        subject: Optional[str] = None,
        lesson_context: Optional[str] = None,
        conversation_history: Optional[List[Dict]] = None
    ) -> str:
        """
        Generate chatbot response for student questions.
        
        Args:
            student_message: Student's question
            student_level: Grade level
            subject: Current subject (optional)
            lesson_context: Current lesson content (optional)
            conversation_history: Previous messages (optional)
            
        Returns:
            AI-generated response
        """
        # Check if Gemini is available
        if not GEMINI_AVAILABLE or model is None:
            return "Désolé, le chatbot IA n'est pas disponible pour le moment. Pose ta question à ton enseignant ou consulte la leçon."
        
        context_parts = [
            f"Tu es un tuteur pédagogique expert et bienveillant pour un élève de {student_level} au Burkina Faso.",
            "Ton objectif est d'aider l'élève à comprendre ses cours et à s'entraîner.",
            "RÈGLES DE RÉPONSE:",
            "1. Réponds en français simple, clair et encourageant, adapté au niveau de l'élève.",
            "2. Si l'élève veut 'traiter un exercice', propose-lui un petit exercice interactif ici même dans le chat ou explique-lui comment y accéder dans l'application.",
            "3. Si l'élève pose une question sur un cours, explique le concept de manière pédagogique avec des exemples du quotidien au Burkina Faso (marché, école, culture locale).",
            "4. Sois interactif : pose des questions à l'élève pour vérifier sa compréhension.",
            "5. Ne donne pas la réponse tout de suite, guide l'élève vers la solution.",
            "6. COMPORTEMENT LLM : Agis comme un véritable assistant conversationnel intelligent (comme Gemini). Sois fluide et naturel.",
            "7. FORMAT DE RÉPONSE : Tu peux répondre en texte brut OU en JSON si tu veux suggérer des actions spécifiques.",
            "Si tu veux suggérer une action, utilise ce format JSON:",
            '{ "message": "Ton message textuel ici", "actions": [{ "label": "Texte du bouton", "navigate": { "screen": "RevisionTab" } }] }'
        ]
        
        if subject:
            context_parts.append(f"Matière actuelle: {subject}")
        
        if lesson_context:
            context_parts.append(f"CONTENU DE LA LEÇON ACTUELLE (réfère-toi à ceci pour expliquer): {lesson_context[:1000]}")
        
        # Build conversation history
        messages = []
        if conversation_history:
            for msg in conversation_history[-8:]:  # Last 8 messages for better context
                role = "Élève" if msg['role'] == 'user' else "Tuteur"
                messages.append(f"{role}: {msg['content']}")
        
        prompt = "\n".join(context_parts)
        if messages:
            prompt += "\n\nHistorique de la conversation:\n" + "\n".join(messages)
        prompt += f"\n\nÉlève: {student_message}\n\nTuteur:"
        
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Robust JSON extraction
            import json
            import re
            
            # Find the JSON block and separate it from surrounding text
            # We look for the first '{' and last '}'
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                prefix = text[:start_idx].strip()
                json_part = text[start_idx:end_idx+1].strip()
                suffix = text[end_idx+1:].strip()
                
                try:
                    structured_data = json.loads(json_part)
                    if 'message' in structured_data:
                        # Merge surrounding text into the message
                        full_msg = ""
                        if prefix: full_msg += prefix + "\n\n"
                        full_msg += structured_data['message']
                        if suffix: full_msg += "\n\n" + suffix
                        
                        structured_data['message'] = full_msg.strip()
                        return structured_data
                except:
                    # If JSON parsing fails, fallback to returning the full text
                    pass
            
            return text
        except Exception as e:
            # Extended fallback logic: try other available models if the primary one fails
            logger.warning(f"Primary model failed: {str(e)}. Attempting fallbacks...")
            fallback_names = ['models/gemini-2.0-flash', 'models/gemini-pro-latest', 'models/gemini-flash-latest']
            
            for fb_name in fallback_names:
                try:
                    fb_model = genai.GenerativeModel(fb_name)
                    response = fb_model.generate_content(prompt)
                    text = response.text.strip()
                    if text.startswith('{') and text.endswith('}'):
                        try: return json.loads(text)
                        except: pass
                    return text
                except Exception as ex:
                    continue
            
            logger.error(f"Chatbot response failed after fallback: {str(e)}")
            return "Désolé, je rencontre une petite difficulté technique. Peux-tu reformuler ta question ?"
    
    @staticmethod
    def generate_parent_report(
        student_name: str,
        student_level: str,
        statistics: Dict,
        weak_subjects: List[str],
        strong_subjects: List[str],
        recent_progress: Dict
    ) -> str:
        """
        Generate intelligent parent report in French.
        
        Args:
            student_name: Student's name
            student_level: Grade level
            statistics: Overall stats (avg_score, total_exercises, etc.)
            weak_subjects: List of subjects needing improvement
            strong_subjects: List of subjects where student excels
            recent_progress: Recent performance data
            
        Returns:
            Formatted report text
        """
        # Check if Gemini is available
        if not GEMINI_AVAILABLE or model is None:
            return f"""Rapport de {student_name} - {student_level}

Score moyen: {statistics.get('avg_score', 0):.1f}%
Exercices complétés: {statistics.get('total_exercises', 0)}

Matières fortes: {', '.join(strong_subjects) if strong_subjects else 'Aucune'}
À améliorer: {', '.join(weak_subjects) if weak_subjects else 'Aucune'}

Votre enfant progresse dans son apprentissage. Continuez à l'encourager !
"""
        
        prompt = f"""Tu es un conseiller pédagogique au Burkina Faso.

Génère un rapport pour les parents de {student_name}, élève en {student_level}.

STATISTIQUES:
- Score moyen: {statistics.get('avg_score', 0):.1f}%
- Exercices complétés: {statistics.get('total_exercises', 0)}
- Temps d'étude: {statistics.get('study_time_hours', 0):.1f}h

MATIÈRES FORTES: {', '.join(strong_subjects) if strong_subjects else 'Aucune pour le moment'}
MATIÈRES À AMÉLIORER: {', '.join(weak_subjects) if weak_subjects else 'Aucune'}

PROGRESSION RÉCENTE:
{recent_progress}

TÂCHE:
Rédige un rapport bienveillant et constructif pour les parents en français simple.
Inclus:
1. Résumé de la performance
2. Points forts à encourager
3. Domaines à travailler
4. Recommandations concrètes (révisions, horaires, etc.)
5. Message d'encouragement

Ton: professionnel mais chaleureux, adapté au contexte burkinabè.
"""
        
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Parent report generation failed: {str(e)}")
            return f"""Rapport de {student_name} - {student_level}

Score moyen: {statistics.get('avg_score', 0):.1f}%
Exercices complétés: {statistics.get('total_exercises', 0)}

Votre enfant progresse dans son apprentissage. Continuez à l'encourager !

(Rapport détaillé temporairement indisponible)
"""
    
    @staticmethod
    def suggest_new_exercises(
        student_level: str,
        subject: str,
        weak_topics: List[str],
        difficulty_level: int = 2
    ) -> List[Dict]:
        """
        Generate suggestions for new exercises based on weak areas.
        
        Args:
            student_level: Grade level
            subject: Subject
            weak_topics: Topics where student struggles
            difficulty_level: 1-5 difficulty
            
        Returns:
            List of exercise suggestions
        """
        prompt = f"""Tu es un créateur de contenu pédagogique au Burkina Faso.

CONTEXTE:
- Niveau: {student_level}
- Matière: {subject}
- Thèmes faibles: {', '.join(weak_topics)}
- Difficulté: {difficulty_level}/5

TÂCHE:
Propose 3 exercices adaptés pour renforcer ces thèmes.

Format JSON:
[
    {{
        "title": "Titre de l'exercice",
        "question": "Énoncé clair",
        "type": "short_answer ou multiple_choice",
        "difficulty": {difficulty_level},
        "topic": "thème ciblé",
        "hint": "indice si besoin"
    }}
]
"""
        
        try:
            response = model.generate_content(prompt)
            result = response.text
            
            # Parse JSON
            import json
            if '```json' in result:
                result = result.split('```json')[1].split('```')[0].strip()
            elif '```' in result:
                result = result.split('```')[1].split('```')[0].strip()
            
            suggestions = json.loads(result)
            return suggestions
            
        except Exception as e:
            logger.error(f"Exercise suggestion failed: {str(e)}")
            return []


# Convenience functions for backward compatibility
def analyze_error(*args, **kwargs):
    """Wrapper for AIService.analyze_error"""
    return AIService.analyze_error(*args, **kwargs)


def generate_chatbot_response(*args, **kwargs):
    """Wrapper for AIService.chatbot_response"""
    return AIService.chatbot_response(*args, **kwargs)


def generate_parent_report(*args, **kwargs):
    """Wrapper for AIService.generate_parent_report"""
    return AIService.generate_parent_report(*args, **kwargs)
# Reload triggered
