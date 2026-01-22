# Guide d'Intégration des Cours Faso Education

## 📋 Vue d'ensemble

Ce système récupère automatiquement tous les cours du site officiel du Burkina Faso (fasoeducation.bf) et les intègre dans la base de données de l'Intelligent Tutor.

## 🚀 Processus complet

### Étape 1: Scraper les cours

```bash
# Scraper tous les cours disponibles
python scraper/faso_education_scraper.py

# Résultat: crée un fichier faso_courses.json
```

**Output example:**
```json
{
  "primaire_cp": [
    {
      "title": "Français - CP",
      "url": "/cours-cp.html",
      "level": "primaire_cp",
      "source": "fasoeducation.bf"
    },
    ...
  ],
  "primaire_ce1": [...],
  ...
}
```

### Étape 2: Importer dans la base de données

```bash
# Importer tous les cours
python manage.py import_faso_courses --file faso_courses.json

# Options disponibles:
# --dry-run              Affiche ce qui serait importé sans sauvegarder
# --level primaire_cp    Importe seulement un niveau spécifique
```

**Exemples:**
```bash
# Preview avant import
python manage.py import_faso_courses --dry-run

# Importer seulement le CP
python manage.py import_faso_courses --level primaire_cp

# Import complet
python manage.py import_faso_courses
```

### Étape 3: Vérifier l'import

```bash
# Via Django shell
python manage.py shell

# Vérifier les cours importés
from apps.courses.models import Course
Course.objects.count()  # Total des cours
Course.objects.filter(level='primary_1').count()  # Cours CP

# Par matière
from django.db.models import Count
Course.objects.values('subject').annotate(count=Count('id'))
```

## 📊 Niveaux et Correspondances

| Clé Scraper | Niveau Django | Description |
|---|---|---|
| `primaire_cp` | `primary_1` | Cours Préparatoire |
| `primaire_ce1` | `primary_2` | Cours Élémentaire 1 |
| `primaire_ce2` | `primary_3` | Cours Élémentaire 2 |
| `primaire_cm1` | `primary_4` | Cours Moyen 1 |
| `primaire_cm2` | `primary_5` | Cours Moyen 2 |
| `postprimaire_6e` | `secondary_1` | 6ème |
| `postprimaire_5e` | `secondary_2` | 5ème |
| `postprimaire_4e` | `secondary_3` | 4ème |
| `postprimaire_3e` | `secondary_4` | 3ème |
| `secondaire_2nde` | `secondary_1` | Seconde |
| `secondaire_1ere` | `secondary_2` | Première |
| `secondaire_tle` | `secondary_4` | Terminale |

## 🔧 Configuration du Scraper

Le scraper cherche automatiquement ces sujets:
- Français
- Mathématiques
- Anglais
- Sciences
- Histoire
- Géographie
- Arts Plastiques
- Musique
- Éducation Physique

### Personnalisation

Modifier `FasoEducationScraper.COURSE_LEVELS` pour ajouter/modifier les URLs:

```python
COURSE_LEVELS = {
    'primaire_cp': 'espace-eleves/primaire/...',
    # Ajouter d'autres niveaux ici
}
```

## 📈 Statistiques après Import

```bash
# Voir les statistiques
python manage.py shell_plus

# Total
Course.objects.count()

# Par niveau
from django.db.models import Count
Course.objects.values('level').annotate(total=Count('id')).order_by('level')

# Par matière
Course.objects.values('subject__name').annotate(total=Count('id'))

# Exemple de sortie:
# [
#   {'level': 'primary_1', 'total': 12},
#   {'level': 'primary_2', 'total': 15},
#   ...
# ]
```

## 🐛 Troubleshooting

### Erreur: "File not found: faso_courses.json"
```bash
# Vérifier que le scraper a fonctionné
ls -la faso_courses.json

# Relancer le scraper
python scraper/faso_education_scraper.py
```

### Courses vides ou mal détectées
1. Le site a peut-être changé de structure
2. Relancer le scraper avec logs détaillés:
```bash
python scraper/faso_education_scraper.py 2>&1 | tee scraper.log
```

3. Vérifier les URLs dans `COURSE_LEVELS`

### Importation lente
- C'est normal pour la première import (peut prendre quelques secondes)
- Les imports suivants seront plus rapides (détection des doublons)

## 🔄 Automatiser la mise à jour

### Option 1: Cron Job (Linux/Mac)
```bash
# Éditer crontab
crontab -e

# Mettre à jour les cours quotidiennement à 2h du matin
0 2 * * * cd /home/tanou/Bur/projetWeb/intelligent_tutor && python scraper/faso_education_scraper.py && python manage.py import_faso_courses --file faso_courses.json
```

### Option 2: Django Celery (Production)
```python
# tasks.py
from celery import shared_task

@shared_task
def update_faso_courses():
    from scraper.faso_education_scraper import FasoEducationScraper
    scraper = FasoEducationScraper()
    courses = scraper.scrape_all_courses()
    scraper.save_to_json(courses)
```

## 📝 Fichiers créés

- ✅ `scraper/faso_education_scraper.py` - Scraper principal
- ✅ `apps/courses/management/commands/import_faso_courses.py` - Import Django
- ✅ `faso_courses.json` - Données scrapées (généré)

## 🎯 Prochaines étapes

1. ✅ Scraper les cours
2. ✅ Importer dans la base de données
3. ⏳ Créer les API endpoints pour récupérer les cours
4. ⏳ Ajouter les exercices liés aux cours
5. ⏳ Générer les questions avec l'IA

---

**Créé:** 22 janvier 2026
**Maintenu par:** Système Intelligent Tutor
