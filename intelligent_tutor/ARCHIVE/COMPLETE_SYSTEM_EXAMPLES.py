"""
EXEMPLES PRATIQUES - SYSTÈME D'ANALYSE D'ERREURS & RÉVISION

10 exemples pour utiliser le nouveau système complet.
"""

# ============================================================================
# EXEMPLE 1: Analyser une erreur quand un étudiant se trompe
# ============================================================================

def exemple_1_analyser_erreur():
    """
    Quand un étudiant soumet une réponse incorrecte, l'analyser automatiquement
    """
    from django.contrib.auth import get_user_model
    from apps.exercises.models import ExerciseAttempt
    from apps.recommendations.error_analysis import ErrorAnalyzer
    
    User = get_user_model()
    
    # Simuler: étudiant répond mal
    student = User.objects.get(email='hassan@example.com')
    attempt = ExerciseAttempt.objects.create(
        student=student,
        exercise_id=5,
        student_answer="25",  # Mauvaise réponse
        is_correct=False,
        status='submitted'
    )
    
    # Analyser l'erreur
    analysis = ErrorAnalyzer.analyze_attempt(attempt)
    
    if analysis:
        print(f"""
        ✗ ANALYSE DE L'ERREUR
        ├─ Type: {analysis.error_type}
        ├─ Concept: {analysis.concept_involved}
        ├─ Misconception: {analysis.misconception_identified}
        ├─ Cause: {analysis.root_cause}
        ├─ Compréhension: {analysis.concept_understanding_level}
        └─ Suggestions: {', '.join(analysis.suggested_topics)}
        """)
        
        return analysis


# ============================================================================
# EXEMPLE 2: Générer une explication personnalisée pour l'erreur
# ============================================================================

def exemple_2_generer_explication():
    """
    Générer une explication personnalisée pour l'erreur
    """
    from apps.exercises.models import ExerciseAttempt
    from apps.recommendations.error_analysis import ErrorAnalyzer
    from apps.recommendations.explanation_generator import ExplanationGenerator
    
    # Récupérer la dernière tentative incorrecte
    attempt = ExerciseAttempt.objects.filter(is_correct=False).latest('created_at')
    
    # Analyser
    error_analysis = ErrorAnalyzer.analyze_attempt(attempt)
    
    # Générer explication intelligente
    explanation = ExplanationGenerator.generate_explanation(attempt, error_analysis)
    
    print(f"""
    💡 EXPLICATION GÉNÉRÉE
    ├─ Type: {explanation.explanation_type}
    ├─ Utilise exemples: {'Oui' if explanation.uses_examples else 'Non'}
    ├─ Utilise analogies: {'Oui' if explanation.uses_analogies else 'Non'}
    └─ Contenu (premiers 300 caractères):
    
    {explanation.content[:300]}...
    """)
    
    return explanation


# ============================================================================
# EXEMPLE 3: Analyser les patterns d'erreurs d'un étudiant
# ============================================================================

def exemple_3_analyser_patterns():
    """
    Identifier les patterns d'erreurs récurrentes
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.error_analysis import ErrorPatternAnalyzer
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    # Analyser les 30 derniers jours
    patterns = ErrorPatternAnalyzer.analyze_student_patterns(student, days_back=30)
    
    print(f"""
    📊 PATTERNS D'ERREURS (30 jours)
    ├─ Taux d'erreur: {patterns['patterns']['error_rate']:.1f}%
    ├─ Type principal: {patterns['patterns']['most_common_error_type']}
    ├─ Total erreurs: {patterns['patterns']['total_errors']}
    │
    ├─ CONCEPTS PROBLÉMATIQUES:
    """)
    
    for concept in patterns['patterns']['problem_concepts'][:3]:
        print(f"    ├─ {concept['concept_involved']}: {concept['count']} erreurs")
    
    print(f"""
    │
    └─ RECOMMANDATIONS:
    """)
    
    for rec in patterns['recommendations'][:3]:
        print(f"    ├─ [{rec['priority']}] {rec['message']}")
    
    return patterns


# ============================================================================
# EXEMPLE 4: Créer un plan de révision personnalisé
# ============================================================================

def exemple_4_creer_plan_revision():
    """
    Créer un plan de révision basé sur les erreurs passées
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.revision_system import IntelligentRevisionEngine
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    # Créer un plan personnalisé (max 10 concepts)
    revision_plan = IntelligentRevisionEngine.create_revision_plan(student, limit=10)
    
    print(f"""
    📚 PLAN DE RÉVISION PERSONNALISÉ
    └─ {len(revision_plan)} concepts à réviser
    """)
    
    for i, item in enumerate(revision_plan, 1):
        print(f"""
    {i}. {item.concept}
       ├─ Priorité: {item.priority_score:.0%}
       ├─ Erreurs: {item.error_count} fois
       ├─ Status: {item.status}
       └─ Essayer: Exercices {item.related_exercises[:2]}
        """)
    
    return revision_plan


