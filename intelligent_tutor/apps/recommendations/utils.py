"""
AI-powered recommendation engine utilities.
"""
from django.utils import timezone
from datetime import timedelta
from apps.recommendations.models import ContentRecommendation, AdaptiveRecommendationEngine, LearningStyleProfile
from apps.exercises.models import ExerciseAttempt, QuizAttempt
from apps.progress.models import LessonProgress, PerformanceAnalysis
from apps.courses.models import Course, Lesson
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from services.ml_service import MLService
from services.ai_service import AIService


def generate_recommendations(user, limit=5):
    """
    Generate personalized recommendations for a user using AI/ML.
    
    Factors considered:
    - Learning style profile
    - Recent performance
    - Learning pace
    - Completion status
    - Interest areas
    """
    
    try:
        engine = AdaptiveRecommendationEngine.objects.get(student=user)
    except AdaptiveRecommendationEngine.DoesNotExist:
        engine = AdaptiveRecommendationEngine.objects.create(student=user)
    
    if not engine.is_active:
        return ContentRecommendation.objects.none()
    
    # Get or create learning style profile
    try:
        learning_style = LearningStyleProfile.objects.get(student=user)
    except LearningStyleProfile.DoesNotExist:
        learning_style = LearningStyleProfile.objects.create(student=user)
    
    # Analyze user performance
    performance_data = analyze_user_performance(user)
    
    # Generate recommendations based on multiple factors
    recommendations = []
    
    # Factor 1: Weak areas that need improvement
    if performance_data['weaknesses']:
        weak_area_recs = recommend_for_weaknesses(user, performance_data['weaknesses'], engine)
        recommendations.extend(weak_area_recs)
    
    # Factor 2: Similar content based on learning style
    style_based_recs = recommend_by_learning_style(user, learning_style, engine)
    recommendations.extend(style_based_recs)
    
    # Factor 3: Next logical courses
    next_course_recs = recommend_next_courses(user, engine)
    recommendations.extend(next_course_recs)
    
    # Deduplicate and score recommendations
    unique_recs = deduplicate_recommendations(recommendations)
    scored_recs = score_recommendations(unique_recs, performance_data, learning_style, engine)
    
    # Sort by confidence score
    scored_recs.sort(key=lambda x: x['confidence'], reverse=True)
    
    # Save to database
    saved_recs = []
    for rec in scored_recs[:limit]:
        content_rec = ContentRecommendation.objects.create(
            student=user,
            content_type=rec['type'],
            content_id=rec['id'],
            content_title=rec['title'],
            confidence_score=rec['confidence'],
            reason=rec['reason'],
            recommendation_factors=rec['factors']
        )
        saved_recs.append(content_rec)
    
    # Update engine tracking
    engine.total_recommendations_generated += len(saved_recs)
    engine.last_recommendation_generated = timezone.now()
    if saved_recs:
        engine.average_recommendation_quality = np.mean([r.confidence_score for r in saved_recs])
    engine.save()
    
    return ContentRecommendation.objects.filter(id__in=[r.id for r in saved_recs])


def analyze_user_performance(user):
    """Analyze user's performance to identify strengths and weaknesses."""
    
    performance = {
        'strengths': [],
        'weaknesses': [],
        'average_score': 0,
        'recent_attempts': 0,
        'completion_rate': 0
    }
    
    # Get recent exercise attempts
    recent_attempts = ExerciseAttempt.objects.filter(
        student=user,
        submitted_at__gte=timezone.now() - timedelta(days=30)
    ).values('exercise__lesson__course__subject__name')
    
    if recent_attempts:
        subject_scores = {}
        for attempt in recent_attempts:
            subject = attempt['exercise__lesson__course__subject__name']
            subject_scores[subject] = subject_scores.get(subject, [])
            if attempt.get('score'):
                subject_scores[subject].append(attempt['score'])
        
        for subject, scores in subject_scores.items():
            avg = np.mean(scores) if scores else 0
            if avg >= 70:
                performance['strengths'].append(subject)
            elif avg < 50:
                performance['weaknesses'].append(subject)
        
        performance['average_score'] = np.mean([s for scores in subject_scores.values() for s in scores])
    
    # Get lesson progress
    lesson_progress = LessonProgress.objects.filter(
        student=user,
        status='completed'
    ).count()
    
    total_enrollments = user.course_enrollments.count()
    if total_enrollments > 0:
        performance['completion_rate'] = (lesson_progress / total_enrollments) * 100
    
    performance['recent_attempts'] = recent_attempts.count()
    
    # Use MLService for difficulty prediction if enough data
    if performance['recent_attempts'] >= 5:
        predicted_difficulty, confidence = MLService.predict_recommendation([
            performance['average_score'], 
            performance['recent_attempts'],
            performance['completion_rate']
        ])
        performance['suggested_difficulty'] = predicted_difficulty
        performance['difficulty_confidence'] = confidence
    else:
        performance['suggested_difficulty'] = 2 # Default easy
        performance['difficulty_confidence'] = 0.5
        
    return performance


def recommend_for_weaknesses(user, weaknesses, engine):
    """Recommend content for areas where user is weak."""
    
    recommendations = []
    
    for weakness in weaknesses:
        courses = Course.objects.filter(
            subject__name=weakness,
            level=user.level,
            status='published'
        ).exclude(
            enrollments__student=user
        )[:3]
        
        for course in courses:
            recommendations.append({
                'type': 'course',
                'id': course.id,
                'title': course.title,
                'reason': f'To improve your {weakness} skills',
                'factors': {'weakness_remediation': 1.0, 'subject': weakness},
                'confidence': 0.8
            })
    
    return recommendations


