"""
ANALYSE INTELLIGENTE D'ERREURS
==============================

Analyse les erreurs des étudiants pour identifier:
- Types d'erreurs
- Concepts mal compris
- Misconceptions
- Patterns d'erreurs récurrentes
"""

import logging
from datetime import datetime, timedelta
from collections import Counter
from django.db.models import Count, Q, Avg
from apps.exercises.models import ExerciseAttempt, Exercise
from apps.recommendations.models import ErrorAnalysis, IntelligentRevisionItem
from apps.courses.models import Lesson

logger = logging.getLogger(__name__)


class ErrorAnalyzer:
    """Analyseur d'erreurs intelligente"""
    
    ERROR_KEYWORDS = {
        'calculation': [
            'calcul', 'addition', 'soustraction', 'multiplication', 'division',
            'pourcentage', 'fraction', 'décimal', 'opération', 'arithmétique'
        ],
        'conceptual': [
            'concept', 'notion', 'principe', 'théorie', 'définition',
            'compréhension', 'logique', 'raisonnement'
        ],
        'reading': [
            'lecture', 'lisé', 'compris', 'énoncé', 'question', 'texte'
        ],
        'careless': [
            'attention', 'erreur bête', 'oubli', 'confusion', 'inversé'
        ],
        'logical': [
            'logique', 'ordre', 'séquence', 'étapes', 'processus', 'méthode'
        ]
    }
    
    @staticmethod
    def analyze_attempt(exercise_attempt):
        """
        Analyser une tentative d'exercice défaillante
        
        Args:
            exercise_attempt: Instance ExerciseAttempt
            
        Returns:
            ErrorAnalysis instance or None
        """
        # Ne pas analyser les réponses correctes
        if exercise_attempt.is_correct:
            return None
        
        # Vérifier s'il existe déjà une analyse
        existing = ErrorAnalysis.objects.filter(exercise_attempt=exercise_attempt).first()
        if existing:
            return existing
        
        exercise = exercise_attempt.exercise
        student = exercise_attempt.student
        
        # Déterminer le type d'erreur
        error_type = ErrorAnalyzer._determine_error_type(
            exercise, exercise_attempt.student_answer, exercise.correct_answer
        )
        
        # Identifier le concept impliqué
        concept = ErrorAnalyzer._extract_concept(exercise)
        
        # Analyser la conception erronée
        misconception = ErrorAnalyzer._identify_misconception(
            exercise, exercise_attempt.student_answer, exercise.correct_answer, error_type
        )
        
        # Déterminer la cause racine
        root_cause = ErrorAnalyzer._determine_root_cause(
            exercise, error_type, misconception
        )
        
        # Déterminer le niveau de compréhension
        understanding_level = ErrorAnalyzer._assess_understanding_level(
            exercise_attempt, error_type
        )
        
        # Créer l'analyse
        analysis = ErrorAnalysis.objects.create(
            exercise_attempt=exercise_attempt,
            student=student,
            exercise=exercise,
            error_type=error_type,
            concept_involved=concept,
            description=f"Erreur {error_type} en {concept}",
            student_answer=str(exercise_attempt.student_answer)[:500],
            correct_answer=str(exercise.correct_answer)[:500],
            concept_understanding_level=understanding_level,
            misconception_identified=misconception,
            root_cause=root_cause,
            partial_credit=ErrorAnalyzer._calculate_partial_credit(
                exercise_attempt.student_answer, exercise.correct_answer
            ),
            suggested_topics=ErrorAnalyzer._get_suggested_topics(exercise, concept),
            similar_past_errors=ErrorAnalyzer._count_similar_past_errors(student, concept)
        )
        
        logger.info(f"Error analysis created for {student.email}: {error_type} in {concept}")
        
        # Créer ou mettre à jour l'item de révision
        ErrorAnalyzer._create_revision_item(student, concept, analysis)
        
        return analysis
    
    @staticmethod
    def _determine_error_type(exercise, student_answer, correct_answer):
        """Déterminer le type d'erreur"""
        student_answer_str = str(student_answer).lower()
        correct_answer_str = str(correct_answer).lower()
        
        # Vérifier par types
        for error_type, keywords in ErrorAnalyzer.ERROR_KEYWORDS.items():
            if exercise.type in keywords or any(kw in exercise.description.lower() for kw in keywords):
                if error_type == 'calculation' and exercise.type in ['number', 'math']:
                    return 'calculation'
                elif error_type == 'conceptual':
                    return 'conceptual'
                elif error_type == 'reading' and exercise.type == 'essay':
                    return 'reading'
        
        # Par défaut
        if student_answer_str in correct_answer_str or correct_answer_str in student_answer_str:
            return 'careless'
        
        return 'conceptual'
    
    @staticmethod
    def _extract_concept(exercise):
        """Extraire le concept principal de l'exercice"""
        # Récupérer de la leçon
        if exercise.lesson:
            return exercise.lesson.title
        return exercise.title or "Concept général"
    
    @staticmethod
    def _identify_misconception(exercise, student_answer, correct_answer, error_type):
        """Identifier la misconception"""
        misconceptions = {
            'calculation': "Erreur dans le calcul ou la procédure mathématique",
            'conceptual': f"Incompréhension du concept: {exercise.lesson.title if exercise.lesson else exercise.title}",
            'reading': "Mauvaise interprétation de l'énoncé",
            'careless': "Erreur d'inattention ou d'oubli",
            'logical': "Erreur dans le raisonnement ou l'ordre logique",
            'other': "Erreur non classifiée"
        }
        
        return misconceptions.get(error_type, "Erreur non identifiée")
    
    @staticmethod
    def _determine_root_cause(exercise, error_type, misconception):
        """Déterminer la cause racine"""
        causes = {
            'calculation': "Maîtrise insuffisante des opérations ou de la procédure",
            'conceptual': f"Le concept n'est pas encore bien intégré. Révision nécessaire.",
            'reading': "Attention insuffisante à l'énoncé. Vérifier la lecture active.",
            'careless': "Vérifier la concentration et prendre son temps",
            'logical': "Manque de pratique dans la mise en ordre des étapes",
        }
        
        return causes.get(error_type, misconception)
    
    @staticmethod
    def _assess_understanding_level(exercise_attempt, error_type):
        """Évaluer le niveau de compréhension"""
        # Une simple erreur d'inattention n'indique pas une incompréhension
        if error_type == 'careless':
            return 'mostly_understood'
        elif error_type == 'calculation':
            return 'partial'
        elif error_type == 'conceptual':
            return 'not_understood'
        else:
            return 'partial'
    
    @staticmethod
    def _calculate_partial_credit(student_answer, correct_answer):
        """Calculer le crédit partiel basé sur la similarité"""
        student_str = str(student_answer).lower().strip()
        correct_str = str(correct_answer).lower().strip()
        
        # Cas simple: réponse partiellement correcte
        if len(student_str) > 0 and len(correct_str) > 0:
            # Calcul basique de similarité
            matching_chars = sum(1 for a, b in zip(student_str, correct_str) if a == b)
            similarity = (matching_chars / max(len(student_str), len(correct_str))) * 100
            return min(similarity * 0.8, 50)  # Max 50 points
        
        return 0
    
    @staticmethod
    def _get_suggested_topics(exercise, concept):
        """Obtenir les sujets suggérés pour révision"""
        topics = [concept]
        
        if exercise.lesson:
            # Ajouter les leçons du même cours
            similar_lessons = Lesson.objects.filter(
                course=exercise.lesson.course
            ).values_list('title', flat=True)[:3]
            topics.extend(similar_lessons)
        
        return topics
    
    @staticmethod
    def _count_similar_past_errors(student, concept):
        """Compter les erreurs similaires passées"""
        # Chercher les erreurs du même concept
        similar_errors = ErrorAnalysis.objects.filter(
            student=student,
            concept_involved__icontains=concept.split()[0]  # First word
        ).count()
        
        return similar_errors
    
    @staticmethod
    def _create_revision_item(student, concept, error_analysis):
        """Créer ou mettre à jour un item de révision"""
        item, created = IntelligentRevisionItem.objects.get_or_create(
            student=student,
            concept=concept,
            defaults={
                'reason': f'Erreur identifiée: {error_analysis.misconception_identified}',
                'priority_score': 0.8 if error_analysis.concept_understanding_level == 'not_understood' else 0.5,
                'error_count': 1,
                'last_error': datetime.now(),
                'custom_tips': [error_analysis.root_cause]
            }
        )
        
        if not created:
            # Mettre à jour
            item.error_count += 1
            item.last_error = datetime.now()
            item.priority_score = min(item.priority_score + 0.1, 1.0)
            
            # Ajouter aux tips si nouveau
            if error_analysis.root_cause not in item.custom_tips:
                item.custom_tips.append(error_analysis.root_cause)
            
            item.save()
        
        return item


