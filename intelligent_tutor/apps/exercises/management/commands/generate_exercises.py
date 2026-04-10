"""
Management command to generate exercises for all lessons.
Analyzes lesson content and creates contextual exercises adapted to level.
"""
import re
import random
from django.core.management.base import BaseCommand
from django.db.models import Count
from bs4 import BeautifulSoup
from apps.courses.models import Lesson, Course
from apps.exercises.models import Exercise, ExerciseCategory


# ─────────────────────────────────────────────
# EXERCISE TEMPLATES PER SUBJECT
# ─────────────────────────────────────────────

MATH_TEMPLATES = {
    'primary': [
        {
            'type': 'true_false',
            'tpl_q': '{statement}',
            'tpl_a': '{answer}',
            'gen': lambda kw, title: [
                {'q': f"En mathématiques, {kw[0] if kw else title} est une notion importante.", 'a': 'Vrai'},
                {'q': f"2 + 2 = 5.", 'a': 'Faux'},
                {'q': f"Le résultat de 3 × 2 est 6.", 'a': 'Vrai'},
            ]
        },
        {
            'type': 'fill_blank',
            'gen': lambda kw, title: [
                {'q': f"Complète : 5 + ___ = 10", 'a': '5', 'explanation': '5 + 5 = 10'},
                {'q': f"Complète : 3 × ___ = 9", 'a': '3', 'explanation': '3 × 3 = 9'},
            ]
        },
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Quel est le résultat de 7 + 8 ?",
                    'a': '15',
                    'options': ['13', '14', '15', '16'],
                    'explanation': '7 + 8 = 15'
                },
            ]
        },
    ],
    'secondary': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Dans le chapitre « {title} », quelle opération est fondamentale ?",
                    'a': "L'addition et la soustraction",
                    'options': ["L'addition et la soustraction", "La division uniquement", "La racine carrée", "Le logarithme"],
                    'explanation': "Les opérations de base sont fondamentales en mathématiques."
                },
            ]
        },
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Explique en une phrase ce que tu as appris dans « {title} ».", 'a': f"Cette leçon porte sur {kw[0] if kw else 'les mathématiques'}.", 'explanation': "Résume les points clés de la leçon."},
            ]
        },
    ],
    'lycee': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Concernant « {title} », quelle affirmation est correcte ?",
                    'a': f"C'est un concept fondamental en mathématiques",
                    'options': [f"C'est un concept fondamental en mathématiques", "Cela ne s'applique qu'en physique", "C'est un concept obsolète", "Cela n'a aucune application pratique"],
                    'explanation': f"« {title} » est un concept important du programme de mathématiques."
                },
            ]
        },
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Définis le concept principal abordé dans « {title} ».", 'a': f"Le concept principal de cette leçon est lié à {kw[0] if kw else 'les mathématiques'}.", 'explanation': "Utilise tes notes de cours pour formuler une définition claire."},
            ]
        },
    ],
}

FRENCH_TEMPLATES = {
    'primary': [
        {
            'type': 'true_false',
            'gen': lambda kw, title: [
                {'q': f"La leçon « {title} » fait partie du cours de français.", 'a': 'Vrai'},
                {'q': "On dit « bonjour » pour saluer quelqu'un le matin.", 'a': 'Vrai'},
                {'q': "Il est poli de couper la parole quand quelqu'un parle.", 'a': 'Faux'},
            ]
        },
        {
            'type': 'fill_blank',
            'gen': lambda kw, title: [
                {'q': "Complète : « Bon___ » est une formule de salutation.", 'a': 'jour', 'explanation': 'Bonjour est une salutation du matin.'},
                {'q': "Complète : On dit « s'il vous ___ » pour être poli.", 'a': 'plaît', 'explanation': "« S'il vous plaît » est une formule de politesse."},
            ]
        },
    ],
    'secondary': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Que signifie le mot « expression orale » ?",
                    'a': "Parler et s'exprimer à voix haute",
                    'options': ["Écrire un texte", "Parler et s'exprimer à voix haute", "Lire un livre en silence", "Dessiner"],
                    'explanation': "L'expression orale désigne la capacité de communiquer oralement."
                },
            ]
        },
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Résume en une phrase le thème de « {title} ».", 'a': "Cette leçon traite de " + (kw[0] if kw else "l'expression en français") + ".", 'explanation': "Formule une phrase claire et concise."},
            ]
        },
    ],
    'lycee': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Dans « {title} », quel est l'objectif principal ?",
                    'a': "Maîtriser les techniques d'analyse littéraire",
                    'options': ["Maîtriser les techniques d'analyse littéraire", "Apprendre à compter", "Étudier la géographie", "Faire du sport"],
                    'explanation': f"« {title} » vise à développer les compétences en analyse littéraire."
                },
            ]
        },
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Quels sont les éléments clés à retenir de « {title} » ?", 'a': f"Les éléments clés incluent {kw[0] if kw else 'la maîtrise de la langue française'}.", 'explanation': "Identifie les objectifs et les notions principales."},
            ]
        },
    ],
}

