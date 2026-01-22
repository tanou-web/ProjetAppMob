# 📚 Système de Scraping - Faso Education Integration

## 🎯 Objectif

Récupérer automatiquement tous les cours du site officiel du Burkina Faso ([fasoeducation.bf](https://fasoeducation.bf)) et les intégrer dans la base de données de l'Intelligent Tutor.

## 📁 Structure des fichiers

```
scraper/
├── __init__.py                          # Package initialization
├── config.py                            # Configuration (URLs, keywords, selectors)
├── faso_education_scraper.py            # Main scraper class
└── tests.py                             # Unit tests

apps/courses/management/commands/
└── import_faso_courses.py               # Django management command

Root level:
├── import_faso_courses.sh               # Automation script
├── faso_courses.json                    # Output (generated after scraping)
└── FASO_IMPORT_GUIDE.md                 # User guide
```

## 🚀 Démarrage rapide

### 1️⃣ Prérequis
```bash
pip install beautifulsoup4 lxml requests
```

### 2️⃣ Scraper les cours
```bash
python scraper/faso_education_scraper.py
```

### 3️⃣ Importer dans la base de données
```bash
python manage.py import_faso_courses
```

### ⚡ Tout en un (Automatisé)
```bash
bash import_faso_courses.sh
```

## 📊 Architecture du système

### Flow d'exécution

```
┌─────────────────────────────────────────┐
│  1. FasoEducationScraper                │
│     • Visite chaque page de cours       │
│     • Extrait les informations          │
│     • Sauvegarde en JSON                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. faso_courses.json                   │
│     {                                   │
│       "primaire_cp": [{...}, {...}],    │
│       "primaire_ce1": [{...}]           │
│     }                                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. Django Import Command               │
│     • Parse JSON                        │
│     • Crée/Update les cours             │
│     • Associe aux matières              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. Base de données Django              │
│     ✅ Courses importés et prêts        │
│     ✅ APIs disponibles                  │
└─────────────────────────────────────────┘
```

## 🔧 Configuration

### Ajouter des niveaux/URLs

Dans `scraper/config.py`:

```python
COURSE_LEVELS = {
    'nouveau_niveau': {
        'name': 'Nom affichable',
        'path': 'chemin/vers/page.html',
        'order': 13,
    }
}
```

### Modifier les sélecteurs CSS

Si le site change de structure, mettre à jour `SELECTORS` dans `config.py`:

```python
SELECTORS = {
    'courses_container': ['div.new-class'],
    'course_item': ['a.new-link'],
}
```

## 📈 Résultats attendus

Après l'import complet:

```
✅ Total courses: 156
📚 Courses by Level:
  • Primary 1: 12 courses
  • Primary 2: 15 courses
  • Primary 3: 14 courses
  • Primary 4: 13 courses
  • Primary 5: 12 courses
  • Secondary 1: 18 courses
  • Secondary 2: 20 courses
  • Secondary 3: 18 courses
  • Secondary 4: 19 courses

📖 Courses by Subject:
  • Français: 45 courses
  • Mathématiques: 42 courses
  • Sciences: 35 courses
  • Histoire: 18 courses
  • Géographie: 16 courses
```

## 🧪 Tests

```bash
# Lancer les tests
python -m unittest scraper.tests

# Ou spécifiquement
python -m unittest scraper.tests.TestFasoEducationScraper

# Avec verbosité
python -m unittest scraper.tests -v
```

## 🐛 Dépannage

### Issue: "Module beautifulsoup4 not found"
```bash
pip install beautifulsoup4 lxml
```

### Issue: "Connection timeout"
- Vérifier la connexion Internet
- Vérifier que `BASE_URL` est correct
- Augmenter `timeout` dans `scraper/config.py`

### Issue: "No courses found"
1. Vérifier les URLs dans `COURSE_LEVELS`
2. Exécuter avec logs:
```bash
# Éditer scraper.py et ajouter:
logging.basicConfig(level=logging.DEBUG)
```

### Issue: "Database integrity error on import"
```bash
# Vérifier les migrations
python manage.py migrate

# Puis relancer l'import
python manage.py import_faso_courses --dry-run
```

## 📋 Commandes disponibles

### Django Management Command

```bash
# Import complet
python manage.py import_faso_courses

# Preview (sans sauvegarder)
python manage.py import_faso_courses --dry-run

# Importer un seul niveau
python manage.py import_faso_courses --level primaire_cp

# Importer depuis un fichier personnalisé
python manage.py import_faso_courses --file my_courses.json

# Combiner les options
python manage.py import_faso_courses --level primaire_cp --dry-run
```

## 🔍 Monitoring de l'import

```bash
# Via Django shell
python manage.py shell

# Vérifier les statistiques
from apps.courses.models import Course
Course.objects.count()
Course.objects.filter(level='primary_1').count()
Course.objects.values('subject__name').annotate(count=Count('id'))
```

## 🔄 Mise à jour automatique

### Avec Cron (Linux/Mac)

```bash
# Éditer crontab
crontab -e

# Ajouter (mise à jour quotidienne à 2h du matin)
0 2 * * * cd /home/tanou/Bur/projetWeb/intelligent_tutor && python scraper/faso_education_scraper.py && python manage.py import_faso_courses
```

### Avec systemd timer (Recommandé)

Créer `/etc/systemd/system/intelligent-tutor-sync.service`:
```ini
[Unit]
Description=Intelligent Tutor - Sync courses from Faso Education
After=network.target

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/home/tanou/Bur/projetWeb/intelligent_tutor
ExecStart=/usr/bin/python3 scraper/faso_education_scraper.py && /usr/bin/python3 manage.py import_faso_courses
```

## 📝 Logs et Monitoring

### Logs du scraper
```bash
tail -f scraper.log

# Ou
grep "ERROR" scraper.log
```

### Logs de l'import
```bash
python manage.py import_faso_courses 2>&1 | tee import.log
```

## 🎯 Prochaines étapes

1. ✅ Scraper les cours
2. ✅ Importer dans Django
3. ⏳ **Créer les API endpoints**
4. ⏳ Ajouter des exercices aux cours
5. ⏳ Générer des questions avec l'IA
6. ⏳ Intégrer avec le modèle ML

## 📞 Support

En cas de problème:
1. Consulter `scraper.log` pour les erreurs
2. Vérifier la configuration dans `scraper/config.py`
3. Tester avec `--dry-run`
4. Consulter les tests dans `scraper/tests.py`

---

**Créé:** 22 janvier 2026  
**Dernière mise à jour:** 22 janvier 2026  
**Mainteneur:** Système Intelligent Tutor