class ErrorPatternAnalyzer:
    """Analyser les patterns d'erreurs pour détecter les problèmes systématiques"""
    
    @staticmethod
    def analyze_student_patterns(student, days_back=30):
        """
        Analyser les patterns d'erreurs d'un étudiant
        
        Returns:
            dict avec patterns et recommandations
        """
        cutoff_date = datetime.now() - timedelta(days=days_back)
        
        # Récupérer les analyses d'erreurs
        error_analyses = ErrorAnalysis.objects.filter(
            student=student,
            created_at__gte=cutoff_date
        )
        
        if not error_analyses.exists():
            return {'patterns': [], 'recommendations': []}
        
        # Analyser par type
        error_types = error_analyses.values('error_type').annotate(count=Count('id')).order_by('-count')
        
        # Analyser par concept
        concepts = error_analyses.values('concept_involved').annotate(
            count=Count('id'),
            avg_understanding=Avg('concept_understanding_level')
        ).order_by('-count')
        
        patterns = {
            'most_common_error_type': error_types.first()['error_type'] if error_types.exists() else None,
            'error_type_distribution': list(error_types),
            'problem_concepts': list(concepts[:5]),
            'total_errors': error_analyses.count(),
            'error_rate': (error_analyses.count() / max(ErrorPatternAnalyzer._get_total_attempts(student, days_back), 1)) * 100
        }
        
        # Générer recommandations
        recommendations = ErrorPatternAnalyzer._generate_recommendations(patterns, student)
        
        return {
            'patterns': patterns,
            'recommendations': recommendations,
            'analysis_period_days': days_back
        }
    
    @staticmethod
    def _get_total_attempts(student, days_back):
        """Obtenir le nombre total de tentatives"""
        cutoff_date = datetime.now() - timedelta(days=days_back)
        return ExerciseAttempt.objects.filter(
            student=student,
            created_at__gte=cutoff_date
        ).count()
    
    @staticmethod
    def _generate_recommendations(patterns, student):
        """Générer des recommandations basées sur les patterns"""
        recommendations = []
        
        if patterns['error_rate'] > 50:
            recommendations.append({
                'priority': 'high',
                'message': 'Taux d\'erreur élevé (>50%). Révision urgente recommandée.',
                'action': 'revision'
            })
        
        # Identifier le type d'erreur le plus courant
        if patterns['most_common_error_type']:
            recommendations.append({
                'priority': 'medium',
                'message': f"Erreurs principalement de type: {patterns['most_common_error_type']}",
                'action': 'focus_error_type'
            })
        
        # Recommander la révision des concepts problématiques
        if patterns['problem_concepts']:
            problem_concepts = [c['concept_involved'] for c in patterns['problem_concepts'][:3]]
            recommendations.append({
                'priority': 'high',
                'message': f"Concepts problématiques identifiés: {', '.join(problem_concepts)}",
                'action': 'revision_items',
                'targets': problem_concepts
            })
        
        return recommendations


