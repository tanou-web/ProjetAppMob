# Application de Tuteur Intelligent (Intelligent Tutor Application)

**Une solution éducative numérique personnalisée pour les élèves du primaire et du secondaire**

## 📋 Vue d'ensemble

L'application de tuteur intelligent est une plateforme éducative basée sur Django REST Framework qui offre:

- ✅ **Accompagnement pédagogique personnalisé** adapté à chaque élève
- ✅ **Exercices interactifs** corrigés automatiquement avec feedback intelligent
- ✅ **Adaptation dynamique** du niveau selon les performances
- ✅ **Moteur de recommandation IA** pour cibler les besoins spécifiques
- ✅ **Suivi de progression** détaillé avec analyses de performance
- ✅ **Système d'achievements** pour motiver les étudiants
- ✅ **Analyse prédictive** des points faibles et forces

## 🏗️ Architecture Technique

### Stack Technologique
- **Backend**: Django 4.2.9 + Django REST Framework 3.14.0
- **Base de données**: MySQL 8.0+
- **Authentification**: JWT (SimpleJWT)
- **Queue de tâches**: Celery + Redis
- **ML/AI**: scikit-learn, NumPy, Pandas
- **API**: RESTful avec CORS

### Structure du Projet

```
intelligent_tutor/
├── config/                      # Configuration Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/                        # Applications métier
│   ├── users/                   # Gestion des utilisateurs
│   ├── courses/                 # Cours et leçons
│   ├── exercises/               # Exercices et quiz
│   ├── progress/                # Suivi de progression
│   └── recommendations/         # Moteur de recommandations IA
├── database/
│   └── schema.sql              # Script d'initialisation BD
├── manage.py
├── requirements.txt
└── .env.example
```

## 🚀 Installation et Configuration

### Prérequis
- Python 3.8+
- MySQL 8.0+
- Redis (optionnel, pour Celery)
- pip et virtualenv

### Étape 1: Cloner et configurer l'environnement

```bash
cd intelligent_tutor
python -m venv venv

# Activation du venv
# Sur Linux/Mac:
source venv/bin/activate
# Sur Windows:
venv\Scripts\activate

pip install -r requirements.txt
```

### Étape 2: Configurer la base de données

```bash
# Créer la base de données MySQL
mysql -u root -p < database/schema.sql

# Ou manuellement:
mysql -u root -p
> CREATE DATABASE intelligent_tutor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;
```

### Étape 3: Configurer les variables d'environnement

```bash
cp .env.example .env

# Éditer .env avec vos paramètres:
nano .env

# Champs importants à remplir:
# SECRET_KEY=votre-clé-secrète
# DB_NAME=intelligent_tutor_db
# DB_USER=root
# DB_PASSWORD=votre-mot-de-passe
# DB_HOST=127.0.0.1
```

### Étape 4: Initialiser Django

```bash
# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques
python manage.py collectstatic --noinput
```

### Étape 5: Lancer l'application

```bash
# Mode développement
python manage.py runserver 0.0.0.0:8000

# L'application sera accessible à http://localhost:8000
# Admin panel: http://localhost:8000/admin
```

## 📡 Endpoints API

### Authentification
- `POST /api/token/` - Obtenir les tokens JWT
- `POST /api/token/refresh/` - Rafraîchir le token d'accès

### Utilisateurs
- `POST /api/users/` - Créer un compte
- `GET /api/users/profile/` - Profil utilisateur
- `PUT /api/users/update_profile/` - Modifier le profil
- `GET /api/users/notifications/` - Notifications

### Cours
- `GET /api/courses/` - Liste des cours
- `GET /api/courses/{id}/` - Détails d'un cours
- `POST /api/courses/{id}/enroll/` - S'inscrire à un cours
- `GET /api/courses/my_courses/` - Mes cours
- `GET /api/lessons/` - Leçons disponibles

### Exercices
- `GET /api/exercises/` - Liste des exercices
- `POST /api/attempts/` - Commencer une tentative
- `POST /api/attempts/{id}/submit/` - Soumettre une réponse
- `POST /api/attempts/{id}/get_hint/` - Obtenir un indice

