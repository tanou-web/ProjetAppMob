# 🔌 Guide d'Intégration - Utiliser les Modèles dans l'Application

## 📌 Vue d'ensemble

Une fois les modèles entraînés, vous avez plusieurs façons de les utiliser dans votre application Django.

---

## 1️⃣ INTÉGRATION REST API (Recommandée)

### Configuration URLs

```python
# apps/recommendations/urls.py

from django.urls import path
from .prediction_api import (
    CorrectionAPIView,
    ExerciseAnalysisAPIView,
    BulkCorrectionAPIView,
    ModelStatusAPIView,
    TrainingProgressAPIView,
)

urlpatterns = [
    # Correction d'exercices
    path('api/correction/', CorrectionAPIView.as_view(), name='correction'),
    path('api/exercise-analysis/', ExerciseAnalysisAPIView.as_view(), name='exercise-analysis'),
    path('api/bulk-correction/', BulkCorrectionAPIView.as_view(), name='bulk-correction'),
    
    # Monitoring
    path('api/models/status/', ModelStatusAPIView.as_view(), name='model-status'),
    path('api/training/progress/', TrainingProgressAPIView.as_view(), name='training-progress'),
]
```

Ajouter à `config/urls.py`:
```python
path('recommendations/', include('apps.recommendations.urls')),
```

### Utilisation depuis le Frontend

#### HTML/JavaScript

```html
<!-- Formulaire de correction -->
<form id="exerciseForm">
    <input type="text" id="question" placeholder="Question">
    <input type="text" id="answer" placeholder="Réponse élève">
    <button type="submit">Corriger</button>
    <div id="result"></div>
</form>

<script>
document.getElementById('exerciseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    
    const response = await fetch('/recommendations/api/correction/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
            question: question,
            student_answer: answer,
            subject: 'math',
            level: 'primary_cp1'
        })
    });
    
    const result = await response.json();
    
    const html = `
        <h3>${result.is_correct ? '✅ Correct!' : '❌ Incorrect'}</h3>
        <p>Confiance: ${(result.confidence * 100).toFixed(0)}%</p>
        <p>Explication: ${result.explanation}</p>
        <p>Conseil: ${result.tips}</p>
    `;
    
    document.getElementById('result').innerHTML = html;
});
</script>
```

#### React.js

```javascript
import React, { useState } from 'react';

function ExerciseCorrector() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCorrect = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/recommendations/api/correction/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    student_answer: answer,
                    subject: 'math',
                    level: 'primary_cp1'
                })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleCorrect}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Question"
                />
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Réponse"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Vérification...' : 'Corriger'}
                </button>
            </form>

            {result && (
                <div className={result.is_correct ? 'correct' : 'incorrect'}>
                    <h3>{result.is_correct ? '✅ Correct!' : '❌ Incorrect'}</h3>
                    <p>Confiance: {(result.confidence * 100).toFixed(0)}%</p>
                    <p>{result.explanation}</p>
                    <p>{result.tips}</p>
                </div>
            )}
        </div>
    );
}

export default ExerciseCorrector;
```

#### Vue.js

```vue
<template>
    <div class="exercise-corrector">
        <form @submit.prevent="correctExercise">
            <input 
                v-model="question" 
                type="text" 
                placeholder="Question"
            >
            <input 
                v-model="answer" 
                type="text" 
                placeholder="Réponse"
            >
            <button type="submit" :disabled="loading">
                {{ loading ? 'Vérification...' : 'Corriger' }}
            </button>
        </form>

        <div 
            v-if="result"
            :class="result.is_correct ? 'correct' : 'incorrect'"
        >
            <h3>{{ result.is_correct ? '✅ Correct!' : '❌ Incorrect' }}</h3>
            <p>Confiance: {{ (result.confidence * 100).toFixed(0) }}%</p>
            <p>{{ result.explanation }}</p>
            <p>{{ result.tips }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            question: '',
            answer: '',
            result: null,
            loading: false
        };
    },
    methods: {
        async correctExercise() {
            this.loading = true;
            try {
                const response = await fetch('/recommendations/api/correction/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        question: this.question,
                        student_answer: this.answer,
                        subject: 'math',
                        level: 'primary_cp1'
                    })
                });

                this.result = await response.json();
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
```

---

## 2️⃣ INTÉGRATION DIRECTE PYTHON

### Dans les vues Django

