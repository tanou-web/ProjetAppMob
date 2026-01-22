# Intelligent Tutor Mobile - Frontend React Native

Une application mobile puissante et moderne pour la plateforme d'apprentissage intelligent. Interface utilisateur intuitive avec support complet pour les cours, exercices, révision intelligente et suivi du progrès.

## 🎯 Fonctionnalités

### 📚 Gestion des Cours
- Liste des cours inscrits
- Navigation par cours et leçons
- Détails du cours avec descriptions

### 💪 Système d'Exercices
- Interface interactive pour répondre aux exercices
- Évaluation immédiate des réponses
- Feedback personnalisé
- Affichage du score et des points

### 🔄 Révision Intelligente (Spaced Repetition)
- Plan de révision personnalisé basé sur les erreurs
- Prédiction des prochaines dates de révision
- Suivi de la maîtrise des concepts
- Priorités intelligentes des items à réviser

### 📊 Suivi du Progrès
- Statistiques détaillées du learning
- Taux de réussite par cours
- Score moyen global
- Dernière activité
- Graphiques de performance

### 🧠 Analyse Intelligente des Erreurs
- Classification automatique des erreurs (6 types)
- Détection des misconceptions
- Explications personnalisées
- Recommandations d'amélioration

## 📦 Installation

```bash
# Installer les dépendances
npm install

# (Optionnel) Installer avec legacy-peer-deps
npm install --legacy-peer-deps
```

## 🚀 Démarrage

### Mode Développement
```bash
# Web (recommandé pour développement)
npm run web

# iOS (macOS uniquement)
npm run ios

# Android
npm run android

# Expo Go
npx expo start
```

## 📁 Structure du Projet

```
src/
├── screens/                 # Écrans principaux
│   ├── LoginScreen.tsx      # Authentification
│   ├── CoursesScreen.tsx    # Liste des cours
│   ├── ExerciseScreen.tsx   # Interface d'exercice
│   ├── RevisionScreen.tsx   # Plan de révision
│   └── ProgressScreen.tsx   # Suivi du progrès
├── services/                # Services API
│   ├── api.ts              # Configuration axios + interceptors
│   └── endpoints.ts        # Endpoints de l'API
├── store/                   # État global (Zustand)
│   ├── authStore.ts        # Gestion authentification
│   └── coursesStore.ts     # Gestion cours/exercices
└── types/                   # Types TypeScript
    └── index.ts            # Définitions de types
```

## 🔌 Configuration Backend

Modifiez `app.json`:

```json
{
  "expo": {
    "extra": {
      "API_URL": "http://localhost:8000/api"
    }
  }
}
```

## 🎨 Design System

- **Primaire**: `#3498db` (Bleu)
- **Secondaire**: `#2c3e50` (Gris-bleu)
- **Succès**: `#27ae60` (Vert)
- **Erreur**: `#e74c3c` (Rouge)
- **Warning**: `#f39c12` (Orange)

## 🔐 Authentification

Flux JWT avec refresh automatique:
1. Login → Récupère access + refresh tokens
2. Tokens stockés de manière sécurisée
3. Automatiquement ajoutés aux requêtes
4. Refresh automatique si expiré

## 📱 Écrans Principaux

### Login - Authentification
- Email/Mot de passe
- Validation des champs
- Gestion des erreurs

### Courses - Mes Cours
- Liste des cours inscrits
- Swipe to refresh
- Navigation vers exercices

### Exercise - Répondre
- Enoncé complet
- Editeur de réponse
- Résultat immédiat
- Feedback intelligent

### Revision - Plan Adaptatif
- Spaced repetition (Ebbinghaus)
- Priorisation intelligente
- Suivi maîtrise
- Dates recommandées

### Progress - Statistiques
- Score global
- Taux de réussite
- Points totaux
- Messages motivationnels

## 📝 Utilisation Rapide

```bash
# Démarrer en développement
npm run web

# Se connecter avec:
# Email: student1@example.com
# Mot de passe: (depuis Django)

# Naviguer: Cours → Exercice → Révision → Progrès
```

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| API_URL not found | Vérifier `app.json` extra.API_URL |
| Token errors | Vérifier SecureStore permissions |
| Metro error | `npx expo start --clear` |
| Build error | `rm -rf node_modules && npm install` |

## 📚 Dépendances Clés

- `react-native` - Framework UI
- `expo` - Plateforme
- `axios` - Client HTTP
- `zustand` - State management
- `@react-navigation` - Navigation
- `expo-secure-store` - Stockage sécurisé
- `typescript` - Type safety

## 🚀 Prêt à l'emploi

L'app est complètement intégrée avec le backend Django:
- ✅ Authentification JWT
- ✅ Gestion des cours/exercices
- ✅ Analyse intelligente des erreurs
- ✅ Révision adaptative
- ✅ Suivi du progrès
- ✅ Explications personnalisées

---

**Version**: 1.0.0  
**Compatible**: React Native 0.73+, Expo 50+
