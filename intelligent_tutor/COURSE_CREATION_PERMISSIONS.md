# Système de Permissions pour la Création de Cours

## Question: Qui peut créer des cours?

**Réponse: Admin ET Enseignant**

## Détails des Permissions

### Lecture des Cours (Publicly Available)
- ✅ **Tous les utilisateurs** (authentifiés ou non) peuvent:
  - Voir la liste des cours publiés
  - Consulter les détails d'un cours
  - Voir les leçons d'un cours

### Création de Cours (Restreint)
- ✅ **Admin** peut créer des cours
- ✅ **Enseignant (teacher)** peut créer des cours
- ❌ **Étudiant** CANNOT créer des cours
- ❌ **Parent** CANNOT créer des cours

### Édition/Suppression de Cours (Restreint)
- ✅ **Admin** peut éditer/supprimer n'importe quel cours
- ✅ **Enseignant** peut éditer/supprimer ses propres cours
  - *Note: Implémentation future si nécessaire*
- ❌ **Étudiant** CANNOT éditer/supprimer
- ❌ **Parent** CANNOT éditer/supprimer

## Architecture Technique

### Modèle Course
```python
class Course(models.Model):
    # ... autres champs ...
    created_by = ForeignKey(User, related_name='created_courses', null=True)
```

Le champ `created_by` enregistre **qui** a créé le cours.

### API ViewSet (courses/views.py)
```python
class CourseViewSet(viewsets.ModelViewSet):
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Tout le monde peut lire
        else:
            return [IsAdminOrTeacher()]  # Seulement admin/teacher
    
    def perform_create(self, serializer):
        # Assigner automatiquement l'utilisateur actuel comme créateur
        serializer.save(created_by=self.request.user)
```

### Classe de Permission Personnalisée
```python
class IsAdminOrTeacher(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'teacher']
```

## Flux d'Utilisation

### 1. Admin crée un cours
```
POST /api/courses/
Headers: Authorization: Bearer <token_admin>
Body: {
  "title": "Mathématiques Avancées",
  "description": "...",
  "subject": 1,
  "level": "secondary_6eme",
  "...": "..."
}
Response: 201 Created
- created_by = <admin_user>
```

### 2. Enseignant crée un cours
```
POST /api/courses/
Headers: Authorization: Bearer <token_teacher>
Body: {...}
Response: 201 Created
- created_by = <teacher_user>
```

### 3. Étudiant essaie de créer un cours
```
POST /api/courses/
Headers: Authorization: Bearer <token_student>
Response: 403 Forbidden
Message: "You do not have permission to perform this action."
```

### 4. N'importe qui consulte les cours
```
GET /api/courses/
(pas de header Authorization requise)
Response: 200 OK
- Liste tous les cours publiés
```

## Rôles Disponibles dans le Système

| Rôle | Créer Cours | Éditer Cours | Voir Cours | Enroll |
|------|:-----------:|:-----------:|:----------:|:------:|
| admin | ✅ | ✅ | ✅ | ✅ |
| teacher | ✅ | ✅* | ✅ | ✅ |
| student | ❌ | ❌ | ✅ | ✅ |
| parent | ❌ | ❌ | ✅ | ⚠️ |

*Enseignant peut éditer ses propres cours (futur)

## Implémentation Future (Possibilités)

### 1. Enseignant édite uniquement ses propres cours
```python
class IsTeacherOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if request.user.role == 'teacher':
            return obj.created_by == request.user
        return False
```

### 2. Dashboard Enseignant
- Liste des cours créés par cet enseignant
- Interface pour éditer/supprimer ses cours
- Statistiques d'engagement étudiant

### 3. Contrôle d'Accès Granulaire
- Enseignant peut déléguer modification à d'autres enseignants
- Approbation de cours par admin avant publication
- Brouillons (drafts) visibles seulement au créateur

## Test de Permissions

### Admin teste création de cours
```bash
curl -X POST http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer <token_admin>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Admin Course",
    "description": "...",
    "subject": 1,
    "level": "secondary_6eme",
    "difficulty_level": 2,
    "status": "published"
  }'
# Réponse: 201 Created (succès)
```

### Étudiant teste création de cours
```bash
curl -X POST http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer <token_student>" \
  -H "Content-Type: application/json" \
  -d '{...}'
# Réponse: 403 Forbidden (bloqué)
```

## Résumé

✅ **IMPLÉMENTION COMPLÈTE** - Admin et Enseignant peuvent créer des cours  
✅ **SÉCURISÉ** - Étudiants ne peuvent pas créer de cours  
✅ **TRAÇABILITÉ** - Chaque cours enregistre son créateur  
✅ **EXTENSIBLE** - Possibilités d'édits granulaires en futur  

**État:** Prêt pour production ✓