class DetailedErrorReport:
    """Générer un rapport détaillé sur les erreurs"""
    
    @staticmethod
    def generate_report(student, days_back=30):
        """
        Générer un rapport détaillé des erreurs
        """
        cutoff_date = datetime.now() - timedelta(days=days_back)
        
        error_analyses = ErrorAnalysis.objects.filter(
            student=student,
            created_at__gte=cutoff_date
        ).select_related('exercise', 'exercise_attempt')
        
        if not error_analyses.exists():
            return {
                'student': student.email,
                'period_days': days_back,
                'total_errors': 0,
                'analysis': None
            }
        
        # Résumé
        report = {
            'student': student.email,
            'period_days': days_back,
            'total_errors': error_analyses.count(),
            'by_error_type': {},
            'by_concept': {},
            'improvement_areas': [],
            'success_stories': [],
            'overall_understanding': {}
        }
        
        # Par type d'erreur
        for error_type, _ in ErrorAnalysis.ERROR_TYPE_CHOICES:
            count = error_analyses.filter(error_type=error_type).count()
            if count > 0:
                report['by_error_type'][error_type] = {
                    'count': count,
                    'percentage': (count / error_analyses.count()) * 100
                }
        
        # Par concept
        concepts_data = error_analyses.values('concept_involved').annotate(
            count=Count('id'),
            avg_understanding=Avg('concept_understanding_level')
        ).order_by('-count')
        
        for concept in concepts_data:
            report['by_concept'][concept['concept_involved']] = {
                'error_count': concept['count'],
                'understanding_level': concept['avg_understanding']
            }
        
        # Aires d'amélioration
        for concept, data in list(report['by_concept'].items())[:3]:
            report['improvement_areas'].append({
                'concept': concept,
                'error_count': data['error_count'],
                'recommendation': f"Révision recommandée pour {concept}"
            })
        
        return report
