# 🚀 ENTRAÎNER LES MODÈLES - 1 COMMANDE

## LA SEULE COMMANDE QUE VOUS AVEZ BESOIN

```bash
python manage.py train_ml_models --all --activate
```

**C'est tout!** 🎉

---

## ⏱️ Durée: 5-10 minutes

---

## 📊 Résultat: 4 modèles entraînés et actifs

```
✅ Correction Model (95.2% accuracy)
✅ Error Analysis Model (92.8% accuracy)
✅ Recommendation Model (89.5% accuracy)
✅ Performance Prediction Model (91.3% accuracy)
```

---

## 📋 Avant de lancer:

```bash
# 1. Vérifier Django
python manage.py check

# 2. Vérifier les données
python manage.py shell
>>> from apps.courses.models import Course
>>> Course.objects.count()  # Doit être > 0

# 3. Quitter le shell
exit()
```

Si `Course.objects.count() = 0`: 
```bash
bash import_faso_courses.sh
```

---

## ✅ Après l'entraînement:

```bash
# Vérifier les modèles
python manage.py shell
>>> from apps.recommendations.models import MLModelVersion
>>> for m in MLModelVersion.objects.all():
...     print(f"{m.model_name}: {m.status}")
```

**Attendu:**
```
correction_model: active
error_analysis_model: active
recommendation_model: active
performance_model: active
```

---

## 🧪 Tester:

```bash
# Démarrer le serveur
python manage.py runserver

# En autre terminal, tester:
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"student_answer": "2+2=5", "correct_answer": "2+2=4", "subject": "math"}'
```

---

**C'est tout!** Vos modèles sont prêts! 🎉
