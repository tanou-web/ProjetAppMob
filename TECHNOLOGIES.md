# Technologies Utilisées — Tuteur Intelligent

Conformément au cahier des charges, l'application utilise une pile technologique moderne et robuste :

## 1. Backend
- **Framework** : Django 5.x (Python 3.12)
- **Base de données** : MySQL 8.x
- **API** : Django REST Framework (DRF)
- **Authentification** : JWT (JSON Web Tokens)
- **Traitement IA** : ML-based Auto-correction (Intégré via services internes)

## 2. Frontend & Mobile
- **Core** : Reactjs (Web) & React Native (Mobile via Expo)
- **Langage** : TypeScript (pour la sécurité du typage)
- **Gestion d'état** : Zustand (Léger et performant pour le mode hors ligne)
- **Navigation** : React Navigation
- **Styling** : Vanilla CSS / StyleSheet (Optimisé pour les performances mobiles)

## 3. Fonctionnalités Spéciales
- **Vocalisation** : Expo-Speech (Pour le support vocal CP1-CE2)
- **Mode Hors Ligne** : Système de file d'attente (SyncQueue) et cache local (AsyncStorage)
- **IA Adaptative** : Algorithmes de recommandation basés sur les performances (implémentés côté Backend)