# ============================================================================
# EXEMPLE 5: Démarrer une session de révision
# ============================================================================

def exemple_5_demarrer_session():
    """
    Démarrer une session de révision avec ressources
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.models import IntelligentRevisionItem
    from apps.recommendations.revision_system import IntelligentRevisionEngine
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    # Récupérer le premier item de révision
    revision_item = IntelligentRevisionItem.objects.filter(
        student=student,
        status='recommended'
    ).first()
    
    if revision_item:
        # Démarrer la session
        session = IntelligentRevisionEngine.start_revision_session(revision_item)
        
        print(f"""
        🎯 SESSION DE RÉVISION DÉMARRÉE
        ├─ Concept: {session['concept']}
        ├─ Priorité: {session['priority']:.0%}
        ├─ Raison: {session['reason']}
        │
        ├─ RESSOURCES RECOMMANDÉES:
        """)
        
        print(f"    ├─ Exercices: {session['recommended_exercises']}")
        print(f"    ├─ Leçons: {session['recommended_lessons']}")
        print(f"    └─ Tips: {', '.join(session['custom_tips'][:2])}")
        
        print(f"""
        │
        └─ ÉTAPES:
        """)
        for step in session['instructions']:
            print(f"    {step}")
        
        return session


# ============================================================================
# EXEMPLE 6: Compléter une session de révision avec score
# ============================================================================

def exemple_6_completer_session():
    """
    Compléter une session quand l'étudiant a fini de réviser
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.models import IntelligentRevisionItem
    from apps.recommendations.revision_system import IntelligentRevisionEngine
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    # Récupérer le premier item en cours
    revision_item = IntelligentRevisionItem.objects.filter(
        student=student,
        status='in_progress'
    ).first()
    
    if revision_item:
        # Simuler: étudiant a obtenu 85% en révision
        mastery_score = 85
        
        result = IntelligentRevisionEngine.complete_revision_session(
            revision_item, mastery_score
        )
        
        print(f"""
        ✅ SESSION COMPLÉTÉE
        ├─ Concept: {revision_item.concept}
        ├─ Score de maîtrise: {mastery_score}%
        ├─ Statut: {result['status']}
        ├─ Message: {result['message']}
        └─ Prochaines étapes:
        """)
        
        for step in result['next_steps']:
            print(f"    ├─ {step}")
        
        return result


# ============================================================================
# EXEMPLE 7: Suivre la progression globale de révision
# ============================================================================