SCIENCE_TEMPLATES = {
    'primary': [
        {
            'type': 'true_false',
            'gen': lambda kw, title: [
                {'q': "L'eau est nécessaire à la vie des plantes.", 'a': 'Vrai'},
                {'q': "Le soleil tourne autour de la Terre.", 'a': 'Faux'},
                {'q': "Les plantes ont besoin de lumière pour grandir.", 'a': 'Vrai'},
            ]
        },
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': "Quel élément est indispensable aux êtres vivants ?",
                    'a': "L'eau",
                    'options': ["L'eau", "Le sable", "Le plastique", "Le métal"],
                    'explanation': "L'eau est essentielle à tous les êtres vivants."
                },
            ]
        },
    ],
    'secondary': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Dans la leçon « {title} », quel concept scientifique est central ?",
                    'a': "L'observation et l'expérimentation",
                    'options': ["L'observation et l'expérimentation", "La mémorisation uniquement", "Le calcul mental", "La lecture à voix haute"],
                    'explanation': "Les sciences reposent sur l'observation et l'expérimentation."
                },
            ]
        },
    ],
    'lycee': [
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Explique le principe scientifique étudié dans « {title} ».", 'a': f"Le principe étudié dans cette leçon concerne {kw[0] if kw else 'les sciences naturelles'}.", 'explanation': "Formule une explication claire basée sur le cours."},
            ]
        },
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Quelle méthode scientifique est utilisée dans « {title} » ?",
                    'a': "La méthode expérimentale",
                    'options': ["La méthode expérimentale", "La méthode artistique", "La méthode sportive", "La méthode culinaire"],
                    'explanation': "La méthode expérimentale est au cœur des sciences."
                },
            ]
        },
    ],
}

HISTORY_TEMPLATES = {
    'primary': [
        {
            'type': 'true_false',
            'gen': lambda kw, title: [
                {'q': "L'histoire nous permet de connaître le passé.", 'a': 'Vrai'},
                {'q': "Un siècle dure 50 ans.", 'a': 'Faux'},
                {'q': "La journée commence le matin.", 'a': 'Vrai'},
            ]
        },
        {
            'type': 'fill_blank',
            'gen': lambda kw, title: [
                {'q': "Un siècle dure ___ ans.", 'a': '100', 'explanation': 'Un siècle = 100 ans.'},
            ]
        },
    ],
    'secondary': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Que nous apprend la leçon « {title} » ?",
                    'a': "Des événements importants du passé",
                    'options': ["Des événements importants du passé", "Comment cuisiner", "Les règles du football", "La météo d'aujourd'hui"],
                    'explanation': "L'histoire étudie les événements passés pour comprendre le présent."
                },
            ]
        },
    ],
    'lycee': [
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Analyse les enjeux historiques présentés dans « {title} ».", 'a': "Les enjeux principaux portent sur " + (kw[0] if kw else "l'évolution historique") + ".", 'explanation': "Appuie-toi sur les dates et événements clés du cours."},
            ]
        },
    ],
}