def recommend_by_learning_style(user, learning_style, engine):
    """Recommend content based on user's learning style."""
    
    recommendations = []
    
    # Find lessons that match learning style preferences and user level
    all_lessons = Lesson.objects.filter(
        course__status='published',
        course__level=user.level
    ).exclude(
        progress_records__student=user
    )[:5]
    
    for lesson in all_lessons:
        has_video = bool(lesson.video_url)
        has_resources = bool(lesson.resources)
        
        style_match = calculate_learning_style_match(
            lesson, learning_style, has_video, has_resources
        )
        
        if style_match > 0.5:
            recommendations.append({
                'type': 'lesson',
                'id': lesson.id,
                'title': lesson.title,
                'reason': f'Matches your {learning_style.primary_style} learning style',
                'factors': {'learning_style_match': style_match},
                'confidence': style_match
            })
    
    return recommendations


def recommend_next_courses(user, engine):
    """Recommend the next logical course based on completion."""
    
    recommendations = []
    
    # Get completed courses
    completed_courses = user.course_enrollments.filter(
        status='completed'
    ).values_list('course__id', flat=True)
    
    # Find next level courses
    last_course = user.course_enrollments.filter(
        status__in=['completed', 'in_progress']
    ).order_by('-completed_at').first()
    
    if last_course:
        # Recommend courses from same subject but next difficulty
        next_courses = Course.objects.filter(
            subject=last_course.course.subject,
            status='published',
            difficulty_level__gt=last_course.course.difficulty_level
        ).exclude(
            id__in=completed_courses
        )[:3]
        
        for course in next_courses:
            recommendations.append({
                'type': 'course',
                'id': course.id,
                'title': course.title,
                'reason': f'Next course in {course.subject.name}',
                'factors': {'progression': 1.0, 'subject_continuity': 1.0},
                'confidence': 0.7
            })
    
    return recommendations


def calculate_learning_style_match(lesson, learning_style, has_video, has_resources):
    """Calculate how well a lesson matches the user's learning style."""
    
    style_score = 0
    
    # Visual content
    if has_video and learning_style.visual_preference > 0.5:
        style_score += learning_style.visual_preference * 0.4
    
    # Resources (reading)
    if has_resources and learning_style.reading_writing_preference > 0.5:
        style_score += learning_style.reading_writing_preference * 0.3
    
    # Interactive (kinesthetic)
    if learning_style.kinesthetic_preference > 0.5:
        style_score += 0.2
    
    return min(style_score, 1.0)


def deduplicate_recommendations(recommendations):
    """Remove duplicate recommendations."""
    
    seen = set()
    unique = []
    
    for rec in recommendations:
        key = (rec['type'], rec['id'])
        if key not in seen:
            seen.add(key)
            unique.append(rec)
    
    return unique


def score_recommendations(recommendations, performance_data, learning_style, engine):
    """Score recommendations based on multiple factors."""
    
    for rec in recommendations:
        score = 0.5  # Base score
        
        # Performance factor
        score += engine.performance_weight * (1 if rec['factors'].get('weakness_remediation') else 0.5)
        
        # Learning style factor
        style_match = rec['factors'].get('learning_style_match', 0)
        score += engine.learning_style_weight * style_match
        
        # Progression factor
        progression = rec['factors'].get('progression', 0)
        score += 0.1 * progression
        
        rec['confidence'] = min(max(score, 0), 1)
    
    return recommendations


def analyze_performance_trends(user):
    """Generate performance analysis with AI insights."""
    
    from apps.exercises.models import Exercise
    from apps.courses.models import Subject
    
    # Get recent performance data
    recent_attempts = ExerciseAttempt.objects.filter(
        student=user,
        submitted_at__gte=timezone.now() - timedelta(days=90)
    )
    
    # Calculate subject scores
    subjects_scores = {}
    for attempt in recent_attempts:
        subject = attempt.exercise.lesson.course.subject.name
        if subject not in subjects_scores:
            subjects_scores[subject] = []
        if attempt.score:
            subjects_scores[subject].append(attempt.score)
    
    # Calculate overall metrics
    all_scores = [s for scores in subjects_scores.values() for s in scores]
    overall_score = np.mean(all_scores) if all_scores else 0
    
    # Identify strengths and weaknesses
    strengths = [s for s, scores in subjects_scores.items() if np.mean(scores) >= 75]
    weaknesses = [s for s, scores in subjects_scores.items() if np.mean(scores) < 50]
    
    # Generate recommendations
    ai_recommendations = []
    if weaknesses:
        ai_recommendations.append(f"Focus on improving {', '.join(weaknesses)}")
    if strengths:
        ai_recommendations.append(f"Great job in {', '.join(strengths)}! Keep it up!")
    
    # Calculate improvement trends
    improvement_trends = {}
    for subject, scores in subjects_scores.items():
        if len(scores) >= 2:
            trend = (scores[-1] - scores[0]) / len(scores)
            improvement_trends[subject] = round(trend, 2)
    
    return {
        'overall_score': round(overall_score, 2),
        'subjects_scores': {k: round(np.mean(v), 2) for k, v in subjects_scores.items()},
        'strengths': strengths,
        'weaknesses': weaknesses,
        'recommendations': ai_recommendations,
        'improvement_trends': improvement_trends,
    }
