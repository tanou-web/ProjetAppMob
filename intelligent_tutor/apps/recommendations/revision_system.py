"""
SYSTÈME DE RÉVISION INTELLIGENTE
================================

Recommande et suit la révision intelligente des concepts mal maîtrisés:
- Sélection intelligente des concepts à réviser
- Progression adaptée
- Validation de la maîtrise
- Feedback motivant
"""

import logging
from datetime import datetime, timedelta
from django.db.models import Count, Q, Avg, F
from apps.recommendations.models import IntelligentRevisionItem, ErrorAnalysis, SmartExplanation
from apps.exercises.models import ExerciseAttempt, Exercise
from apps.courses.models import Lesson

logger = logging.getLogger(__name__)


class IntelligentRevisionEngine:
    """Moteur de révision intelligente"""
    
    @staticmethod
    def create_revision_plan(student, limit=10):
        """
        Créer un plan de révision personnalisé
        
        Args:
            student: Instance User
            limit: Nombre maximum d'items
            
        Returns:
            Liste d'IntelligentRevisionItem triée par priorité
        """
        # Récupérer les items de révision recommandés
        revision_items = IntelligentRevisionItem.objects.filter(
            student=student,
            status__in=['recommended', 'in_progress']
        ).order_by('-priority_score', '-last_error')[:limit]
        
        if not revision_items.exists():
            # Créer des items basés sur les erreurs récentes
            recent_errors = ErrorAnalysis.objects.filter(
                student=student,
                created_at__gte=datetime.now() - timedelta(days=7)
            ).values('concept_involved').annotate(count=Count('id')).order_by('-count')[:limit]
            
            for error in recent_errors:
                IntelligentRevisionEngine._create_revision_item_from_error(
                    student, error['concept_involved'], error['count']
                )
            
            revision_items = IntelligentRevisionItem.objects.filter(
                student=student,
                status__in=['recommended', 'in_progress']
            ).order_by('-priority_score')[:limit]
        
        logger.info(f"Created revision plan for {student.email} with {revision_items.count()} items")
        
        return list(revision_items)
    
    @staticmethod
    def _create_revision_item_from_error(student, concept, error_count):
        """Créer un item de révision à partir d'une erreur"""
        item, created = IntelligentRevisionItem.objects.get_or_create(
            student=student,
            concept=concept,
            defaults={
                'reason': f'Erreur identifiée ({error_count} fois)',
                'priority_score': min(0.5 + (error_count * 0.1), 1.0),
                'error_count': error_count,
                'status': 'recommended'
            }
        )
        
        if not created and item.error_count < error_count:
            item.error_count = error_count
            item.priority_score = min(0.5 + (error_count * 0.1), 1.0)
            item.save()
        
        return item
    
    @staticmethod
    def start_revision_session(revision_item):
        """
        Démarrer une session de révision
        
        Returns:
            dict avec instructions et ressources
        """
        revision_item.status = 'in_progress'
        revision_item.save()
        
        # Récupérer les ressources
        related_exercises = IntelligentRevisionEngine._get_related_exercises(revision_item)
        related_lessons = IntelligentRevisionEngine._get_related_lessons(revision_item)
        tips = IntelligentRevisionEngine._get_revision_tips(revision_item)
        
        session_data = {
            'revision_item_id': revision_item.id,
            'concept': revision_item.concept,
            'priority': revision_item.priority_score,
            'reason': revision_item.reason,
            'custom_tips': tips,
            'recommended_exercises': related_exercises,
            'recommended_lessons': related_lessons,
            'session_started': datetime.now().isoformat(),
            'instructions': [
                "1. Lisez les ressources recommandées",
                "2. Comprenez bien le concept",
                "3. Pratiquez avec les exercices",
                "4. Testez votre maîtrise",
                "5. Validez votre apprentissage"
            ]
        }
        
        return session_data
    
    @staticmethod
    def _get_related_exercises(revision_item, limit=5):
        """Obtenir les exercices connexes"""
        if revision_item.related_exercises:
            return revision_item.related_exercises
        
        # Chercher les exercices liés au concept ET au niveau de l'élève
        exercises = Exercise.objects.filter(
            Q(lesson__course__level=revision_item.student.level),
            Q(lesson__title__icontains=revision_item.concept) |
            Q(title__icontains=revision_item.concept) |
            Q(description__icontains=revision_item.concept)
        ).values('id', 'title', 'difficulty')[:limit]
        
        exercise_list = list(exercises)
        
        # Sauvegarder pour la prochaine fois
        revision_item.related_exercises = [e['id'] for e in exercise_list]
        revision_item.save()
        
        return exercise_list
    
    @staticmethod
    def _get_related_lessons(revision_item, limit=3):
        """Obtenir les leçons connexes"""
        if revision_item.related_lessons:
            return revision_item.related_lessons
        
        # Chercher les leçons liées au niveau de l'élève
        lessons = Lesson.objects.filter(
            course__level=revision_item.student.level,
            title__icontains=revision_item.concept.split()[0]
        ).values('id', 'title', 'course__title')[:limit]
        
        lesson_list = list(lessons)
        
        # Sauvegarder
        revision_item.related_lessons = [l['id'] for l in lesson_list]
        revision_item.save()
        
        return lesson_list
    
    @staticmethod
    def _get_revision_tips(revision_item):
        """Obtenir des conseils de révision"""
        tips = revision_item.custom_tips or []
        
        # Ajouter des conseils génériques s'il n'y en a pas
        if not tips:
            tips = [
                "Commencez par comprendre le concept",
                "Consultez des exemples concrets",
                "Pratiquez progressivement",
                "Testez-vous régulièrement"
            ]
        
        return tips
    
    @staticmethod
    def complete_revision_session(revision_item, mastery_score):
        """
        Compléter une session de révision
        
        Args:
            revision_item: IntelligentRevisionItem instance
            mastery_score: Score de maîtrise (0-100)
        """
        revision_item.revision_attempts += 1
        revision_item.mastery_score = mastery_score
        
        if mastery_score >= 75:
            # Concept maîtrisé
            revision_item.status = 'mastered'
            revision_item.completed_at = datetime.now()
            logger.info(f"Concept mastered: {revision_item.concept} for {revision_item.student.email}")
        elif mastery_score >= 50:
            # Progrès
            revision_item.status = 'in_progress'
            logger.info(f"Progress made: {revision_item.concept} score={mastery_score}")
        else:
            # Besoin de plus de travail
            revision_item.status = 'recommended'
            revision_item.priority_score = min(revision_item.priority_score + 0.1, 1.0)
        
        revision_item.save()
        
        return {
            'status': revision_item.status,
            'mastery_score': mastery_score,
            'message': IntelligentRevisionEngine._get_completion_message(mastery_score),
            'next_steps': IntelligentRevisionEngine._get_next_steps(revision_item, mastery_score)
        }
    
    @staticmethod
    def _get_completion_message(mastery_score):
        """Obtenir un message basé sur le score"""
        if mastery_score >= 90:
            return "🌟 Excellent! Vous avez parfaitement compris ce concept!"
        elif mastery_score >= 75:
            return "✅ Très bien! Ce concept est maintenant maîtrisé."
        elif mastery_score >= 50:
            return "📚 Bon début! Continuez la pratique pour mieux maîtriser."
        else:
            return "💪 Pas encore! Révisez et essayez à nouveau."
    
    @staticmethod
    def _get_next_steps(revision_item, mastery_score):
        """Obtenir les prochaines étapes"""
        steps = []
        
        if mastery_score >= 75:
            steps.append(f"Passez au concept suivant: {IntelligentRevisionEngine._get_next_concept(revision_item.student)}")
            steps.append("Vous pouvez maintenant essayer des exercices plus difficiles")
        else:
            steps.append(f"Révisez à nouveau: {revision_item.concept}")
            steps.append("Essayez les exercices recommandés")
            steps.append("Utilisez les conseils fournis")
        
        return steps
    
    @staticmethod
    def _get_next_concept(student):
        """Obtenir le prochain concept à apprendre"""
        # Chercher le prochain item de révision
        next_item = IntelligentRevisionItem.objects.filter(
            student=student,
            status__in=['recommended', 'in_progress']
        ).order_by('-priority_score').first()
        
        if next_item:
            return next_item.concept
        else:
            return "un nouveau défi plus difficile"


