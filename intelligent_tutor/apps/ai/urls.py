"""AI URL Configuration."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.ai.views import AIViewSet, ai_status

router = DefaultRouter()
router.register(r'ai', AIViewSet, basename='ai')

urlpatterns = [
    path('', include(router.urls)),
    path('ai/status/', ai_status, name='ai-status'),
]
