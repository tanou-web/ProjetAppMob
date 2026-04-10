import apiClient from './api';
import {
  User,
  Lesson,
  Course,
  Exercise,
  ExerciseAttempt,
  ErrorAnalysis,
  SmartExplanation,
  IntelligentRevisionItem,
  RevisionPlan,
  ProgressData,
  AuthResponse,
  PaginatedResponse,
  ContentRecommendation,
} from '../types';

// ============ AUTH ============
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('token/', { email, password });
    return response.data;
  },

  signup: async (email: string, password: string, firstName: string, lastName: string, level: string, phone: string): Promise<User> => {
    const response = await apiClient.post('users/', {
      email,
      password,
      password_confirm: password, // Requis par le backend
      first_name: firstName,
      last_name: lastName,
      role: 'student', // Par défaut, rôle étudiant
      level,
      phone,
    });
    return response.data;
  },

  googleLogin: async (accessToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post('users/google_login/', {
      access_token: accessToken,
    });
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('users/profile/');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put('users/update_profile/', data);
    return response.data;
  },
};

// ============ COURSES ============
export const coursesAPI = {
  list: async (page = 1): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get('courses/courses/', { params: { page } });
    return response.data;
  },

  get: async (id: number): Promise<Course> => {
    const response = await apiClient.get(`courses/courses/${id}/`);
    return response.data;
  },

  enroll: async (courseId: number): Promise<any> => {
    const response = await apiClient.post(`courses/courses/${courseId}/enroll/`);
    return response.data;
  },

  unenroll: async (courseId: number): Promise<any> => {
    const response = await apiClient.post(`courses/courses/${courseId}/unenroll/`);
    return response.data;
  },

  myEnrolled: async (page = 1): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get('courses/courses/my_courses/', { params: { page } });
    return response.data;
  },
};

// ============ LESSONS ============
export const lessonsAPI = {
  get: async (id: number): Promise<Lesson> => {
    const response = await apiClient.get(`courses/lessons/${id}/`);
    return response.data;
  },
};

// ============ EXERCISES ============
export const exercisesAPI = {
  getByLesson: async (lessonId: number): Promise<Exercise[]> => {
    const response = await apiClient.get('exercises/exercises/', { params: { lesson_id: lessonId } });
    return response.data.results || response.data;
  },

  get: async (id: number): Promise<Exercise> => {
    const response = await apiClient.get(`exercises/exercises/${id}/`);
    return response.data;
  },

  submit: async (exerciseId: number, answer: string): Promise<any> => {
    const response = await apiClient.post('exercises/attempts/submit/', {
      exercise: exerciseId,
      student_answer: answer,
    });
    return response.data;
  },

  // Get adaptive exercises based on student performance
  getAdaptive: async (): Promise<any> => {
    const response = await apiClient.get('exercises/attempts/adaptive/');
    return response.data;
  },

  // Get lessons and exercises to review (score < 60%)
  getToReview: async (): Promise<any> => {
    const response = await apiClient.get('exercises/attempts/to_review/');
    return response.data;
  },

  getAttempts: async (exerciseId: number): Promise<ExerciseAttempt[]> => {
    const response = await apiClient.get('exercises/attempts/', { params: { exercise: exerciseId } });
    return response.data.results || response.data;
  },

  submitInteractive: async (lessonId: number, activityType: string, results: any[]): Promise<any> => {
    const response = await apiClient.post('exercises/attempts/submit-interactive/', {
      lesson_id: lessonId,
      activity_type: activityType,
      results: results,
    });
    return response.data;
  },
};

// ============ ERROR ANALYSIS ============
export const errorAnalysisAPI = {
  byErrorType: async (): Promise<any> => {
    const response = await apiClient.get('recommendations/error-analyses/by_error_type/');
    return response.data;
  },

  byConcept: async (): Promise<any> => {
    const response = await apiClient.get('recommendations/error-analyses/by_concept/');
    return response.data;
  },

  patterns: async (): Promise<any> => {
    const response = await apiClient.get('recommendations/error-analyses/patterns/');
    return response.data;
  },

  report: async (): Promise<any> => {
    const response = await apiClient.get('recommendations/error-analyses/report/');
    return response.data;
  },
};

