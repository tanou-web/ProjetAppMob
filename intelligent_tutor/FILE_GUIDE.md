# 📂 GUIDE D'ACCÈS AUX FICHIERS

## 🎯 Où trouver les ressources du projet

### Répertoire principal du projet
```
/home/tanou/Bur/projetWeb/intelligent_tutor/
```

### 📄 DOCUMENTATION PRINCIPALE

#### 1. **README.md** (2000+ lignes)
- **Emplacement**: `/home/tanou/Bur/projetWeb/intelligent_tutor/README.md`
- **Contenu**: Vue d'ensemble générale du projet
- **À lire en premier**: ✅ OUI
- **Durée lecture**: 30-45 minutes

#### 2. **INSTALLATION_GUIDE.md** (1500+ lignes)
- **Emplacement**: `/home/tanou/Bur/projetWeb/intelligent_tutor/INSTALLATION_GUIDE.md`
- **Contenu**: Instructions pas à pas d'installation
- **Important pour**: Configuration du système
- **Durée lecture**: 20-30 minutes

#### 3. **TECHNICAL_SPECIFICATIONS.md** (1200+ lignes)
- **Emplacement**: `/home/tanou/Bur/projetWeb/intelligent_tutor/TECHNICAL_SPECIFICATIONS.md`
- **Contenu**: Architecture technique détaillée
- **Important pour**: Développeurs
- **Durée lecture**: 25-35 minutes

#### 4. **PROJECT_SUMMARY.md**
- **Emplacement**: `/home/tanou/Bur/projetWeb/intelligent_tutor/PROJECT_SUMMARY.md`
- **Contenu**: Résumé d'exécution et livrables
- **Bon pour**: Aperçu rapide

---

## 💻 CODE SOURCE

### Configuration Django
```
/home/tanou/Bur/projetWeb/intelligent_tutor/config/
├── settings.py (180+ lignes) - Configuration complète
├── urls.py     - Routage principal
└── wsgi.py     - Application WSGI
```

### Applications métier (5 apps)

#### App 1: Users (Utilisateurs)
```
/home/tanou/Bur/projetWeb/intelligent_tutor/apps/users/
├── models.py       (300+ lignes) - User, StudentProfile, TeacherProfile
├── views.py        (200+ lignes) - UserViewSet, ProfileViewSet, Notifications
├── serializers.py  (150+ lignes) - Sérialiseurs
├── urls.py         - Routes API
└── admin.py        - Interface admin
```

#### App 2: Courses (Contenu pédagogique)
```
/home/tanou/Bur/projetWeb/intelligent_tutor/apps/courses/
├── models.py       (250+ lignes) - Course, Lesson, Enrollment
├── views.py        (200+ lignes) - CourseViewSet, LessonViewSet
├── serializers.py  (150+ lignes) - Sérialiseurs
├── urls.py         - Routes API
└── admin.py        - Interface admin
```

#### App 3: Exercises (Exercices et quiz)
```
/home/tanou/Bur/projetWeb/intelligent_tutor/apps/exercises/
├── models.py       (300+ lignes) - Exercise, ExerciseAttempt, Quiz
├── views.py        (300+ lignes) - ViewSets + Auto-grading
├── serializers.py  (150+ lignes) - Sérialiseurs
├── urls.py         - Routes API
└── admin.py        - Interface admin
```

#### App 4: Progress (Suivi de progression)
```
/home/tanou/Bur/projetWeb/intelligent_tutor/apps/progress/
├── models.py       (300+ lignes) - LearningPath, Achievement, Performance
├── views.py        (250+ lignes) - ViewSets + Analytics
├── serializers.py  (150+ lignes) - Sérialiseurs
├── urls.py         - Routes API
└── admin.py        - Interface admin
```

#### App 5: Recommendations (Moteur IA)
```
/home/tanou/Bur/projetWeb/intelligent_tutor/apps/recommendations/
├── models.py       (300+ lignes) - ContentRecommendation, LearningStyle
├── views.py        (300+ lignes) - RecommendationViewSet + Engine
├── serializers.py  (150+ lignes) - Sérialiseurs
├── utils.py        (400+ lignes) - Moteur IA (ML/sklearn)
├── urls.py         - Routes API
└── admin.py        - Interface admin
```

---

## 🗄️ BASE DE DONNÉES

### Script SQL complet
```
/home/tanou/Bur/projetWeb/intelligent_tutor/database/schema.sql
```
- **Contenu**: DDL MySQL complet (500+ lignes)
- **Tables créées**: 16
- **Indices**: 15+
- **Vue SQL**: 1 (student_progress_summary)
- **Character set**: UTF-8mb4

**À exécuter**:
```bash
mysql -u root -p < database/schema.sql
```

---

