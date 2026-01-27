import apiClient from './api';
import {
  User,
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

  myEnrolled: async (page = 1): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get('courses/courses/my_courses/', { params: { page } });
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

  submit: async (exerciseId: number, studentAnswer: string): Promise<ExerciseAttempt> => {
    const response = await apiClient.post('exercises/attempts/submit/', {
      exercise: exerciseId,
      student_answer: studentAnswer,
    });
    return response.data;
  },

  getAttempts: async (exerciseId: number): Promise<ExerciseAttempt[]> => {
    const response = await apiClient.get('exercises/attempts/', { params: { exercise: exerciseId } });
    return response.data.results || response.data;
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
};