// ============ EXPLANATIONS ============
export const explanationsAPI = {
  list: async (): Promise<SmartExplanation[]> => {
    const response = await apiClient.get('recommendations/explanations/');
    return response.data.results || response.data;
  },

  markHelpful: async (id: number, helpful: boolean): Promise<any> => {
    const response = await apiClient.post(`recommendations/explanations/${id}/mark_helpful/`, { was_helpful: helpful });
    return response.data;
  },

  rate: async (id: number, rating: number): Promise<any> => {
    const response = await apiClient.post(`recommendations/explanations/${id}/rate/`, { rating });
    return response.data;
  },
};

// ============ REVISION SYSTEM ============
export const revisionAPI = {
  revisionPlan: async (): Promise<RevisionPlan> => {
    const response = await apiClient.get('recommendations/revisions/revision_plan/');
    return response.data;
  },

  startSession: async (revisionId: number): Promise<any> => {
    const response = await apiClient.post(`recommendations/revisions/${revisionId}/start_session/`);
    return response.data;
  },

  completeSession: async (revisionId: number, masteryScore: number): Promise<any> => {
    const response = await apiClient.post(`recommendations/revisions/${revisionId}/complete_session/`, {
      mastery_score: masteryScore,
    });
    return response.data;
  },

  progress: async (): Promise<any> => {
    const response = await apiClient.get('recommendations/revisions/progress/');
    return response.data;
  },

  effectiveness: async (): Promise<any> => {
    const response = await apiClient.get('recommendations/revisions/effectiveness/');
    return response.data;
  },

  timing: async (concept?: string): Promise<any> => {
    const response = await apiClient.get('recommendations/revisions/timing/', {
      params: { concept }
    });
    return response.data;
  },
};

// ============ PROGRESS ============
export const progressAPI = {
  get: async (): Promise<ProgressData> => {
    const response = await apiClient.get('progress/learning-paths/statistics/');
    return response.data;
  },

  bySubject: async (): Promise<any> => {
    const response = await apiClient.get('progress/performance-analysis/insights/');
    return response.data;
  },

  byLevel: async (): Promise<any> => {
    // Note: this endpoint doesn't seem to exist in backend yet, mapping to latest analysis
    const response = await apiClient.get('progress/performance-analysis/latest/');
    return response.data;
  },
};

// ============ RECOMMENDATIONS ============
export const recommendationsAPI = {
  predict: async (data: any): Promise<any> => {
    const response = await apiClient.post('recommendations/correction/', data);
    return response.data;
  },

  generate: async (): Promise<any> => {
    const response = await apiClient.post('recommendations/engines/regenerate_recommendations/');
    return response.data;
  },

  pending: async (): Promise<PaginatedResponse<ContentRecommendation>> => {
    const response = await apiClient.get('recommendations/pending/');
    return response.data;
  },
};

// ============ AI SERVICES ============
export const aiAPI = {
  chat: async (message: string, subject?: string, lessonId?: number, conversationHistory?: any[]): Promise<any> => {
    const response = await apiClient.post('ai/chat/', {
      message,
      subject,
      lesson_id: lessonId,
      conversation_history: conversationHistory,
    });
    return response.data;
  },

  analyzeError: async (attemptId: number): Promise<any> => {
    const response = await apiClient.post('ai/analyze_error/', {
      attempt_id: attemptId,
    });
    return response.data;
  },

  parentReport: async (period: 'week' | 'month' | 'all' = 'month'): Promise<any> => {
    const response = await apiClient.get(`ai/parent_report/?period=${period}`);
    return response.data;
  },

  suggestExercises: async (subject?: string): Promise<any> => {
    const url = subject ? `ai/suggest_exercises/?subject=${subject}` : 'ai/suggest_exercises/';
    const response = await apiClient.get(url);
    return response.data;
  },

  status: async (): Promise<any> => {
    const response = await apiClient.get('ai/status/');
    return response.data;
  },

  visionCorrection: async (imageB64: string, exerciseId?: number): Promise<any> => {
    const response = await apiClient.post('ai/vision-correction/', {
      image: imageB64,
      exercise_id: exerciseId,
    });
    return response.data;
  },

  lessonAudio: async (text: string): Promise<any> => {
    const response = await apiClient.post('ai/lesson_audio/', { text });
    return response.data;
  },
};

// Export base URL for direct use
export const endpoints = {
  base: 'http://localhost:8000/api',
};
