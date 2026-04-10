"""
URLs for Users app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users import views

router = DefaultRouter()
router.register(r'', views.UserViewSet, basename='user')
router.register(r'student-profiles', views.StudentProfileViewSet, basename='student-profile')
router.register(r'teacher-profiles', views.TeacherProfileViewSet, basename='teacher-profile')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('', include(router.urls)),
]
