"""
URLs for Courses app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.courses import views

router = DefaultRouter()
router.register(r'subjects', views.SubjectViewSet, basename='subject')
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'lessons', views.LessonViewSet, basename='lesson')

urlpatterns = [
    path('', include(router.urls)),
]
