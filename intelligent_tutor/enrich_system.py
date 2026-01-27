#!/usr/bin/env python
"""
Script enrichissement super puissant pour adapter le système au contexte burkinabè
- Import des exercices IA générés
- Enrichissement des cours avec du contenu local et culturel
- Création de ressources adaptées au Burkina Faso
"""
import os
import sys
import django
import json
from collections import defaultdict

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.courses.models import Subject, Course, Lesson
from apps.exercises.models import ExerciseCategory, Exercise
from django.utils.text import slugify


# Données contextualisées pour Burkina Faso
BURKINA_CONTEXT = {
    'math': {
        'examples': [
            'Un commerçant à Ouagadougou vend du riz. Il achète 50 kg à 5000 F/kg...',
            'Dans un marché de Bobo-Dioulasso, une femme vend du lait. Si elle vend...',
            'Un fermier de Fada cultive du coton. Sa récolte est de 200 kg...',
            'Un taxi à Ouaga consomme 8 litres pour 100 km. Le carburant coûte 680F/L...',
            'Dans une école, il y a 450 élèves. 60% sont en primaire...',
        ],
        'subjects': ['Calcul', 'Géométrie', 'Algèbre', 'Statistiques', 'Problèmes pratiques']
    },
    'french': {
        'themes': [
            'La vie quotidienne au Burkina Faso',
            'Les traditions et la culture burkinabè',
            'La famille et les valeurs sociales',
            'L\'environnement et la nature',
            'Les métiers et l\'économie locale',
            'La grammaire à travers les exemples burkinabè',
            'La littérature africaine et burkinabè',
            'Les droits et devoirs du citoyen',
        ],
        'vocabulary': {
            'greetings': ['Bonjour', 'Bonsoir', 'Bienvenue', 'À bientôt'],
            'daily': ['marché', 'case', 'village', 'brousse', 'sahel', 'savane', 'griot', 'tam-tam'],
            'cultural': ['famille élargie', 'chef de famille', 'aîné', 'respect des aînés', 'hospitalité']
        }
    },
    'science': {
        'topics': [
            'Le climat du Sahel et ses changements',
            'La biodiversité du Burkina Faso',
            'L\'agriculture et l\'élevage local',
            'L\'eau et les ressources naturelles',
            'La santé et l\'hygiène',
            'L\'énergie solaire (abondante au BF)',
            'La prévention des maladies tropicales',
            'L\'environnement et la désertification',
        ],
        'practical': [
            'Comment cultiver du sorgho résistant à la sécheresse?',
            'Comment purifier l\'eau pour la boisson?',
            'Comment utiliser l\'énergie solaire à la maison?',
            'Comment lutter contre les feux de brousse?',
        ]
    },
    'history': {
        'topics': [
            'Les anciens royaumes du Burkina Faso',
            'Le Mossi et ses traditions',
            'La colonisation et l\'indépendance',
            'Les figures importantes du Burkina',
            'Les révolutions et les changements',
            'La culture et l\'art burkinabè',
        ]
    },
    'geography': {
        'topics': [
            'Les régions du Burkina Faso',
            'Les fleuves et les ressources en eau',
            'Les zones climatiques',
            'Les activités économiques régionales',
            'Les villes principales',
            'Les frontières et les pays voisins',
            'Les transports et les routes',
        ]
    }
}


def import_ai_generated_exercises():
    """Importe les exercices générés par IA"""
    print("\n📝 Importation des exercices générés par IA...")
    
    try:
        with open('ai_generated_exercises.json', 'r', encoding='utf-8') as f:
            exercises_data = json.load(f)
    except FileNotFoundError:
        print("   ⚠️  Fichier ai_generated_exercises.json non trouvé")
        return 0
    
    count = 0
    
    # Récupère ou crée une leçon générique pour les exercices importés
    course = Course.objects.first()
    if not course:
        print("   ⚠️  Aucun cours disponible")
        return 0
    
    lesson, _ = Lesson.objects.get_or_create(
        course=course,
        title='Exercices générés par IA',
        defaults={
            'description': 'Exercices créés automatiquement par IA',
            'content': 'Exercices pratiques générés',
            'order': 999,
            'duration_minutes': 30
        }
    )
    
    for exercise_data in exercises_data:
        subject_name = exercise_data.get('subject', 'general')
        
        # Récupère la catégorie
        category, _ = ExerciseCategory.objects.get_or_create(
            name=exercise_data.get('category', subject_name),
            defaults={'description': f'Exercices de {subject_name}'}
        )
        
        # Crée l'exercice
        exercise, created = Exercise.objects.get_or_create(
            title=exercise_data.get('title', f'Exercice {count}'),
            lesson=lesson,
            defaults={
                'category': category,
                'description': exercise_data.get('description', ''),
                'question': exercise_data.get('question', exercise_data.get('content', '')),
                'correct_answer': exercise_data.get('correct_answer', ''),
                'type': 'multiple_choice',
                'difficulty': exercise_data.get('difficulty', 3),
                'points': exercise_data.get('points', 10),
            }
        )
        
        if created:
            count += 1
    
    print(f"   ✅ {count} exercices importés")
    return count