```python
# apps/exercises/views.py

from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from apps.recommendations.training_pipeline import PredictionService
from .models import Exercise, StudentAnswer

@login_required
def submit_exercise(request, exercise_id):
    """Soumettre une réponse et obtenir correction automatique"""
    
    exercise = get_object_or_404(Exercise, id=exercise_id)
    
    if request.method == 'POST':
        student_answer = request.POST.get('answer', '')
        
        # Corriger avec le modèle IA
        service = PredictionService()
        result = service.correct_exercise(
            question=exercise.question,
            student_answer=student_answer,
            subject=exercise.subject.name.lower(),
            level=exercise.course.level
        )
        
        # Sauvegarder la réponse
        answer_record = StudentAnswer.objects.create(
            student=request.user,
            exercise=exercise,
            text=student_answer,
            is_correct=result['is_correct'],
            error_type=result['error_type'],
            confidence=result['confidence'],
            ai_generated_feedback=result.get('explanation', '')
        )
        
        context = {
            'exercise': exercise,
            'student_answer': student_answer,
            'is_correct': result['is_correct'],
            'confidence': result['confidence'],
            'error_type': result['error_type'],
            'tips': result.get('tips', ''),
            'correct_answer': exercise.correct_answer,
            'explanation': exercise.explanation,
        }
        
        return render(request, 'exercises/result.html', context)
    
    return render(request, 'exercises/exercise.html', {'exercise': exercise})
```

### Dans les modèles Django

```python
# apps/exercises/models.py

from django.db import models
from django.contrib.auth.models import User
from apps.courses.models import Course

class StudentAnswer(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    text = models.TextField()
    is_correct = models.BooleanField(null=True)
    error_type = models.CharField(max_length=50, null=True, blank=True)
    confidence = models.FloatField(default=0.0)
    ai_generated_feedback = models.TextField(blank=True)
    teacher_feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def get_ai_explanation(self):
        """Obtenir explication IA"""
        from apps.recommendations.training_pipeline import PredictionService
        
        service = PredictionService()
        result = service.correct_exercise(
            question=self.exercise.question,
            student_answer=self.text,
            subject=self.exercise.subject.name.lower(),
            level=self.exercise.course.level
        )
        
        return result.get('explanation', 'Explication non disponible')
```

### Dans les signals Django

```python
# apps/exercises/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import StudentAnswer
from apps.recommendations.training_pipeline import PredictionService

@receiver(post_save, sender=StudentAnswer)
def auto_correct_answer(sender, instance, created, **kwargs):
    """Corriger automatiquement les réponses"""
    
    if created and not instance.is_correct:  # Si nouvelle réponse incorrecte
        service = PredictionService()
        result = service.correct_exercise(
            question=instance.exercise.question,
            student_answer=instance.text,
            subject=instance.exercise.subject.name.lower(),
            level=instance.exercise.course.level
        )
        
        # Mettre à jour les champs
        instance.is_correct = result['is_correct']
        instance.error_type = result['error_type']
        instance.confidence = result['confidence']
        instance.ai_generated_feedback = result.get('explanation', '')
        instance.save(update_fields=['is_correct', 'error_type', 'confidence', 'ai_generated_feedback'])
```

---

## 3️⃣ INTÉGRATION AVEC CELERY (Tâches asynchrones)

### Configuration Celery

```python
# config/celery.py

import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('intelligent_tutor')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

### Tâche Celery pour correction

```python
# apps/exercises/tasks.py

from celery import shared_task
from django.core.cache import cache
from apps.recommendations.training_pipeline import PredictionService
from .models import StudentAnswer, Exercise
from django.contrib.auth.models import User

@shared_task(bind=True)
def correct_exercise_async(self, student_id, exercise_id, student_answer):
    """Corriger un exercice de manière asynchrone"""
    
    try:
        student = User.objects.get(id=student_id)
        exercise = Exercise.objects.get(id=exercise_id)
        
        # Corriger
        service = PredictionService()
        result = service.correct_exercise(
            question=exercise.question,
            student_answer=student_answer,
            subject=exercise.subject.name.lower(),
            level=exercise.course.level
        )
        
        # Sauvegarder
        answer = StudentAnswer.objects.create(
            student=student,
            exercise=exercise,
            text=student_answer,
            is_correct=result['is_correct'],
            error_type=result['error_type'],
            confidence=result['confidence'],
            ai_generated_feedback=result.get('explanation', '')
        )
        
        # Cache le résultat
        cache.set(f'correction_{answer.id}', result, timeout=3600)
        
        return {
            'answer_id': answer.id,
            'is_correct': result['is_correct'],
            'confidence': result['confidence']
        }
    
    except Exception as e:
        self.retry(exc=e, countdown=60)

@shared_task
def batch_correct_exercises(exercise_ids, student_id):
    """Corriger plusieurs exercices en batch"""
    
    service = PredictionService()
    results = []
    
    for exercise_id in exercise_ids:
        # ... correction logic
        pass
    
    return results
```

### Utiliser depuis une vue

```python
# Dans une vue Django

@login_required
def submit_exercise_async(request, exercise_id):
    """Soumettre un exercice avec correction asynchrone"""
    
    student_answer = request.POST.get('answer', '')
    
    # Lancer la tâche asynchrone
    from .tasks import correct_exercise_async
    task = correct_exercise_async.delay(
        request.user.id,
        exercise_id,
        student_answer
    )
    
    return JsonResponse({
        'task_id': task.id,
        'status': 'processing'
    })