## 📦 FICHIERS DE CONFIGURATION

### Dépendances Python
```
/home/tanou/Bur/projetWeb/intelligent_tutor/requirements.txt
```
- **23 packages** listés
- Versions pinées pour la stabilité
- Prêt pour `pip install`

### Variables d'environnement
```
/home/tanou/Bur/projetWeb/intelligent_tutor/.env.example
```
- **Modèle** à copier vers `.env`
- Contient: DB, secret key, CORS, JWT, etc.

### Application Django
```
/home/tanou/Bur/projetWeb/intelligent_tutor/manage.py
```
- CLI Django standard
- Commandes: migrate, runserver, createsuperuser, etc.

---

## 📊 STRUCTURE COMPLÈTE

```
intelligent_tutor/
├── config/
│   ├── __init__.py
│   ├── settings.py         ← Configuration Django
│   ├── urls.py            ← Routage principal
│   ├── asgi.py
│   └── wsgi.py            ← WSGI app
│
├── apps/
│   ├── __init__.py
│   ├── users/             ← Gestion utilisateurs
│   │   ├── models.py      (User, StudentProfile, TeacherProfile)
│   │   ├── views.py       (UserViewSet, ProfileViewSet)
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   └── __init__.py
│   │
│   ├── courses/           ← Contenu pédagogique
│   │   ├── models.py      (Course, Lesson, Enrollment)
│   │   ├── views.py       (CourseViewSet, LessonViewSet)
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   └── __init__.py
│   │
│   ├── exercises/         ← Exercices et quiz
│   │   ├── models.py      (Exercise, ExerciseAttempt, Quiz)
│   │   ├── views.py       (ViewSets + Auto-grading)
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   └── __init__.py
│   │
│   ├── progress/          ← Suivi de progression
│   │   ├── models.py      (LearningPath, Achievement)
│   │   ├── views.py       (ViewSets + Analytics)
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   └── __init__.py
│   │
│   └── recommendations/   ← Moteur IA
│       ├── models.py      (ContentRecommendation, etc.)
│       ├── views.py       (RecommendationViewSet)
│       ├── serializers.py
│       ├── utils.py       ← Moteur IA avec ML
│       ├── urls.py
│       ├── admin.py
│       ├── apps.py
│       └── __init__.py
│
├── database/
│   └── schema.sql         ← DDL MySQL (500+ lignes)
│
├── manage.py              ← CLI Django
├── requirements.txt       ← Dépendances (23 packages)
├── .env.example          ← Variables d'environnement
│
├── README.md              ← Guide général (2000+ lignes)
├── INSTALLATION_GUIDE.md  ← Installation détaillée (1500+ lignes)
├── TECHNICAL_SPECS.md     ← Architecture technique (1200+ lignes)
├── PROJECT_SUMMARY.md     ← Résumé d'exécution
├── create_release.sh      ← Script d'archivage
│
└── logs/                  ← Fichiers de log
    ├── debug.log
    ├── access.log
    └── error.log
```

---

## 🚀 POINTS D'ENTRÉE

### 1. Pour développeurs
1. Lire: `README.md`
2. Lire: `TECHNICAL_SPECIFICATIONS.md`
3. Lancer: `python manage.py runserver`
4. Accéder: `http://localhost:8000`
5. Admin: `http://localhost:8000/admin`

### 2. Pour administrateurs système
1. Lire: `INSTALLATION_GUIDE.md`
2. Exécuter: `database/schema.sql`
3. Configurer: `.env`
4. Installer: `pip install -r requirements.txt`
5. Lancer: `python manage.py migrate`

### 3. Pour intégrateurs
1. Lire: `TECHNICAL_SPECIFICATIONS.md`
2. Consulter: `INSTALLATION_GUIDE.md`
3. Endpoints API: Voir `README.md`
4. Postman: Importer endpoints depuis `config/urls.py`