class RevisionProgressTracker:
    """Suivi de la progression en révision"""
    
    @staticmethod
    def get_revision_progress(student):
        """
        Obtenir la progression de révision d'un étudiant
        
        Returns:
            dict avec statistiques détaillées
        """
        revision_items = IntelligentRevisionItem.objects.filter(student=student)
        
        if not revision_items.exists():
            return {
                'total_items': 0,
                'progress': 0,
                'status': 'no_revision'
            }
        
        total = revision_items.count()
        completed = revision_items.filter(status='mastered').count()
        in_progress = revision_items.filter(status='in_progress').count()
        recommended = revision_items.filter(status='recommended').count()
        
        progress_percentage = (completed / total * 100) if total > 0 else 0
        
        # Concepts à réviser en priorité
        priority_concepts = revision_items.filter(
            status__in=['recommended', 'in_progress']
        ).order_by('-priority_score')[:5].values('concept', 'priority_score', 'error_count')
        
        # Concepts maîtrisés
        mastered_concepts = revision_items.filter(
            status='mastered'
        ).order_by('-completed_at').values('concept', 'mastery_score')[:5]
        
        # Estimations
        avg_mastery = revision_items.filter(status='mastered').aggregate(
            avg=Avg('mastery_score')
        )['avg'] or 0
        
        return {
            'total_items': total,
            'completed': completed,
            'in_progress': in_progress,
            'recommended': recommended,
            'progress_percentage': progress_percentage,
            'priority_concepts': list(priority_concepts),
            'mastered_concepts': list(mastered_concepts),
            'average_mastery_score': avg_mastery,
            'estimated_days_to_completion': RevisionProgressTracker._estimate_completion_time(
                remaining=recommended, in_progress=in_progress, avg_mastery=avg_mastery
            )
        }
    
    @staticmethod
    def _estimate_completion_time(remaining, in_progress, avg_mastery):
        """Estimer le temps jusqu'à la maîtrise"""
        # Heuristique simple: 5 jours par concept si nouveau, 2 si en cours
        estimated_days = (remaining * 5) + (in_progress * 2)
        
        # Ajuster selon la progression
        if avg_mastery > 70:
            estimated_days *= 0.8
        elif avg_mastery < 50:
            estimated_days *= 1.2
        
        return max(int(estimated_days), 1)
    
    @staticmethod
    def get_revision_effectiveness(student, days_back=30):
        """
        Analyser l'efficacité de la révision
        
        Returns:
            Rapport sur les améliorations
        """
        cutoff_date = datetime.now() - timedelta(days=days_back)
        
        # Récupérer les items complétés récemment
        completed_items = IntelligentRevisionItem.objects.filter(
            student=student,
            completed_at__gte=cutoff_date
        )
        
        if not completed_items.exists():
            return {
                'effectiveness': 'insufficient_data',
                'report': 'Pas assez de données de révision'
            }
        
        # Analyser les améliorations
        total_completed = completed_items.count()
        avg_attempts = completed_items.aggregate(avg=Avg('revision_attempts'))['avg']
        avg_mastery = completed_items.aggregate(avg=Avg('mastery_score'))['avg']
        
        # Calculer l'amélioration vs erreurs passées
        improvement_items = []
        for item in completed_items:
            past_errors = ErrorAnalysis.objects.filter(
                student=student,
                concept_involved__icontains=item.concept.split()[0],
                created_at__lt=item.created_at
            ).count()
            
            new_errors = ErrorAnalysis.objects.filter(
                student=student,
                concept_involved__icontains=item.concept.split()[0],
                created_at__gte=item.created_at
            ).count()
            
            improvement_items.append({
                'concept': item.concept,
                'past_errors': past_errors,
                'new_errors': new_errors,
                'improvement': (past_errors - new_errors) / max(past_errors, 1) * 100 if past_errors > 0 else 100
            })
        
        total_improvement = sum(i['improvement'] for i in improvement_items) / len(improvement_items) if improvement_items else 0
        
        return {
            'period_days': days_back,
            'concepts_revised': total_completed,
            'average_attempts_per_concept': round(avg_attempts, 1),
            'average_mastery_score': round(avg_mastery, 1),
            'overall_improvement_percentage': round(total_improvement, 1),
            'concepts_improved': improvement_items,
            'effectiveness_rating': RevisionProgressTracker._rate_effectiveness(
                total_improvement, avg_mastery, avg_attempts
            )
        }
    
    @staticmethod
    def _rate_effectiveness(improvement, mastery, attempts):
        """Évaluer l'efficacité de la révision"""
        score = 0
        
        if improvement > 80:
            score += 30
        elif improvement > 50:
            score += 20
        elif improvement > 0:
            score += 10
        
        if mastery > 80:
            score += 30
        elif mastery > 70:
            score += 20
        elif mastery > 60:
            score += 10
        
        if attempts <= 2:
            score += 40
        elif attempts <= 3:
            score += 30
        elif attempts <= 5:
            score += 20
        
        if score >= 80:
            return "Très efficace - Continuez!"
        elif score >= 60:
            return "Efficace - Progressez bien"
        elif score >= 40:
            return "Acceptable - Plus de pratique nécessaire"
        else:
            return "Besoin d'amélioration - Changez de stratégie"


