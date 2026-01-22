"""
Configuration for Faso Education Scraper
"""

# Base configuration
SCRAPER_CONFIG = {
    'base_url': 'https://fasoeducation.bf',
    'timeout': 10,
    'retries': 3,
    'backoff_factor': 0.5,
    'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}

# Course levels and their URL paths
COURSE_LEVELS = {
    # PRIMAIRE (Primary School - Grades 1-6)
    'primaire_cp': {
        'name': 'Cours Préparatoire',
        'path': 'espace-eleves/primaire/primaire-classique/cours-cp.html',
        'order': 1,
    },
    'primaire_ce1': {
        'name': 'Cours Élémentaire 1',
        'path': 'espace-eleves/primaire/primaire-classique/cours-ce1.html',
        'order': 2,
    },
    'primaire_ce2': {
        'name': 'Cours Élémentaire 2',
        'path': 'espace-eleves/primaire/primaire-classique/cours-ce2.html',
        'order': 3,
    },
    'primaire_cm1': {
        'name': 'Cours Moyen 1',
        'path': 'espace-eleves/primaire/primaire-classique/cours-cm1.html',
        'order': 4,
    },
    'primaire_cm2': {
        'name': 'Cours Moyen 2',
        'path': 'espace-eleves/primaire/primaire-classique/cours-cm2.html',
        'order': 5,
    },
    
    # POST-PRIMAIRE (Lower Secondary - Grades 7-9)
    'postprimaire_6e': {
        'name': '6ème (Sixième)',
        'path': 'espace-eleves/postprimaire/postprimaire-general/cours-6e.html',
        'order': 6,
    },
    'postprimaire_5e': {
        'name': '5ème (Cinquième)',
        'path': 'espace-eleves/postprimaire/postprimaire-general/cours-5e.html',
        'order': 7,
    },
    'postprimaire_4e': {
        'name': '4ème (Quatrième)',
        'path': 'espace-eleves/postprimaire/postprimaire-general/cours-4e.html',
        'order': 8,
    },
    'postprimaire_3e': {
        'name': '3ème (Troisième)',
        'path': 'espace-eleves/postprimaire/postprimaire-general/cours-troisieme.html',
        'order': 9,
    },
    
    # SECONDAIRE (Upper Secondary - Grades 10-12)
    'secondaire_2nde': {
        'name': 'Seconde (Grade 10)',
        'path': 'espace-eleves/secondaire/secondaire-general/cours-seconde.html',
        'order': 10,
    },
    'secondaire_1ere': {
        'name': 'Première (Grade 11)',
        'path': 'espace-eleves/secondaire/secondaire-general/cours-premiere.html',
        'order': 11,
    },
    'secondaire_tle': {
        'name': 'Terminale (Grade 12)',
        'path': 'espace-eleves/secondaire/secondaire-general/cours-terminale-generale.html',
        'order': 12,
    },
}

# Subject keywords for automatic detection
SUBJECT_KEYWORDS = {
    'french': ['français', 'littérature', 'grammaire', 'orthographe', 'conjugaison'],
    'math': ['mathématiques', 'math', 'algebra', 'géométrie', 'trigonométrie', 'calcul'],
    'english': ['english', 'anglais', 'langue étrangère'],
    'science': ['sciences', 'physique', 'chimie', 'biologie', 'naturelles'],
    'history': ['histoire', 'histoire-géographie'],
    'geography': ['géographie', 'histoire-géographie'],
    'art': ['art', 'arts plastiques', 'dessin'],
    'music': ['musique', 'éducation musicale'],
    'pe': ['éducation physique', 'eps', 'sport'],
}

# Selectors for parsing (can be updated if site structure changes)
SELECTORS = {
    'courses_container': [
        'div.courses',
        'div.course-list',
        'ul.cours-list',
    ],
    'course_item': [
        'a.cours-link',
        'li a',
        'div.course-item a',
    ],
    'course_title': [
        'span.title',
        'h3',
        'h4',
    ],
}

# Django level mapping
DJANGO_LEVEL_MAPPING = {
    'primaire_cp': 'primary_1',
    'primaire_ce1': 'primary_2',
    'primaire_ce2': 'primary_3',
    'primaire_cm1': 'primary_4',
    'primaire_cm2': 'primary_5',
    'postprimaire_6e': 'secondary_1',
    'postprimaire_5e': 'secondary_2',
    'postprimaire_4e': 'secondary_3',
    'postprimaire_3e': 'secondary_4',
    'secondaire_2nde': 'secondary_1',
    'secondaire_1ere': 'secondary_2',
    'secondaire_tle': 'secondary_4',
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'scraper.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'scraper': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