def enrich_courses_with_context():
    """Enrichit les cours avec du contenu adapté au Burkina Faso"""
    print("\n🌍 Enrichissement des cours avec contexte burkinabè...")
    
    count = 0
    
    # Traite les cours par matière
    for course in Course.objects.all():
        subject = course.subject.name.lower()
        
        # Enrichit les leçons existantes
        for lesson in course.lessons.all():
            if lesson.content and 'FASO' in lesson.content:
                # Ajoute du contenu contextualisé
                if 'math' in subject:
                    lesson.content += f"\n\n📍 Contexte local:\n{BURKINA_CONTEXT['math']['examples'][count % 5]}"
                elif 'français' in subject or 'french' in subject:
                    lesson.content += f"\n\n🌍 Thème local: {BURKINA_CONTEXT['french']['themes'][count % len(BURKINA_CONTEXT['french']['themes'])]}"
                elif 'science' in subject:
                    lesson.content += f"\n\n🔬 Sujet pratique: {BURKINA_CONTEXT['science']['practical'][count % len(BURKINA_CONTEXT['science']['practical'])]}"
                
                lesson.save()
                count += 1
    
    print(f"   ✅ {count} leçons enrichies")
    return count


def create_cultural_content():
    """Crée du contenu spécifiquement culturel et local"""
    print("\n🏛️  Création de contenu culturel burkinabè...")
    
    count = 0
    
    # Crée des cours spécialisés sur la culture burkinabè
    for subject_name, context in [
        ('Français', 'french'),
        ('Histoire', 'history'),
        ('Géographie', 'geography'),
    ]:
        subject, _ = Subject.objects.get_or_create(
            name=subject_name,
            defaults={'description': f'{subject_name} - Burkina Faso'}
        )
        
        course_title = f"{subject_name} et culture burkinabè"
        course, created = Course.objects.get_or_create(
            title=course_title,
            subject=subject,
            level='primary_cm2',
            defaults={
                'description': f'Apprentissage du {subject_name.lower()} à travers la culture locale',
                'status': 'published'
            }
        )
        
        if created:
            # Ajoute des leçons thématiques
            for idx, topic in enumerate(BURKINA_CONTEXT[context].get('topics', [])[:3], 1):
                lesson, _ = Lesson.objects.get_or_create(
                    course=course,
                    title=topic,
                    defaults={
                        'description': f'Leçon sur {topic}',
                        'content': f"""
# {topic}

## Objectifs d'apprentissage:
- Comprendre les aspects importants de {topic}
- Découvrir la richesse culturelle du Burkina Faso
- Appliquer ces connaissances dans la vie quotidienne

## Contenu:
Le Burkina Faso est un pays riche en histoire, culture et traditions. 
{topic} est un élément clé de notre identité nationale.

## Ressources locales:
- Entretiens avec les anciens du village
- Proverbes et histoires traditionnelles
- Exemples concrets de la communauté locale
""",
                        'order': idx,
                        'duration_minutes': 45
                    }
                )
                count += 1
    
    print(f"   ✅ {count} leçons culturelles créées")
    return count


