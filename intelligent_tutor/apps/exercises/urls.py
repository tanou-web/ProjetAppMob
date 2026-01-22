"""
URLs for Exercises app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.exercises import views

router = DefaultRouter()
router.register(r'exercises', views.ExerciseViewSet, basename='exercise')
router.register(r'attempts', views.ExerciseAttemptViewSet, basename='exercise-attempt')
router.register(r'quizzes', views.QuizViewSet, basename='quiz')
router.register(r'quiz-attempts', views.QuizAttemptViewSet, basename='quiz-attempt')

urlpatterns = [
    path('', include(router.urls)),
]
