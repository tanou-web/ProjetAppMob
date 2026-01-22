"""
GÉNÉRATEUR D'EXPLICATIONS INTELLIGENTES
========================================

Génère des explications personnalisées basées sur:
- Le type d'erreur
- Le niveau de compréhension
- L'historique d'apprentissage
- Le style d'apprentissage de l'étudiant
"""

import logging
from datetime import datetime
from django.db.models import Q
from apps.recommendations.models import SmartExplanation, LearningStyleProfile
from apps.exercises.models import ExerciseAttempt, Exercise
from apps.recommendations.models import ErrorAnalysis

logger = logging.getLogger(__name__)


class ExplanationGenerator:
    """Générer des explications intelligentes et personnalisées"""
    
    # Templates d'explications par type
    EXPLANATION_TEMPLATES = {
        'conceptual': {
            'intro': "Pour comprendre ce concept, il est important de savoir que:",
            'body': "Voici les points clés:",
            'example': "Voici un exemple concret:",
            'analogy': "On peut le comparer à:",
            'recap': "En résumé:",
            'next': "Pour approfondir:"
        },
        'calculation': {
            'intro': "Pour résoudre ce type de problème:",
            'steps': "Voici les étapes:",
            'common_mistake': "Erreur courante:",
            'tip': "Conseil utile:",
            'practice': "Pour pratiquer:"
        },
        'reading': {
            'intro': "Pour bien lire et comprendre l'énoncé:",
            'key_points': "Points clés à retenir:",
            'reread': "À relire attention:",
            'understanding': "Assurez-vous de comprendre:",
            'next': "Maintenant:"
        },
        'logical': {
            'intro': "Pour résoudre ce type de problème logiquement:",
            'order': "L'ordre des étapes est important:",
            'flow': "Le flux doit être:",
            'check': "Vérifiez que:",
            'practice': "Entraînez-vous avec:"
        }
    }
    
    @staticmethod
    def generate_explanation(exercise_attempt, error_analysis=None):
        """
        Générer une explication pour une tentative d'exercice
        
        Args:
            exercise_attempt: Instance ExerciseAttempt
            error_analysis: Instance ErrorAnalysis optionnelle
            
        Returns:
            SmartExplanation instance
        """
        # Vérifier s'il existe déjà une explication
        existing = SmartExplanation.objects.filter(
            exercise_attempt=exercise_attempt
        ).first()
        if existing:
            return existing
        
        student = exercise_attempt.student
        exercise = exercise_attempt.exercise
        
        # Récupérer l'analyse d'erreur si nécessaire
        if not error_analysis:
            error_analysis = ErrorAnalysis.objects.filter(
                exercise_attempt=exercise_attempt
            ).first()
        
        # Déterminer le type d'explication
        explanation_type = ExplanationGenerator._determine_explanation_type(
            exercise_attempt, error_analysis
        )
        
        # Récupérer le style d'apprentissage
        learning_style = ExplanationGenerator._get_learning_style(student)
        
        # Générer le contenu
        content = ExplanationGenerator._generate_content(
            exercise, exercise_attempt, error_analysis, explanation_type, learning_style
        )
        
        # Déterminer les caractéristiques
        uses_examples = ExplanationGenerator._should_use_examples(learning_style)
        uses_analogies = ExplanationGenerator._should_use_analogies(learning_style)
        is_interactive = ExplanationGenerator._should_be_interactive(explanation_type)
        
        # Créer l'explication
        explanation = SmartExplanation.objects.create(
            exercise_attempt=exercise_attempt,
            student=student,
            explanation_type=explanation_type,
            content=content,
            uses_examples=uses_examples,
            uses_analogies=uses_analogies,
            is_interactive=is_interactive
        )
        
        logger.info(f"Smart explanation generated for {student.email}: {explanation_type}")
        
        return explanation
    
    @staticmethod
    def _determine_explanation_type(exercise_attempt, error_analysis):
        """Déterminer le type d'explication à générer"""
        if not exercise_attempt.is_correct:
            if error_analysis:
                return 'error_specific'
            else:
                return 'concept_based'
        else:
            # Réponse correcte - fournir un renforcement
            return 'reinforcement'
    
    @staticmethod
    def _get_learning_style(student):
        """Récupérer le profil de style d'apprentissage"""
        try:
            return LearningStyleProfile.objects.get(student=student)
        except LearningStyleProfile.DoesNotExist:
            # Créer un profil par défaut
            return LearningStyleProfile.objects.create(student=student)
    
    @staticmethod
    def _generate_content(exercise, exercise_attempt, error_analysis, explanation_type, learning_style):
        """Générer le contenu de l'explication"""
        
        if explanation_type == 'error_specific' and error_analysis:
            return ExplanationGenerator._generate_error_specific(
                exercise, exercise_attempt, error_analysis, learning_style
            )
        elif explanation_type == 'concept_based':
            return ExplanationGenerator._generate_concept_based(
                exercise, exercise_attempt, learning_style
            )
        elif explanation_type == 'reinforcement':
            return ExplanationGenerator._generate_reinforcement(
                exercise, exercise_attempt, learning_style
            )
        elif explanation_type == 'reminder':
            return ExplanationGenerator._generate_reminder(exercise)
        else:
            return ExplanationGenerator._generate_alternative_approach(
                exercise, exercise_attempt, learning_style
            )
    
    @staticmethod
    def _generate_error_specific(exercise, exercise_attempt, error_analysis, learning_style):
        """Générer une explication basée sur l'erreur"""
        error_type = error_analysis.error_type
        templates = ExplanationGenerator.EXPLANATION_TEMPLATES.get(error_type, {})
        
        parts = []
        
        # Introduction
        if error_type == 'calculation':
            parts.append(f"{templates.get('intro', 'Comment résoudre ce problème:')} {exercise.title}")
            
            # Correction
            parts.append(f"\n**Vous aviez répondu:** {exercise_attempt.student_answer}")
            parts.append(f"**Réponse correcte:** {exercise.correct_answer}")
            
            # Raison
            if error_analysis.root_cause:
                parts.append(f"\n**Pourquoi c'était incorrect:** {error_analysis.root_cause}")
            
            # Étapes
            parts.append(f"\n{templates.get('steps', 'Voici comment faire:')} ")
            parts.append(ExplanationGenerator._get_calculation_steps(exercise))
            
            # Conseil
            parts.append(f"\n**Conseil:** {ExplanationGenerator._get_learning_tip(learning_style, error_type)}")
            
        elif error_type == 'conceptual':
            parts.append(f"{templates.get('intro', 'Comprendre ce concept')}: {exercise.lesson.title if exercise.lesson else exercise.title}")
            
            # Expliquer le concept
            parts.append("\n**Le concept clé:**")
            parts.append(exercise.explanation or "Concept non expliqué")
            
            # Analyse de l'erreur
            if error_analysis.misconception_identified:
                parts.append(f"\n**Votre malentendu:** {error_analysis.misconception_identified}")
            
            # Clarification
            parts.append(f"\n**La bonne approche:** {error_analysis.root_cause or 'Revoir les bases'}")
            
            # Exemple
            parts.append("\n**Exemple concret:**")
            parts.append(ExplanationGenerator._get_example(exercise))
            
        elif error_type == 'reading':
            parts.append(f"{templates.get('intro', 'Lire l\'énoncé attentivement')}")
            
            parts.append(f"\n**L'énoncé dit:** {exercise.question}")
            parts.append(f"\n**Vous aviez compris:** {exercise_attempt.student_answer}")
            
            parts.append(f"\n**Ce qui était important:** {error_analysis.root_cause}")
            
            parts.append("\n**Stratégie de lecture:**")
            parts.append("1. Lire complètement l'énoncé")
            parts.append("2. Identifier les mots clés")
            parts.append("3. Reformuler avec vos mots")
            parts.append("4. Vérifier avant de répondre")
        
        else:  # careless, logical, other
            parts.append(f"{templates.get('intro', 'Analyser votre erreur')}")
            
            parts.append(f"\n**Type d'erreur:** {error_analysis.error_type}")
            parts.append(f"\n**Description:** {error_analysis.description}")
            
            if error_analysis.root_cause:
                parts.append(f"\n**Raison probable:** {error_analysis.root_cause}")
            
            parts.append("\n**Pour éviter cette erreur:**")
            parts.append("• Prenez votre temps")
            parts.append("• Relisez avant de valider")
            parts.append("• Vérifiez votre logique")
            
            if error_analysis.suggested_topics:
                parts.append(f"\n**À réviser:** {', '.join(error_analysis.suggested_topics)}")
        
        return "\n".join(parts)
    
    @staticmethod
    def _generate_concept_based(exercise, exercise_attempt, learning_style):
        """Générer une explication basée sur le concept"""
        parts = []
        
        title = exercise.lesson.title if exercise.lesson else exercise.title
        parts.append(f"**Concept: {title}**\n")
        
        # Explication
        if exercise.explanation:
            parts.append(f"**Explication:** {exercise.explanation}\n")
        
        # Points clés
        parts.append("**Points importants:**")
        parts.append("• Comprendre les bases")
        parts.append("• Appliquer la méthode")
        parts.append("• Vérifier le résultat\n")
        
        # Exemple
        parts.append("**Exemple:**")
        parts.append(ExplanationGenerator._get_example(exercise))
        
        # Ressources
        if exercise.hints:
            parts.append(f"\n**Indices disponibles:** {', '.join(exercise.hints[:2])}")
        
        return "\n".join(parts)
    
    @staticmethod
    def _generate_reinforcement(exercise, exercise_attempt, learning_style):
        """Générer une explication de renforcement"""
        parts = []
        
        parts.append(f"✅ **Très bien! Vous avez réussi!**\n")
        
        parts.append(f"Vous avez correctement répondu à: {exercise.title}\n")
        
        parts.append("**Concepts maîtrisés:**")
        if exercise.lesson:
            parts.append(f"• {exercise.lesson.title}")
        parts.append(f"• Exercice de niveau {exercise.get_difficulty_display()}\n")
        
        parts.append("**Continuez comme ça:**")
        parts.append("• Pratiquez régulièrement")
        parts.append("• Essayez des exercices plus difficiles")
        parts.append("• Aidez d'autres étudiants\n")
        
        parts.append("**Votre progression:** Continuez à explorer de nouveaux concepts!")
        
        return "\n".join(parts)
    
    @staticmethod
    def _generate_reminder(exercise):
        """Générer un rappel"""
        parts = []
        
        parts.append("**Rappel rapide:**\n")
        
        if exercise.explanation:
            parts.append(f"{exercise.explanation}\n")
        
        parts.append("**À retenir:**")
        parts.append("• Relisez le cours si besoin")
        parts.append("• Consultez vos notes")
        parts.append("• Demandez de l'aide si nécessaire")
        
        return "\n".join(parts)
    
    @staticmethod
    def _generate_alternative_approach(exercise, exercise_attempt, learning_style):
        """Générer une approche alternative"""
        parts = []
        
        parts.append(f"**Approche alternative pour: {exercise.title}**\n")
        
        parts.append("Voici une autre façon de penser à ce problème:\n")
        
        parts.append(f"**Approche 1 (Directe):**")
        parts.append(exercise.explanation or "Voir la méthode standard\n")
        
        parts.append("**Approche 2 (Alternative):**")
        if exercise.type == 'multiple_choice':
            parts.append("• Éliminez les réponses évidentes")
            parts.append("• Testez chaque option")
            parts.append("• Choisissez la meilleure réponse")
        else:
            parts.append("• Pensez au problème différemment")
            parts.append("• Cherchez des patterns")
            parts.append("• Vérifiez votre logique")
        
        parts.append(f"\n**Quelle approche vous convient le mieux?** Essayez de nouvelles stratégies!")
        
        return "\n".join(parts)
    
    @staticmethod
    def _get_calculation_steps(exercise):
        """Obtenir les étapes de calcul"""
        steps = [
            "1. Lisez l'énoncé complètement",
            "2. Identifiez les données importantes",
            "3. Choisissez la bonne formule",
            "4. Faites les calculs étape par étape",
            "5. Vérifiez votre réponse"
        ]
        return "\n".join(steps)
    
    @staticmethod
    def _get_example(exercise):
        """Obtenir un exemple concret"""
        if exercise.type == 'multiple_choice' and exercise.options:
            example = "Parmi les options proposées:"
            for i, option in enumerate(exercise.options[:3], 1):
                example += f"\n  {i}. {option}"
            return example
        else:
            return "Voir l'exercice d'entraînement associé pour d'autres exemples"
    
    @staticmethod
    def _should_use_examples(learning_style):
        """Vérifier si les exemples sont recommandés"""
        return learning_style.visual_preference > 3 or learning_style.kinesthetic_preference > 3
    
    @staticmethod
    def _should_use_analogies(learning_style):
        """Vérifier si les analogies sont recommandées"""
        return learning_style.auditory_preference > 3 or learning_style.visual_preference > 2
    
    @staticmethod
    def _should_be_interactive(explanation_type):
        """Vérifier si l'explication devrait être interactive"""
        return explanation_type in ['error_specific', 'concept_based']
    
    @staticmethod
    def _get_learning_tip(learning_style, error_type):
        """Obtenir un conseil basé sur le style d'apprentissage"""
        tips = {
            'visual': "Essayez de visualiser le problème avec un schéma ou un diagramme",
            'auditory': "Essayez de vous expliquer à voix haute comment résoudre le problème",
            'kinesthetic': "Essayez de refaire l'exercice avec des objets réels ou un modèle"
        }
        
        if learning_style.visual_preference > learning_style.auditory_preference and learning_style.visual_preference > learning_style.kinesthetic_preference:
            return tips['visual']
        elif learning_style.auditory_preference > learning_style.kinesthetic_preference:
            return tips['auditory']
        else:
            return tips['kinesthetic']


class MultilingualExplanationGenerator:
    """Supporter les explications multilingues"""
    
    SUPPORTED_LANGUAGES = ['fr', 'en', 'ar', 'am']  # Français, English, Arabic, Amharic
    
    @staticmethod
    def generate_in_language(exercise_attempt, language='fr', error_analysis=None):
        """
        Générer une explication dans une langue spécifique
        
        Pour maintenant: français par défaut
        À faire: intégration traduction (Google Translate API, etc.)
        """
        if language != 'fr':
            logger.warning(f"Language {language} not yet supported. Using French.")
            language = 'fr'
        
        # Générer en français
        return ExplanationGenerator.generate_explanation(exercise_attempt, error_analysis)