### 4. Pour gestionnaires projet
1. Lire: `PROJECT_SUMMARY.md`
2. Lire: `README.md` (vue d'ensemble)
3. Vérifier les livrables dans cette section

---

## 🎯 NIVEAUX DE LECTURE RECOMMANDÉS

### ⏱️ Très rapide (5 minutes)
- Lire: `PROJECT_SUMMARY.md` (résumé)

### ⏱️ Rapide (30 minutes)
- Lire: `README.md` (sections principales)
- Lancer: `python manage.py runserver`

### ⏱️ Modéré (2 heures)
- Lire: `README.md` complet
- Lire: `TECHNICAL_SPECIFICATIONS.md`
- Explorer le code source

### ⏱️ Approfondi (4-6 heures)
- Lire: Toute la documentation
- Étudier le code de chaque app
- Exécuter les tests API
- Comprendre le moteur IA

### ⏱️ Complet (1-2 jours)
- Lire: Toute la documentation
- Installer en développement
- Déployer en local
- Créer du contenu de test
- Tester tous les endpoints

---

## 📞 FICHIERS IMPORTANTS PAR USAGE

### Si vous voulez...

#### ...installer rapidement
→ Lire: `INSTALLATION_GUIDE.md`
→ Exécuter: `database/schema.sql`
→ Configurer: `.env.example`

#### ...comprendre l'architecture
→ Lire: `TECHNICAL_SPECIFICATIONS.md`
→ Étudier: `config/settings.py`
→ Voir: Diagrammes dans `TECHNICAL_SPECIFICATIONS.md`

#### ...utiliser les APIs
→ Lire: `README.md` (section Endpoints)
→ Tester: Via curl ou Postman
→ Vérifier: `config/urls.py` pour les routes

#### ...développer une nouvelle fonctionnalité
→ Lire: `TECHNICAL_SPECIFICATIONS.md`
→ Étudier: Une app existante (ex: `apps/exercises/`)
→ Suivre: Le même pattern

#### ...déployer en production
→ Lire: `INSTALLATION_GUIDE.md` (section Déploiement)
→ Configurer: `.env` avec les vrais paramètres
→ Utiliser: Gunicorn + Nginx

#### ...intégrer un frontend
→ Lire: `TECHNICAL_SPECIFICATIONS.md` (API section)
→ Consulter: `README.md` (Endpoints)
→ Tester: Tous les endpoints

#### ...corriger des bugs
→ Consulter: `logs/debug.log`
→ Vérifier: Les exceptions dans le code
→ Voir: `INSTALLATION_GUIDE.md` (Dépannage)

---

## 🔍 NAVIGATION RAPIDE

### Par fichier important
| Fichier | Lignes | Accès |
|---------|--------|-------|
| README.md | 2000+ | `/intelligent_tutor/README.md` |
| INSTALLATION_GUIDE.md | 1500+ | `/intelligent_tutor/INSTALLATION_GUIDE.md` |
| TECHNICAL_SPECIFICATIONS.md | 1200+ | `/intelligent_tutor/TECHNICAL_SPECIFICATIONS.md` |
| PROJECT_SUMMARY.md | 800+ | `/intelligent_tutor/PROJECT_SUMMARY.md` |
| schema.sql | 500+ | `/database/schema.sql` |
| settings.py | 180+ | `/config/settings.py` |

### Par app Django
| App | Modèles | Endpoints | Fichiers |
|-----|---------|-----------|----------|
| users | 4 | 8+ | 6 fichiers |
| courses | 4 | 6+ | 6 fichiers |
| exercises | 5 | 8+ | 6 fichiers |
| progress | 5 | 8+ | 6 fichiers |
| recommendations | 4 | 8+ | 7 fichiers |

---

## 💾 FICHIERS DE RESSOURCES

### Modèles et données de test
```bash
# Aucun fichier de données fourni
# À créer via Django admin ou API après installation
```

### Dumps de base de données
```bash
# Non fourni - à créer après peuplement
# mysqldump -u root -p intelligent_tutor_db > backup.sql
```

### Fichiers statiques
```bash
# À générer via: python manage.py collectstatic
```

### Média/uploads
```bash
# Répertoire vide prêt pour: media/
```

---

## ✅ CHECKLIST DE VÉRIFICATION

Après téléchargement, vérifier que ces fichiers existent:

- [ ] `/config/settings.py` - Configuration Django
- [ ] `/apps/users/models.py` - Modèles utilisateurs
- [ ] `/apps/courses/models.py` - Modèles cours
- [ ] `/apps/exercises/models.py` - Modèles exercices
- [ ] `/apps/progress/models.py` - Modèles progression
- [ ] `/apps/recommendations/utils.py` - Moteur IA
- [ ] `/database/schema.sql` - Script BD
- [ ] `requirements.txt` - Dépendances
- [ ] `.env.example` - Modèle config
- [ ] `README.md` - Documentation
- [ ] `INSTALLATION_GUIDE.md` - Guide installation
- [ ] `TECHNICAL_SPECIFICATIONS.md` - Spécifications
- [ ] `PROJECT_SUMMARY.md` - Résumé
- [ ] `manage.py` - CLI Django

**Si tous les fichiers existent → ✅ Prêt à installer**

---

## 📞 SUPPORT

Pour plus d'informations:
- Consulter les fichiers de documentation appropriés
- Lire les docstrings dans le code
- Vérifier `logs/debug.log` en cas d'erreur
- Voir section "Dépannage" dans `INSTALLATION_GUIDE.md`

---

**Dernière mise à jour**: 21 janvier 2026
**Version**: 1.0.0
**Status**: ✅ Tous les fichiers présents et complets
