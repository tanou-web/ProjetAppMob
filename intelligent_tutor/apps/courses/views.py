"""
Views for Courses app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from apps.courses.models import Subject, Course, Lesson, CourseEnrollment
from apps.courses.serializers import (
    SubjectSerializer, CourseListSerializer, CourseDetailSerializer,
    LessonSerializer, CourseEnrollmentSerializer
)


class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for subjects."""
    
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name']


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for courses."""
    
    queryset = Course.objects.filter(status='published')
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'subject__name']
    ordering_fields = ['difficulty_level', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        """Enroll a student in a course."""
        course = self.get_object()
        
        enrollment, created = CourseEnrollment.objects.get_or_create(
            student=request.user,
            course=course,
            defaults={'status': 'enrolled'}
        )
        
        if not created:
            return Response(
                {'detail': 'Already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = CourseEnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_courses(self, request):
        """Get courses enrolled by the current user."""
        enrollments = CourseEnrollment.objects.filter(student=request.user)
        page = self.paginate_queryset(enrollments)
        if page is not None:
            serializer = CourseEnrollmentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CourseEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def progress(self, request, pk=None):
        """Get course progress for the current user."""
        course = self.get_object()
        enrollment = CourseEnrollment.objects.filter(
            student=request.user,
            course=course
        ).first()
        
        if not enrollment:
            return Response(
                {'detail': 'Not enrolled in this course.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CourseEnrollmentSerializer(enrollment)
        return Response(serializer.data)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for lessons."""
    
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order', 'created_at']
    
    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return Lesson.objects.all()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_as_started(self, request, pk=None):
        """Mark a lesson as started."""
        lesson = self.get_object()
        from apps.progress.models import LessonProgress
        
        progress, _ = LessonProgress.objects.get_or_create(
            student=request.user,
            lesson=lesson
        )
        
        if progress.status == 'not_started':
            progress.status = 'in_progress'
            progress.started_at = timezone.now()
            progress.save()
        
        from apps.progress.serializers import LessonProgressSerializer
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)