def create_practical_exercises():
    """Crée des exercices pratiques adaptés au contexte burkinabè"""
    print("\n⚙️  Création d'exercices pratiques...")
    
    count = 0
    
    practical_exercises = [
        {
            'title': 'Calcul du rendement agricole',
            'subject': 'Mathématiques',
            'description': 'Un fermier burkinabè récolte 500 kg de maïs sur 2 hectares',
            'question': 'Calcule le rendement en kg/ha et estime la récolte sur 5 hectares',
            'correct_answer': '250 kg/ha, 1250 kg pour 5 ha',
            'difficulty': 2,
            'type': 'short_answer'
        },
        {
            'title': 'Composition d\'une lettre formelle',
            'subject': 'Français',
            'description': 'Écris une lettre au chef de village',
            'question': 'Rédige une lettre formelle en respectant les conventions françaises',
            'correct_answer': 'Lieu et date, appel, corps, formule de politesse, signature',
            'difficulty': 2,
            'type': 'essay'
        },
        {
            'title': 'Cycle de l\'eau en climat sahélien',
            'subject': 'Sciences',
            'description': 'Explique l\'importance de la pluie au Burkina Faso',
            'question': 'Décris les différentes étapes du cycle de l\'eau spécifique au Sahel',
            'correct_answer': 'Évaporation, condensation, précipitation, infiltration, ruissellement',
            'difficulty': 2,
            'type': 'essay'
        },
        {
            'title': 'Les royaumes Mossi',
            'subject': 'Histoire',
            'description': 'Questions sur les anciens royaumes du Burkina',
            'question': 'Quels sont les trois principaux royaumes Mossi historiques?',
            'correct_answer': 'Ouagadougou, Bobo-Dioulasso, Gourma',
            'difficulty': 1,
            'type': 'multiple_choice'
        },
        {
            'title': 'Positions géographiques des villes',
            'subject': 'Géographie',
            'description': 'Situe les villes principales sur une carte',
            'question': 'Localise Ouagadougou, Bobo-Dioulasso, Gaoua et Dori',
            'correct_answer': 'Centre, Ouest, Sud-ouest, Nord',
            'difficulty': 1,
            'type': 'matching'
        }
    ]
    
    for exercise_data in practical_exercises:
        subject, _ = Subject.objects.get_or_create(
            name=exercise_data['subject'],
            defaults={'description': exercise_data['subject']}
        )
        
        # Récupère le premier cours pour cette matière
        course = subject.courses.first()
        if not course:
            continue
        
        # Récupère la première leçon
        lesson = course.lessons.first()
        if not lesson:
            lesson, _ = Lesson.objects.get_or_create(
                course=course,
                title=f'Leçons pratiques - {exercise_data["subject"]}',
                defaults={
                    'description': f'Exercices pratiques de {exercise_data["subject"]}',
                    'content': 'Exercices contextualisés au Burkina Faso',
                    'order': 1,
                    'duration_minutes': 30
                }
            )
        
        category, _ = ExerciseCategory.objects.get_or_create(
            name=f"Pratique - {exercise_data['subject']}",
            defaults={'description': f'Exercices pratiques de {exercise_data["subject"]}'}
        )
        
        exercise, created = Exercise.objects.get_or_create(
            title=exercise_data['title'],
            lesson=lesson,
            defaults={
                'category': category,
                'description': exercise_data['description'],
                'question': exercise_data['question'],
                'correct_answer': exercise_data['correct_answer'],
                'type': exercise_data['type'],
                'difficulty': exercise_data['difficulty'],
                'points': exercise_data['difficulty'] * 10
            }
        )
        
        if created:
            count += 1
    
    print(f"   ✅ {count} exercices pratiques créés")
    return count


def display_final_stats():
    """Affiche les statistiques finales du système"""
    print("\n" + "="*70)
    print("📊 STATISTIQUES FINALES DU SYSTÈME")
    print("="*70)
    
    print(f"\n📚 Cours: {Course.objects.count()}")
    print(f"📖 Leçons: {Lesson.objects.all().count()}")
    print(f"✏️  Exercices: {Exercise.objects.count()}")
    print(f"📂 Catégories: {ExerciseCategory.objects.count()}")
    print(f"🎓 Matières: {Subject.objects.count()}")
    
    print(f"\n" + "="*70)
    print("✅ SYSTÈME ENRICHI ET PRÊT!")
    print("="*70)


def main():
    """Fonction principale"""
    print("="*70)
    print("🚀 ENRICHISSEMENT SUPER PUISSANT POUR BURKINA FASO")
    print("="*70)
    
    stats = {
        'ai_exercises': import_ai_generated_exercises(),
        'enriched_lessons': enrich_courses_with_context(),
        'cultural_content': create_cultural_content(),
        'practical_exercises': create_practical_exercises(),
    }
    
    print(f"\n" + "="*70)
    print("📊 RÉSUMÉ DE L'ENRICHISSEMENT")
    print("="*70)
    print(f"✅ Exercices IA importés: {stats['ai_exercises']}")
    print(f"✅ Leçons enrichies: {stats['enriched_lessons']}")
    print(f"✅ Leçons culturelles créées: {stats['cultural_content']}")
    print(f"✅ Exercices pratiques: {stats['practical_exercises']}")
    
    display_final_stats()


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
