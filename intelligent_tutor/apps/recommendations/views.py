"""
Views for Recommendations app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from apps.recommendations.models import (
    ContentRecommendation, LearningStyleProfile,
    AdaptiveRecommendationEngine, RecommendationFeedback,
    ErrorAnalysis, IntelligentRevisionItem, SmartExplanation
)
from apps.recommendations.serializers import (
    ContentRecommendationSerializer, LearningStyleProfileSerializer,
    AdaptiveRecommendationEngineSerializer, RecommendationFeedbackSerializer,
    ErrorAnalysisSerializer, IntelligentRevisionItemSerializer, SmartExplanationSerializer
)
from apps.recommendations.error_analysis import ErrorAnalyzer, ErrorPatternAnalyzer, DetailedErrorReport
from apps.recommendations.explanation_generator import ExplanationGenerator
from apps.recommendations.revision_system import IntelligentRevisionEngine, RevisionProgressTracker, AdaptiveRevisionScheduler


class ContentRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for content recommendations."""
    
    serializer_class = ContentRecommendationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['-confidence_score', '-created_at']
    
    def get_queryset(self):
        return ContentRecommendation.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending (unviewed) recommendations."""
        recommendations = self.get_queryset().filter(is_viewed=False)
        
        page = self.paginate_queryset(recommendations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_viewed(self, request, pk=None):
        """Mark a recommendation as viewed."""
        recommendation = self.get_object()
        
        if recommendation.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        from django.utils import timezone
        recommendation.is_viewed = True
        recommendation.viewed_at = timezone.now()
        recommendation.save()
        
        serializer = self.get_serializer(recommendation)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept a recommendation."""
        recommendation = self.get_object()
        
        if recommendation.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        recommendation.is_accepted = True
        recommendation.save()
        
        serializer = self.get_serializer(recommendation)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate a recommendation."""
        recommendation = self.get_object()
        
        if recommendation.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        rating = request.data.get('rating')
        if not rating or rating < 1 or rating > 5:
            return Response(
                {'detail': 'Rating must be between 1 and 5.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recommendation.user_rating = rating
        recommendation.save()
        
        serializer = self.get_serializer(recommendation)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_content_type(self, request):
        """Get recommendations filtered by content type."""
        content_type = request.query_params.get('type')
        
        if not content_type:
            return Response(
                {'detail': 'type parameter required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recommendations = self.get_queryset().filter(content_type=content_type)
        
        page = self.paginate_queryset(recommendations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)


class LearningStyleProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for learning style profiles."""
    
    serializer_class = LearningStyleProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return LearningStyleProfile.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current user's learning style profile."""
        profile = get_object_or_404(LearningStyleProfile, student=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'])
    def update_my_profile(self, request):
        """Update current user's learning style profile."""
        profile = get_object_or_404(LearningStyleProfile, student=request.user)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def analysis(self, request):
        """Get detailed learning style analysis."""
        profile = get_object_or_404(LearningStyleProfile, student=request.user)
        
        analysis = {
            'primary_style': profile.primary_style,
            'secondary_style': profile.secondary_style,
            'preferences': {
                'visual': profile.visual_preference,
                'auditory': profile.auditory_preference,
                'kinesthetic': profile.kinesthetic_preference,
                'reading_writing': profile.reading_writing_preference,
            },
            'pace': profile.pace_preference,
            'difficulty_preference': profile.difficulty_preference,
            'recommendations': self._get_style_recommendations(profile)
        }
        
        return Response(analysis)
    
    def _get_style_recommendations(self, profile):
        """Generate recommendations based on learning style."""
        recommendations = {
            'visual': 'Focus on courses with diagrams, videos, and visual content.',
            'auditory': 'Look for courses with lectures, discussions, and audio content.',
            'kinesthetic': 'Prefer hands-on exercises and interactive activities.',
            'reading_writing': 'Study with text-based materials and note-taking.',
        }
        
        primary_rec = recommendations.get(profile.primary_style, '')
        secondary_rec = recommendations.get(profile.secondary_style, '') if profile.secondary_style else ''
        
        return [primary_rec, secondary_rec] if secondary_rec else [primary_rec]


class AdaptiveRecommendationEngineViewSet(viewsets.ModelViewSet):
    """ViewSet for adaptive recommendation engines."""
    
    serializer_class = AdaptiveRecommendationEngineSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AdaptiveRecommendationEngine.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_engine(self, request):
        """Get current user's recommendation engine configuration."""
        engine = get_object_or_404(AdaptiveRecommendationEngine, student=request.user)
        serializer = self.get_serializer(engine)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def regenerate_recommendations(self, request):
        """Trigger recommendation regeneration."""
        from apps.recommendations.utils import generate_recommendations
        
        user = request.user
        recommendations = generate_recommendations(user)
        
        return Response({
            'status': 'Recommendations generated',
            'count': recommendations.count()
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get recommendation statistics."""
        engine = get_object_or_404(AdaptiveRecommendationEngine, student=request.user)
        
        stats = {
            'total_recommendations_generated': engine.total_recommendations_generated,
            'average_quality': engine.average_recommendation_quality,
            'last_generated': engine.last_recommendation_generated,
            'is_active': engine.is_active,
        }
        
        return Response(stats)


class RecommendationFeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for recommendation feedback."""
    
    serializer_class = RecommendationFeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return RecommendationFeedback.objects.filter(
            recommendation__student=self.request.user
        )
    
    def create(self, request, *args, **kwargs):
        """Create feedback for a recommendation."""
        recommendation_id = request.data.get('recommendation')
        recommendation = get_object_or_404(ContentRecommendation, id=recommendation_id)
        
        if recommendation.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ErrorAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for error analysis."""
    
    serializer_class = ErrorAnalysisSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['error_type', '-created_at', '-concept_understanding_level']
    
    def get_queryset(self):
        return ErrorAnalysis.objects.filter(student=self.request.user).select_related('exercise')
    
    @action(detail=False, methods=['get'])
    def by_error_type(self, request):
        """Get error analyses grouped by error type."""
        analyses = self.get_queryset()
        error_types = {}
        
        for analysis in analyses:
            if analysis.error_type not in error_types:
                error_types[analysis.error_type] = []
            error_types[analysis.error_type].append(ErrorAnalysisSerializer(analysis).data)
        
        return Response(error_types)
    
    @action(detail=False, methods=['get'])
    def by_concept(self, request):
        """Get error analyses grouped by concept."""
        analyses = self.get_queryset()
        concepts = {}
        
        for analysis in analyses:
            if analysis.concept_involved not in concepts:
                concepts[analysis.concept_involved] = []
            concepts[analysis.concept_involved].append(ErrorAnalysisSerializer(analysis).data)
        
        return Response(concepts)
    
    @action(detail=False, methods=['get'])
    def patterns(self, request):
        """Get error patterns analysis."""
        days_back = request.query_params.get('days_back', 30)
        try:
            days_back = int(days_back)
        except ValueError:
            days_back = 30
        
        patterns_data = ErrorPatternAnalyzer.analyze_student_patterns(request.user, days_back=days_back)
        return Response(patterns_data)
    
    @action(detail=False, methods=['get'])
    def report(self, request):
        """Get detailed error report."""
        days_back = request.query_params.get('days_back', 30)
        try:
            days_back = int(days_back)
        except ValueError:
            days_back = 30
        
        report = DetailedErrorReport.generate_report(request.user, days_back=days_back)
        return Response(report)


class SmartExplanationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for smart explanations."""
    
    serializer_class = SmartExplanationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['explanation_type', '-created_at']
    
    def get_queryset(self):
        return SmartExplanation.objects.filter(student=self.request.user).select_related('exercise_attempt')
    
    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        """Mark explanation as helpful."""
        explanation = self.get_object()
        
        if explanation.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        explanation.was_helpful = True
        explanation.save()
        
        return Response({'status': 'marked as helpful'})
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate an explanation."""
        explanation = self.get_object()
        
        if explanation.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        rating = request.data.get('rating')
        if rating is None:
            return Response({'detail': 'Rating is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                raise ValueError
        except ValueError:
            return Response({'detail': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
        
        explanation.student_rating = rating
        explanation.save()
        
        return Response({'status': 'rated', 'rating': rating})


class IntelligentRevisionItemViewSet(viewsets.ModelViewSet):
    """ViewSet for intelligent revision items."""
    
    serializer_class = IntelligentRevisionItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['priority_score', 'status', '-created_at']
    
    def get_queryset(self):
        return IntelligentRevisionItem.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def revision_plan(self, request):
        """Get personalized revision plan."""
        limit = request.query_params.get('limit', 10)
        try:
            limit = int(limit)
        except ValueError:
            limit = 10
        
        revision_items = IntelligentRevisionEngine.create_revision_plan(request.user, limit=limit)
        serializer = self.get_serializer(revision_items, many=True)
        
        return Response({
            'count': len(revision_items),
            'items': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def start_session(self, request, pk=None):
        """Start a revision session."""
        revision_item = self.get_object()
        
        if revision_item.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        session_data = IntelligentRevisionEngine.start_revision_session(revision_item)
        return Response(session_data)
    
    @action(detail=True, methods=['post'])
    def complete_session(self, request, pk=None):
        """Complete a revision session."""
        revision_item = self.get_object()
        
        if revision_item.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        mastery_score = request.data.get('mastery_score')
        if mastery_score is None:
            return Response({'detail': 'mastery_score is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mastery_score = float(mastery_score)
            if mastery_score < 0 or mastery_score > 100:
                raise ValueError
        except ValueError:
            return Response({'detail': 'mastery_score must be between 0 and 100'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = IntelligentRevisionEngine.complete_revision_session(revision_item, mastery_score)
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def progress(self, request):
        """Get revision progress."""
        progress = RevisionProgressTracker.get_revision_progress(request.user)
        return Response(progress)
    
    @action(detail=False, methods=['get'])
    def effectiveness(self, request):
        """Get revision effectiveness analysis."""
        days_back = request.query_params.get('days_back', 30)
        try:
            days_back = int(days_back)
        except ValueError:
            days_back = 30
        
        effectiveness = RevisionProgressTracker.get_revision_effectiveness(request.user, days_back=days_back)
        return Response(effectiveness)
    
    @action(detail=False, methods=['get'])
    def timing(self, request):
        """Get recommended revision timing."""
        concept = request.query_params.get('concept')
        if not concept:
            return Response({'detail': 'concept parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        timing = AdaptiveRevisionScheduler.recommend_revision_timing(request.user, concept)
        return Response(timing)