GEOGRAPHY_TEMPLATES = {
    'primary': [
        {
            'type': 'true_false',
            'gen': lambda kw, title: [
                {'q': "Le Burkina Faso est un pays d'Afrique de l'Ouest.", 'a': 'Vrai'},
                {'q': "La capitale du Burkina Faso est Bobo-Dioulasso.", 'a': 'Faux'},
                {'q': "Ouagadougou est la capitale du Burkina Faso.", 'a': 'Vrai'},
            ]
        },
    ],
    'secondary': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': "Quelle est la capitale du Burkina Faso ?",
                    'a': "Ouagadougou",
                    'options': ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora"],
                    'explanation': "Ouagadougou est la capitale politique du Burkina Faso."
                },
            ]
        },
    ],
    'lycee': [
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Décris les enjeux géographiques abordés dans « {title} ».", 'a': f"Cette leçon aborde {kw[0] if kw else 'la géographie du Burkina Faso'}.", 'explanation': "Utilise les cartes et données du cours."},
            ]
        },
    ],
}

# Default templates for subjects without specific templates
DEFAULT_TEMPLATES = {
    'primary': [
        {
            'type': 'true_false',
            'gen': lambda kw, title: [
                {'q': f"La leçon « {title} » fait partie de ton programme scolaire.", 'a': 'Vrai'},
                {'q': f"Il est important de bien étudier pour réussir.", 'a': 'Vrai'},
            ]
        },
    ],
    'secondary': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"Quel est le sujet principal de « {title} » ?",
                    'a': f"Le sujet abordé dans cette leçon",
                    'options': [f"Le sujet abordé dans cette leçon", "La cuisine", "Le sport", "La musique"],
                    'explanation': f"Cette leçon traite de « {title} »."
                },
            ]
        },
    ],
    'lycee': [
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Résume les points essentiels de « {title} ».", 'a': f"Les points essentiels concernent le sujet principal de la leçon.", 'explanation': "Consulte tes notes de cours pour un résumé complet."},
            ]
        },
    ],
}

SUBJECT_TEMPLATES = {
    'math': MATH_TEMPLATES,
    'french': FRENCH_TEMPLATES,
    'science': SCIENCE_TEMPLATES,
    'history': HISTORY_TEMPLATES,
    'geography': GEOGRAPHY_TEMPLATES,
}

# English templates
ENGLISH_TEMPLATES = {
    'primary': [
        {
            'type': 'true_false',
            'gen': lambda kw, title: [
                {'q': "\"Hello\" means \"Bonjour\" in English.", 'a': 'Vrai'},
                {'q': "\"Goodbye\" means \"Bonjour\" in English.", 'a': 'Faux'},
                {'q': "English is a language spoken in many countries.", 'a': 'Vrai'},
            ]
        },
    ],
    'secondary': [
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"What is the main topic of the lesson \"{title}\"?",
                    'a': "Reading and comprehension",
                    'options': ["Reading and comprehension", "Cooking", "Sports", "Mathematics"],
                    'explanation': "This lesson focuses on English language skills."
                },
            ]
        },
        {
            'type': 'fill_blank',
            'gen': lambda kw, title: [
                {'q': "Complete: \"Good ___\" is a greeting used in the morning.", 'a': 'morning', 'explanation': "\"Good morning\" is a common English greeting."},
            ]
        },
    ],
    'lycee': [
        {
            'type': 'short_answer',
            'gen': lambda kw, title: [
                {'q': f"Summarize the key ideas from \"{title}\" in 2-3 sentences.", 'a': f"This lesson covers {kw[0] if kw else 'English language skills'}.", 'explanation': "Use your notes to write a clear summary."},
            ]
        },
        {
            'type': 'multiple_choice',
            'gen': lambda kw, title: [
                {
                    'q': f"In \"{title}\", what skill is primarily developed?",
                    'a': "Reading comprehension",
                    'options': ["Reading comprehension", "Physical education", "Art appreciation", "Calculation"],
                    'explanation': "English lessons at this level focus on comprehension and analysis."
                },
            ]
        },
    ],
}
SUBJECT_TEMPLATES['english'] = ENGLISH_TEMPLATES


def get_level_category(level):
    """Map level to category: primary, secondary, lycee."""
    if level.startswith('primary_'):
        return 'primary'
    elif level.startswith('secondary_'):
        return 'secondary'
    elif level.startswith('lycee_'):
        return 'lycee'
    return 'secondary'


