"""
URLs for Progress app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.progress import views

router = DefaultRouter()
router.register(r'learning-paths', views.LearningPathViewSet, basename='learning-path')
router.register(r'lesson-progress', views.LessonProgressViewSet, basename='lesson-progress')
router.register(r'achievements', views.AchievementViewSet, basename='achievement')
router.register(r'my-achievements', views.StudentAchievementViewSet, basename='student-achievement')
router.register(r'performance-analysis', views.PerformanceAnalysisViewSet, basename='performance-analysis')

urlpatterns = [
    path('', include(router.urls)),
]
