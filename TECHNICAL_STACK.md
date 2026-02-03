# Documentation Technique - Tuteur Intelligent

## Vue d'ensemble
L'application "Tuteur Intelligent" est une plateforme éducative complète conçue pour accompagner les élèves du primaire au secondaire au Burkina Faso. Elle utilise une architecture moderne découplée (Frontend/Backend) et intègre des fonctionnalités d'IA pour la personnalisation de l'apprentissage.

## 1. Backend (API & Logique Métier)
**Framework :** Django (Python) & Django REST Framework (DRF)

### Composants Clés :
- **Architecture :** API RESTful modulaire.
- **Applications :**
    - `users` : Gestion des utilisateurs (élèves, enseignants, admins), authentification JWT.
    - `courses` : Gestion du curriculum (Matières, Cours, Leçons).
    - `exercises` : Gestion des évaluations et des tentatives.
    - `recommendations` : Moteur d'IA pour l'analyse des performances et la suggestion de contenu.
- **Base de Données :** MySQL.
- **IA / ML :** 
    - `scikit-learn` pour les modèles de classification (Random Forest, Gradient Boosting).
    - `pandas/numpy` pour le traitement des données.
    - Pipeline d'entraînement automatisé (`apps/recommendations/training_pipeline.py`).
- **Scraping :** Scripts d'importation de contenu via `BeatifulSoup` (`apps/scraper`).

## 2. Frontend (Interface Utilisateur)
**Framework :** React Native (Expo)

### Composants Clés :
- **Navigation :** React Navigation (Stack & Tab navigation).
- **État :** Zustand pour la gestion d'état global (auth, cours).
- **API Client :** Axios avec intercepteurs pour la gestion des tokens JWT.
- **Design :** Styles personnalisés (StyleSheet) avec support responsive.

## 3. Intelligence Artificielle (IA)
Le système intègre plusieurs modèles prédictifs :
- **Modèle de Correction :** Analyse les réponses textuelles pour déterminer leur validité.
- **Modèle d'Analyse d'Erreur :** Classifie les erreurs (orthographe, calcul, logique) pour fournir un feedback précis.
- **Moteur de Recommandation :** Suggère des exercices basés sur le niveau et les lacunes de l'élève.

## 4. Sécurité
- **Authentification :** JWT (JSON Web Tokens) `access` et `refresh` tokens.
- **Permissions :** RBAC (Role-Based Access Control) pour élèves, enseignants, admins.
- **CORS :** Configuration sécurisée des origines autorisées.

## 5. Déploiement & Outils
- **Gestionnaire de paquets :** `pip` (Backend), `npm` (Frontend).
- **Environnement :** `python-decouple` pour les variables d'environnement (`.env`).
- **Scripts :**
    - `START.sh` : Démarrage unifié.
    - `create_sample_data.py` : Génération de données de test.
    - `train_models.py` : Entraînement de l'IA.