def extract_keywords(content, title, max_keywords=5):
    """Extract keywords from lesson content."""
    if not content:
        return [title]
    
    soup = BeautifulSoup(content, 'html.parser')
    text = soup.get_text(separator=' ', strip=True)
    
    # Remove common filler words
    stopwords = {'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'et', 'en',
                 'à', 'au', 'aux', 'pour', 'par', 'sur', 'dans', 'avec', 'qui',
                 'que', 'est', 'sont', 'ce', 'se', 'ne', 'pas', 'ou', 'il', 'elle',
                 'on', 'nous', 'vous', 'ils', 'elles', 'son', 'sa', 'ses',
                 'the', 'a', 'an', 'is', 'are', 'of', 'in', 'to', 'and', 'for',
                 'this', 'that', 'it', 'be', 'was', 'were', 'has', 'have', 'had',
                 'être', 'avoir', 'faire', 'dit', 'doit', 'peut', 'faut'}
    
    # Extract significant words (4+ chars, not stopwords)
    words = re.findall(r'\b[a-zA-ZÀ-ÿ]{4,}\b', text.lower())
    word_freq = {}
    for w in words:
        if w not in stopwords and len(w) > 3:
            word_freq[w] = word_freq.get(w, 0) + 1
    
    # Sort by frequency
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    keywords = [w for w, _ in sorted_words[:max_keywords]]
    
    if not keywords:
        keywords = [title]
    
    return keywords


def generate_content_based_exercises(lesson, keywords, level_cat, subject_code):
    """Generate exercises based on actual lesson content."""
    exercises = []
    
    soup = BeautifulSoup(lesson.content or '', 'html.parser')
    text = soup.get_text(separator=' ', strip=True)
    
    # Extract meaningful sentences from content
    sentences = [s.strip() for s in re.split(r'[.!?]', text) 
                 if len(s.strip()) > 25 and len(s.strip()) < 200]
    
    if not sentences:
        return exercises
    
    # Pick random sentences for true/false and fill-blank
    random.shuffle(sentences)
    
    for i, sent in enumerate(sentences[:3]):
        # Clean the sentence
        sent = re.sub(r'\s+', ' ', sent).strip()
        if len(sent) < 30:
            continue
            
        if i == 0 and level_cat in ('primary', 'secondary'):
            # True/False from content
            exercises.append({
                'type': 'true_false',
                'question': f"{sent[:150]}. (Vrai ou Faux ?)",
                'correct_answer': 'Vrai',
                'explanation': f"D'après la leçon, cette affirmation est correcte.",
                'options': [],
                'difficulty': 1,
            })
        elif i == 1:
            # Fill blank - take a key word out
            words_in_sent = [w for w in sent.split() if len(w) > 4]
            if words_in_sent:
                target_word = random.choice(words_in_sent[:5])
                blanked = sent.replace(target_word, '___', 1)
                exercises.append({
                    'type': 'fill_blank',
                    'question': f"Complète la phrase : {blanked[:200]}",
                    'correct_answer': target_word,
                    'explanation': f"Le mot manquant est « {target_word} ».",
                    'options': [],
                    'difficulty': 2,
                })
    
    return exercises


