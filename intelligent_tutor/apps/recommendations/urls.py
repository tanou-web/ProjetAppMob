"""
URLs for Recommendations app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.recommendations import views
from apps.recommendations.prediction_api import (
    CorrectionAPIView, 
    ExerciseAnalysisAPIView, 
    ModelStatusAPIView,
    BulkCorrectionAPIView
)

router = DefaultRouter()
router.register(r'', views.ContentRecommendationViewSet, basename='recommendation')
router.register(r'learning-styles', views.LearningStyleProfileViewSet, basename='learning-style')
router.register(r'engines', views.AdaptiveRecommendationEngineViewSet, basename='recommendation-engine')
router.register(r'feedback', views.RecommendationFeedbackViewSet, basename='recommendation-feedback')
router.register(r'error-analyses', views.ErrorAnalysisViewSet, basename='error-analysis')
router.register(r'explanations', views.SmartExplanationViewSet, basename='smart-explanation')
router.register(r'revisions', views.IntelligentRevisionItemViewSet, basename='revision-item')

urlpatterns = [
    path('', include(router.urls)),
    
    # ML Prediction Endpoints
    path('correction/', CorrectionAPIView.as_view(), name='correction'),
    path('exercise-analysis/', ExerciseAnalysisAPIView.as_view(), name='exercise-analysis'),
    path('bulk-correction/', BulkCorrectionAPIView.as_view(), name='bulk-correction'),
    path('models/status/', ModelStatusAPIView.as_view(), name='model-status'),
]