### Progression
- `GET /api/progress/learning-paths/my_path/` - Mon chemin d'apprentissage
- `GET /api/progress/lesson-progress/` - Progression par leçon
- `GET /api/progress/my-achievements/` - Mes succès
- `GET /api/progress/performance-analysis/latest/` - Analyse de performance

### Recommandations
- `GET /api/recommendations/` - Mes recommandations
- `GET /api/recommendations/pending/` - Recommandations en attente
- `POST /api/recommendations/{id}/mark_as_viewed/` - Marquer comme vue
- `GET /api/recommendations/learning-styles/my_profile/` - Profil d'apprentissage

## 🤖 Moteur d'IA et Recommandations

### Comment fonctionne le système

Le moteur de recommandation IA analyse:

1. **Performance académique** - scores, tentatives, difficultés
2. **Style d'apprentissage** - visuel, auditif, kinesthésique
3. **Progressions** - cours complétés, leçons maîtrisées
4. **Engagement** - activité récente, temps d'étude
5. **Préférences** - intérêts déclarés, sujets favoris

### Utiliser le moteur

```python
from apps.recommendations.utils import generate_recommendations

# Générer des recommandations pour un utilisateur
recommendations = generate_recommendations(user, limit=5)

# Analyser les tendances de performance
from apps.recommendations.utils import analyze_performance_trends
analysis = analyze_performance_trends(user)
```

## 👥 Rôles Utilisateurs

- **Élève (Student)**: Accès aux cours, exercices, suivi de progression
- **Enseignant (Teacher)**: Création de contenu, correction, suivi des élèves
- **Parent (Parent)**: Suivi de la progression de l'enfant
- **Administrateur (Admin)**: Gestion complète de la plateforme

## 📊 Modèles de Données Principaux

### User (Utilisateur)
- Email, nom, prénom
- Rôle (élève, enseignant, parent, admin)
- Niveau scolaire
- Profil d'apprentissage

### Course (Cours)
- Titre, description
- Sujet, niveau de difficulté
- Leçons multiples

### Lesson (Leçon)
- Contenu, vidéos, ressources
- Exercices associés
- Résultats d'apprentissage attendus

### Exercise (Exercice)
- Types variés (QCM, réponse courte, essai, etc.)
- Correction automatique pour certains types
- Indications disponibles

### LearningPath (Chemin d'apprentissage)
- Progression personnalisée
- Statistiques d'étude
- Tendances d'amélioration

## 🔐 Sécurité

- Authentification JWT
- Permission par rôle (Role-Based Access Control)
- CORS configuré pour les domaines de confiance
- Passwords hashés avec PBKDF2
- SQL Injection protection (via ORM Django)

## 📝 Logging et Monitoring

Les logs sont sauvegardés dans `logs/debug.log`:

```bash
tail -f logs/debug.log
```

## 🧪 Tests

```bash
# Lancer les tests
python manage.py test

# Avec couverture
coverage run --source='.' manage.py test
coverage report
```

## 🐳 Déploiement avec Docker (Optionnel)

```bash
# Créer l'image
docker build -t intelligent-tutor .

# Lancer le conteneur
docker run -p 8000:8000 --env-file .env intelligent-tutor
```

## 📱 Intégration Frontend

L'API REST est conçue pour fonctionner avec:
- React.js (application web)
- React Native ou Flutter (application mobile)

Headers requis pour les requêtes authentifiées:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 🤝 Contribution

Les contributions sont les bienvenues! Pour participer:
1. Fork le projet
2. Créez une branche feature
3. Commitez vos changements
4. Push vers la branche
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous license MIT.

## 👨‍💼 Support

Pour toute question ou problème:
- 📧 Email: support@intelligenttutor.edu
- 📚 Documentation complète: [docs/](./docs)
- 🐛 Issues: [Signaler un bug](./issues)

## 🗓️ Roadmap

- [ ] Interface d'administration avancée
- [ ] Support du mode hors ligne
- [ ] Analytics avancée avec D3.js
- [ ] Intégration LMS (Moodle)
- [ ] Support multilingue complet
- [ ] Gamification améliorée
- [ ] Intégration des enseignants
- [ ] Mobile app (React Native)

---

**Dernière mise à jour**: 21 janvier 2026  
**Version**: 1.0.0