class Command(BaseCommand):
    help = 'Generate exercises for lessons that have none. Supports --level and --dry-run.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--level', type=str, default=None,
            help='Generate only for a specific level (e.g., primary_cp1, lycee_tles)'
        )
        parser.add_argument(
            '--dry-run', action='store_true',
            help='Preview exercises without saving to database'
        )
        parser.add_argument(
            '--min-content', type=int, default=100,
            help='Minimum content length to generate exercises (default: 100)'
        )
        parser.add_argument(
            '--max-per-lesson', type=int, default=5,
            help='Maximum exercises per lesson (default: 5)'
        )

    def handle(self, *args, **options):
        level_filter = options['level']
        dry_run = options['dry_run']
        min_content = options['min_content']
        max_per_lesson = options['max_per_lesson']

        self.stdout.write(self.style.NOTICE(
            f"{'[DRY RUN] ' if dry_run else ''}Generating exercises..."
        ))

        # Get lessons without exercises
        queryset = Lesson.objects.annotate(
            ex_count=Count('exercises')
        ).filter(ex_count=0)

        if level_filter:
            queryset = queryset.filter(course__level=level_filter)

        # Filter by minimum content length
        lessons = [l for l in queryset.select_related('course', 'course__subject')
                   if len(l.content or '') >= min_content]

        total_lessons = len(lessons)
        self.stdout.write(f"Found {total_lessons} lessons without exercises" +
                         (f" (level: {level_filter})" if level_filter else ""))

        if total_lessons == 0:
            self.stdout.write(self.style.WARNING("No lessons to process."))
            return

        # Ensure categories exist
        categories = {}
        cat_names = {
            'math': 'Mathématiques',
            'french': 'Français',
            'english': 'Anglais',
            'science': 'Sciences',
            'history': 'Histoire',
            'geography': 'Géographie',
            'art': 'Arts Plastiques',
            'music': 'Musique',
            'pe': 'Éducation Physique',
        }
        if not dry_run:
            for code, name in cat_names.items():
                cat, _ = ExerciseCategory.objects.get_or_create(name=name)
                categories[code] = cat

        total_created = 0
        skipped = 0

        for idx, lesson in enumerate(lessons, 1):
            subject_code = lesson.course.subject.code
            level = lesson.course.level
            level_cat = get_level_category(level)
            title = lesson.title

            # Extract keywords from content
            keywords = extract_keywords(lesson.content, title)

            # Get templates for this subject
            templates = SUBJECT_TEMPLATES.get(subject_code, DEFAULT_TEMPLATES)
            level_templates = templates.get(level_cat, templates.get('secondary', []))

            exercises_to_create = []

            # 1. Generate from templates
            for tpl in level_templates:
                generated = tpl['gen'](keywords, title)
                for g in generated:
                    exercises_to_create.append({
                        'type': tpl['type'],
                        'question': g['q'],
                        'correct_answer': g['a'],
                        'explanation': g.get('explanation', ''),
                        'options': g.get('options', []),
                        'difficulty': g.get('difficulty', 2),
                    })

            # 2. Generate from actual content (bonus)
            content_exercises = generate_content_based_exercises(
                lesson, keywords, level_cat, subject_code
            )
            exercises_to_create.extend(content_exercises)

            # Limit to max_per_lesson
            exercises_to_create = exercises_to_create[:max_per_lesson]

            if not exercises_to_create:
                skipped += 1
                continue

            if dry_run:
                self.stdout.write(f"\n[{idx}/{total_lessons}] {level} | {subject_code} | {title}")
                for i, ex in enumerate(exercises_to_create, 1):
                    self.stdout.write(f"  {i}. [{ex['type']}] {ex['question'][:80]}")
                    self.stdout.write(f"     → Answer: {ex['correct_answer'][:50]}")
                total_created += len(exercises_to_create)
            else:
                for order, ex in enumerate(exercises_to_create, 1):
                    # Set difficulty based on order and level
                    difficulty = min(order, 3)
                    if level_cat == 'lycee':
                        difficulty = min(order + 1, 5)

                    # Set points based on difficulty
                    points = {1: 5, 2: 10, 3: 15, 4: 20, 5: 25}.get(difficulty, 10)

                    Exercise.objects.create(
                        lesson=lesson,
                        category=categories.get(subject_code),
                        title=f"Exercice {order} - {title[:80]}",
                        description=f"Exercice d'entraînement sur « {title[:80]} »",
                        question=ex['question'],
                        type=ex['type'],
                        difficulty=difficulty,
                        points=points,
                        correct_answer=ex['correct_answer'],
                        explanation=ex['explanation'],
                        options=ex.get('options', []),
                        hints=[],
                        order=order,
                        is_active=True,
                    )
                    total_created += 1

                if idx % 50 == 0 or idx == total_lessons:
                    self.stdout.write(f"  Progress: {idx}/{total_lessons} lessons processed, {total_created} exercises created")

        # Summary
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 50))
        if dry_run:
            self.stdout.write(self.style.SUCCESS(f"[DRY RUN] Would create {total_created} exercises for {total_lessons - skipped} lessons"))
        else:
            self.stdout.write(self.style.SUCCESS(f"✅ Created {total_created} exercises for {total_lessons - skipped} lessons"))
        self.stdout.write(f"Skipped {skipped} lessons (no exercises generated)")
        self.stdout.write(self.style.SUCCESS("=" * 50))