@login_required
def get_correction_result(request, task_id):
    """Récupérer le résultat de la correction"""
    
    from celery.result import AsyncResult
    
    task = AsyncResult(task_id)
    
    if task.ready():
        return JsonResponse(task.result)
    else:
        return JsonResponse({
            'status': 'pending',
            'progress': task.info
        })
```

---

## 4️⃣ MONITORING ET LOGGING

### Configuration logging

```python
# settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/predictions.log',
        },
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'apps.recommendations': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Logger les prédictions

```python
# apps/recommendations/training_pipeline.py

import logging

logger = logging.getLogger(__name__)

class PredictionService:
    def correct_exercise(self, question, student_answer, subject, level):
        # ... correction logic
        
        logger.info(
            f"Correction: {subject}/{level} - Correct: {result['is_correct']} "
            f"Confidence: {result['confidence']:.2%}"
        )
        
        return result
```

---

## 5️⃣ DASHBOARD DE MONITORING

### Django admin personnalisé

```python
# apps/recommendations/admin.py

from django.contrib import admin
from .models_ml import MLModelVersion
from apps.exercises.models import StudentAnswer

@admin.register(MLModelVersion)
class MLModelVersionAdmin(admin.ModelAdmin):
    list_display = ('version', 'model_type', 'status', 'accuracy', 'trained_at')
    list_filter = ('status', 'model_type', 'trained_at')
    readonly_fields = ('trained_at',)
    
    fieldsets = (
        ('Modèle', {'fields': ('version', 'model_type', 'status')}),
        ('Métriques', {'fields': ('accuracy', 'precision', 'recall', 'f1_score')}),
        ('Config', {'fields': ('hyperparameters', 'training_samples_count')}),
        ('Timing', {'fields': ('trained_at', 'training_duration')}),
    )

@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('student', 'exercise', 'is_correct', 'created_at')
    list_filter = ('is_correct', 'created_at')
    search_fields = ('student__username', 'exercise__title')
```

---

## 6️⃣ TESTS

### Tests unitaires

```python
# tests/test_prediction_service.py

from django.test import TestCase
from apps.recommendations.training_pipeline import PredictionService

class PredictionServiceTestCase(TestCase):
    
    def setUp(self):
        self.service = PredictionService()
    
    def test_correct_answer(self):
        """Tester une réponse correcte"""
        result = self.service.correct_exercise(
            question="2 + 3 = ?",
            student_answer="5",
            subject="math",
            level="primary_cp1"
        )
        
        self.assertTrue(result['is_correct'])
        self.assertGreater(result['confidence'], 0.8)
    
    def test_incorrect_answer(self):
        """Tester une réponse incorrecte"""
        result = self.service.correct_exercise(
            question="2 + 3 = ?",
            student_answer="4",
            subject="math",
            level="primary_cp1"
        )
        
        self.assertFalse(result['is_correct'])
        self.assertIsNotNone(result['error_type'])

    def test_api_endpoint(self):
        """Tester l'endpoint API"""
        response = self.client.post('/recommendations/api/correction/', {
            'question': '2 + 3 = ?',
            'student_answer': '5',
            'subject': 'math',
            'level': 'primary_cp1'
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['is_correct'])
```

### Tests d'intégration

```bash
# Lancer les tests
python manage.py test apps.recommendations.tests

# Avec couverture
pip install coverage
coverage run --source='apps' manage.py test
coverage report
```

---

## 📝 Checklist d'Intégration

- [ ] Entraîner les modèles (`python manage.py train_ml_models --all`)
- [ ] Vérifier les modèles dans Django Admin
- [ ] Configurer les URLs pour l'API
- [ ] Tester l'endpoint `/api/correction/`
- [ ] Intégrer dans le frontend
- [ ] Configurer logging et monitoring
- [ ] Écrire les tests
- [ ] Déployer en production
- [ ] Monitorer les performances

---

## 🆘 Problèmes courants

### "Model not found"
```python
# Solution: Vérifier qu'il y a un modèle actif
from apps.recommendations.models_ml import MLModelVersion

active = MLModelVersion.objects.filter(model_type='correction', status='active')
if not active.exists():
    print("❌ Aucun modèle actif. Entraîner d'abord:")
    # python manage.py train_ml_models --all --activate
```

### Lenteur des prédictions
```python
# Solution: Cacher les résultats
from django.core.cache import cache

cache_key = f"prediction_{question}_{answer}"
cached_result = cache.get(cache_key)

if cached_result:
    return cached_result

# Sinon faire la prédiction et cacher
result = service.correct_exercise(...)
cache.set(cache_key, result, timeout=3600)
```