class AdaptiveRevisionScheduler:
    """Planificateur adaptatif de révision"""
    
    @staticmethod
    def recommend_revision_timing(student, concept):
        """
        Recommander quand réviser un concept
        
        Basé sur la courbe d'oubli de Ebbinghaus
        """
        revision_item = IntelligentRevisionItem.objects.filter(
            student=student,
            concept=concept
        ).first()
        
        if not revision_item:
            return {
                'recommend_now': True,
                'reason': 'Premier concept identifié'
            }
        
        if revision_item.status == 'mastered':
            # Révision de maintenance
            days_since_mastery = (datetime.now() - revision_item.completed_at).days
            
            if days_since_mastery > 30:
                return {
                    'recommend_now': True,
                    'reason': 'Révision de maintenance après 30 jours',
                    'type': 'maintenance'
                }
            else:
                return {
                    'recommend_now': False,
                    'days_until_revision': max(30 - days_since_mastery, 0),
                    'type': 'maintenance'
                }
        
        else:
            # Révision pour apprentissage
            if revision_item.revision_attempts == 0:
                return {
                    'recommend_now': True,
                    'reason': 'Première révision recommandée',
                    'type': 'learning'
                }
            
            days_since_last_attempt = (datetime.now() - revision_item.updated_at).days
            next_interval = AdaptiveRevisionScheduler._calculate_interval(
                revision_item.revision_attempts, revision_item.mastery_score
            )
            
            if days_since_last_attempt >= next_interval:
                return {
                    'recommend_now': True,
                    'reason': f'Interval {next_interval} jours dépassé',
                    'type': 'learning'
                }
            else:
                return {
                    'recommend_now': False,
                    'days_until_revision': next_interval - days_since_last_attempt,
                    'type': 'learning'
                }
    
    @staticmethod
    def _calculate_interval(attempt_count, mastery_score):
        """Calculer l'intervalle de révision selon Ebbinghaus"""
        # Intervalles: 1, 3, 7, 14, 30 jours
        intervals = [1, 3, 7, 14, 30]
        
        # Ajuster selon le score
        attempt_index = min(attempt_count, len(intervals) - 1)
        base_interval = intervals[attempt_index]
        
        # Réduire l'intervalle si le score est bas
        if mastery_score < 60:
            return max(1, int(base_interval * 0.5))
        elif mastery_score < 75:
            return int(base_interval * 0.8)
        else:
            return base_interval
