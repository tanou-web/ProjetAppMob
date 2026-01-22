# 🔧 Spécifications Techniques - Application de Tuteur Intelligent

## Vue d'ensemble architecturale

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React.js)                      │
│              (Web: http://localhost:3000)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│              BACKEND (Django REST API)                       │
│        (http://localhost:8000 - Port: 8000)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Django Core Services                       │  │
│  │  - Authentication (JWT)                              │  │
│  │  - Permission & Authorization                        │  │
│  │  - Request/Response Handling                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐  │
│  │           Application Layer (Apps)                  │  │
│  │  ┌─────────────┬──────────┬────────┬──────────┐    │  │
│  │  │  Users      │ Courses  │Exercise│Progress  │    │  │
│  │  │  (Auth)     │ (Content)│(Assess)│(Track)   │    │  │
│  │  └─────────────┴──────────┴────────┴──────────┘    │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │  Recommendations (AI/ML Engine)             │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
│                         │                                 │
└────────────────────────┬─────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼────────┐
│  MySQL DB    │  │   Redis     │  │ File Storage │
│  (8000 req.) │  │   (Cache)   │  │ (Images)     │
└──────────────┘  └─────────────┘  └──────────────┘
```

## Stack technologique détaillée

### Backend
```
Django 4.2.9
├── Django REST Framework 3.14.0 (API)
├── djangorestframework-simplejwt 5.3.2 (Auth JWT)
├── django-cors-headers 4.3.1 (CORS)
├── django-environ 0.21.0 (Config)
└── Celery 5.3.4 + Redis 5.0.1 (Async tasks)

AI/ML Libraries
├── scikit-learn 1.3.2
├── pandas 2.1.3
├── numpy 1.26.3
└── nltk 3.8.1

Database
├── MySQL 8.0+ (Primary DB)
├── mysqlclient 2.2.0 (Driver)
└── Redis 5.0.1 (Cache/Queue)
```

### Frontend (À implémenter)
```
React 18+
├── React Router (Navigation)
├── Axios (HTTP Client)
├── Redux/Context (State Management)
├── Material-UI/Tailwind (UI Components)
├── Chart.js (Analytics)
└── Socket.io (Real-time)
```

### Mobile (À implémenter)
```
React Native / Flutter
├── Redux (State)
├── AsyncStorage (Local DB)
├── React Native Paper (UI)
└── Offline Support
```

## Architecture des applications Django

### 1. users (Gestion des utilisateurs)
```
models.py
├── User (Custom User Model)
│   ├── email (unique)
│   ├── role (student, teacher, parent, admin)
│   ├── level (scolaire)
│   └── profile_image
├── StudentProfile
│   ├── learning_style
│   ├── interests
│   └── learning_speed
├── TeacherProfile
│   ├── specialization
│   └── experience_years
└── Notification

Endpoints:
POST   /api/users/              # Créer compte
GET    /api/users/profile/      # Profil
PUT    /api/users/update_profile/ # Modifier
GET    /api/users/notifications/ # Notifications
```

### 2. courses (Contenu pédagogique)
```
models.py
├── Subject (Matières)
├── Course
│   ├── title
│   ├── subject
│   ├── level
│   ├── difficulty_level (1-5)
│   └── learning_objectives
├── Lesson
│   ├── content (HTML)
│   ├── video_url
│   └── resources (JSON)
└── CourseEnrollment
    └── Track student progress

Endpoints:
GET    /api/courses/            # List
GET    /api/courses/{id}/       # Detail
POST   /api/courses/{id}/enroll/ # S'inscrire
GET    /api/courses/my_courses/ # Mes cours
GET    /api/lessons/            # Leçons
```

### 3. exercises (Exercices et quiz)
```
models.py
├── ExerciseCategory
├── Exercise
│   ├── type (multiple_choice, short_answer, essay, etc.)
│   ├── difficulty (1-5)
│   ├── points
│   ├── options (JSON)
│   ├── hints (JSON)
│   └── correct_answer
├── ExerciseAttempt
│   ├── student_answer
│   ├── is_correct
│   └── score
├── Quiz
└── QuizAttempt

Endpoints:
GET    /api/exercises/          # List
POST   /api/attempts/           # Commencer
POST   /api/attempts/{id}/submit/ # Soumettre
POST   /api/attempts/{id}/get_hint/ # Indice
GET    /api/quizzes/            # Quizzes
```

### 4. progress (Suivi de progression)
```
models.py
├── LearningPath
│   ├── courses_completed
│   ├── lessons_completed
│   ├── average_score
│   └── learning_streak_days
├── LessonProgress
│   ├── status (not_started, in_progress, completed, mastered)
│   └── progress_percentage
├── Achievement (Badges)
├── StudentAchievement
└── PerformanceAnalysis (AI insights)

Endpoints:
GET    /api/progress/learning-paths/my_path/
GET    /api/progress/lesson-progress/
GET    /api/progress/my-achievements/
GET    /api/progress/performance-analysis/latest/
```

### 5. recommendations (Moteur IA)
```
models.py
├── ContentRecommendation
│   ├── content_type
│   ├── confidence_score (0-1)
│   └── recommendation_factors
├── LearningStyleProfile
│   ├── primary_style
│   ├── visual_preference
│   ├── auditory_preference
│   ├── kinesthetic_preference
│   └── pace_preference
├── AdaptiveRecommendationEngine
│   ├── performance_weight
│   ├── learning_style_weight
│   └── engagement_weight
└── RecommendationFeedback

Endpoints:
GET    /api/recommendations/
GET    /api/recommendations/pending/
POST   /api/recommendations/{id}/mark_as_viewed/
GET    /api/recommendations/learning-styles/my_profile/
```

## Flux de données clé

### Inscription et authentification
```
1. User → POST /api/users/ (email, password, role)
2. Backend → Hash password, Create User
3. Backend → Create StudentProfile/TeacherProfile
4. Backend → Create LearningPath/LearningStyleProfile
5. User → POST /api/token/ (email, password)
6. Backend → Generate JWT tokens
7. User → Store JWT in localStorage
```

### Enrôlement dans un cours
```
1. User → GET /api/courses/ (Browse)
2. User → GET /api/courses/{id}/ (View detail)
3. User → POST /api/courses/{id}/enroll/
4. Backend → Create CourseEnrollment
5. Backend → Initialize LessonProgress for each lesson
6. Backend → Trigger recommendation generation
```

### Réalisation d'exercice
```
1. User → GET /api/exercises/?lesson_id=X
2. User → POST /api/attempts/ (exercise_id)
3. Backend → Create ExerciseAttempt
4. User → PUT /api/attempts/{id}/ (student_answer)
5. User → POST /api/attempts/{id}/submit/
6. Backend → Auto-grade or queue for manual grading
7. Backend → Update LessonProgress
8. Backend → Calculate PerformanceAnalysis
9. Backend → Generate recommendations
```

### Génération de recommandations
```
1. Scheduler → trigger generate_recommendations(user)
2. Backend → analyze_user_performance()
   - Get recent attempts
   - Calculate subject scores
   - Identify strengths/weaknesses
3. Backend → recommend_for_weaknesses()
   - Find related courses
4. Backend → recommend_by_learning_style()
   - Match content with learning profile
5. Backend → recommend_next_courses()
   - Suggest progression
6. Backend → score_recommendations()
   - Weight by multiple factors
7. Backend → Save to ContentRecommendation
8. Backend → Send notification to user
```

## Modèle de données - Diagramme ER

```
User (1) ──── (∞) StudentProfile
            ├─ (∞) CourseEnrollment
            ├─ (∞) ExerciseAttempt
            ├─ (∞) QuizAttempt
            ├─ (∞) LessonProgress
            ├─ (∞) ContentRecommendation
            ├─ (∞) StudentAchievement
            ├─ (1) LearningPath
            ├─ (1) LearningStyleProfile
            └─ (1) AdaptiveRecommendationEngine

Course (1) ──── (∞) Lesson
      │              │
      └── (∞) CourseEnrollment
      
Lesson (1) ──── (∞) Exercise
      │              │
      └── (∞) LessonProgress

Exercise (1) ──── (∞) ExerciseAttempt

Subject (1) ──── (∞) Course
```

## Authentification et Sécurité

### JWT Tokens
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Headers requis
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Permissions (par rôle)
```
STUDENT:
  ✓ Lire les cours publiés
  ✓ S'inscrire aux cours
  ✓ Faire les exercices
  ✓ Voir sa progression
  ✗ Créer du contenu
  ✗ Créer des utilisateurs

TEACHER:
  ✓ Créer/Modifier cours et exercices
  ✓ Voir progression des étudiants
  ✓ Corriger les devoirs
  ✗ Supprimer des utilisateurs
  ✗ Accès admin

ADMIN:
  ✓ Tout accès complet
```

## Performance et optimisation

### Indices de base de données
```sql
CREATE INDEX idx_user_email ON users_user(email);
CREATE INDEX idx_course_status ON courses_course(status);
CREATE INDEX idx_enrollment_student ON courses_courseenrollment(student_id);
CREATE INDEX idx_attempt_student ON exercises_exerciseattempt(student_id);
CREATE INDEX idx_recommendation_student ON recommendations_contentrecommendation(student_id);
```

### Caching (Redis)
```
- User profiles (TTL: 1 hour)
- Course listings (TTL: 6 hours)
- Recommendations (TTL: 24 hours)
- Performance analysis (TTL: 1 week)
```

### Pagination
```
- Default: 20 items par page
- Max: 100 items par page
- Utiliser cursor pagination pour large datasets
```

## Intégration API avec Frontend

### Requête exemple
```javascript
// Authentification
const response = await fetch('http://localhost:8000/api/token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { access } = await response.json();
localStorage.setItem('token', access);

// Requête authentifiée
const coursesResponse = await fetch('http://localhost:8000/api/courses/my_courses/', {
  headers: {
    'Authorization': `Bearer ${access}`,
    'Content-Type': 'application/json'
  }
});

const courses = await coursesResponse.json();
```

## Déploiement

### Système de fichiers
```
/var/www/intelligent-tutor/
├── app/                  # Code source
├── venv/                 # Virtual environment
├── staticfiles/          # Static files (collectstatic)
├── media/                # User uploads
├── logs/                 # Application logs
└── .env                  # Environment variables
```

### Processus
```
Nginx (Port 80/443)
    ↓
Gunicorn (Port 8000 - Socket)
    ↓
Django + DRF
    ↓
MySQL (Port 3306)
```

## Monitoring et logging

### Fichiers de log
```
logs/debug.log     # Application logs
logs/access.log    # HTTP access logs
logs/error.log     # Error logs
```

### Métriques importantes
```
- Temps de réponse API (target < 200ms)
- Nombre de requêtes par seconde
- Taux d'erreur (target < 0.1%)
- Utilisateurs concurrents
- Utilisation mémoire
- Espace disque BD
```

---

**Version**: 1.0.0  
**Date**: 21 janvier 2026  
**Auteur**: Équipe de développement