def exemple_7_suivre_progression():
    """
    Voir la progression globale en révision
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.revision_system import RevisionProgressTracker
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    progress = RevisionProgressTracker.get_revision_progress(student)
    
    print(f"""
    📈 PROGRESSION EN RÉVISION
    ├─ Total concepts: {progress['total_items']}
    ├─ Maîtrisés: {progress['completed']} ({progress['completed']/max(progress['total_items'], 1)*100:.0f}%)
    ├─ En cours: {progress['in_progress']}
    ├─ À faire: {progress['recommended']}
    ├─ Score moyen: {progress['average_mastery_score']:.0f}%
    └─ Jours estimés: {progress['estimated_days_to_completion']} jours
    """)
    
    print("\n    CONCEPTS PRIORITAIRES À RÉVISER:")
    for concept in progress['priority_concepts'][:3]:
        print(f"        ├─ {concept['concept']}: priorité {concept['priority_score']:.0%}")
    
    print("\n    CONCEPTS MAÎTRISÉS:")
    for concept in progress['mastered_concepts'][:3]:
        print(f"        ├─ {concept['concept']}: {concept['mastery_score']:.0f}%")
    
    return progress


# ============================================================================
# EXEMPLE 8: Analyser l'efficacité de la révision
# ============================================================================

def exemple_8_efficacite_revision():
    """
    Analyser si la révision fonctionne (moins d'erreurs?)
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.revision_system import RevisionProgressTracker
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    # Analyser les 30 derniers jours
    effectiveness = RevisionProgressTracker.get_revision_effectiveness(student, days_back=30)
    
    print(f"""
    🎯 EFFICACITÉ DE LA RÉVISION (30 jours)
    ├─ Concepts révisés: {effectiveness['concepts_revised']}
    ├─ Tentatives moyennes: {effectiveness['average_attempts_per_concept']:.1f}
    ├─ Score moyen: {effectiveness['average_mastery_score']:.0f}%
    ├─ Amélioration globale: {effectiveness['overall_improvement_percentage']:.1f}%
    └─ Rating: {effectiveness['effectiveness_rating']}
    """)
    
    print("\n    DÉTAIL PAR CONCEPT:")
    for concept in effectiveness['concepts_improved'][:3]:
        print(f"""
        {concept['concept']}
        ├─ Erreurs avant: {concept['past_errors']}
        ├─ Erreurs après: {concept['new_errors']}
        └─ Amélioration: {concept['improvement']:.0f}%
        """)
    
    return effectiveness


# ============================================================================
# EXEMPLE 9: Vérifier quand réviser un concept (courbe Ebbinghaus)
# ============================================================================

def exemple_9_timing_revision():
    """
    Obtenir le timing recommandé pour réviser un concept
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.revision_system import AdaptiveRevisionScheduler
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    concept = "Ordre des opérations"
    
    timing = AdaptiveRevisionScheduler.recommend_revision_timing(student, concept)
    
    if timing['recommend_now']:
        print(f"""
        ⏰ RÉVISER MAINTENANT!
        ├─ Concept: {concept}
        ├─ Raison: {timing['reason']}
        └─ Type: {timing.get('type', 'apprentissage')}
        """)
    else:
        print(f"""
        ⏰ RÉVISION PROGRAMMÉE
        ├─ Concept: {concept}
        ├─ Jours avant révision: {timing['days_until_revision']}
        └─ Type: {timing.get('type', 'apprentissage')}
        """)
    
    return timing


# ============================================================================
# EXEMPLE 10: Rapport détaillé des erreurs d'un étudiant
# ============================================================================

def exemple_10_rapport_erreurs():
    """
    Générer un rapport complet sur les erreurs et l'analyse
    """
    from django.contrib.auth import get_user_model
    from apps.recommendations.error_analysis import DetailedErrorReport
    
    User = get_user_model()
    student = User.objects.get(email='hassan@example.com')
    
    # Rapport sur 30 jours
    report = DetailedErrorReport.generate_report(student, days_back=30)
    
    print(f"""
    📋 RAPPORT DÉTAILLÉ DES ERREURS
    ├─ Période: 30 jours
    ├─ Total erreurs: {report['total_errors']}
    │
    ├─ DISTRIBUTION PAR TYPE:
    """)
    
    for error_type, data in report['by_error_type'].items():
        print(f"        ├─ {error_type}: {data['count']} ({data['percentage']:.0f}%)")
    
    print(f"""
    │
    ├─ CONCEPTS PROBLÉMATIQUES:
    """)
    
    for concept, data in list(report['by_concept'].items())[:5]:
        print(f"        ├─ {concept}: {data['error_count']} erreurs")
    
    print(f"""
    │
    └─ AIRES D'AMÉLIORATION:
    """)
    
    for area in report['improvement_areas'][:3]:
        print(f"        ├─ {area['concept']}: {area['recommendation']}")
    
    return report


# ============================================================================
# EXÉCUTION DES EXEMPLES
# ============================================================================

if __name__ == '__main__':
    print("=" * 80)
    print("EXEMPLES PRATIQUES - SYSTÈME D'ANALYSE D'ERREURS & RÉVISION")
    print("=" * 80)
    
    try:
        print("\n[1/10] Analyser une erreur...")
        exemple_1_analyser_erreur()
        
        print("\n[2/10] Générer une explication...")
        exemple_2_generer_explication()
        
        print("\n[3/10] Analyser les patterns...")
        exemple_3_analyser_patterns()
        
        print("\n[4/10] Créer un plan de révision...")
        exemple_4_creer_plan_revision()
        
        print("\n[5/10] Démarrer une session...")
        exemple_5_demarrer_session()
        
        print("\n[6/10] Compléter une session...")
        exemple_6_completer_session()
        
        print("\n[7/10] Suivre la progression...")
        exemple_7_suivre_progression()
        
        print("\n[8/10] Analyser l'efficacité...")
        exemple_8_efficacite_revision()
        
        print("\n[9/10] Vérifier le timing...")
        exemple_9_timing_revision()
        
        print("\n[10/10] Rapport d'erreurs...")
        exemple_10_rapport_erreurs()
        
        print("\n" + "=" * 80)
        print("✅ Tous les exemples exécutés avec succès!")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
