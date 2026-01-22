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
    const response = await apiClient.post('/token/', { email, password });
    return response.data;
  },

  signup: async (email: string, password: string, firstName: string, lastName: string): Promise<User> => {
    const response = await apiClient.post('/users/', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('/users/me/');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch('/users/me/', data);
    return response.data;
  },
};

// ============ COURSES ============
export const coursesAPI = {
  list: async (page = 1): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get('/courses/', { params: { page } });
    return response.data;
  },

  get: async (id: number): Promise<Course> => {
    const response = await apiClient.get(`/courses/${id}/`);
    return response.data;
  },

  enroll: async (courseId: number): Promise<any> => {
    const response = await apiClient.post(`/courses/${courseId}/enroll/`);
    return response.data;
  },

  unenroll: async (courseId: number): Promise<any> => {
    const response = await apiClient.post(`/courses/${courseId}/unenroll/`);
    return response.data;
  },

  myEnrolled: async (page = 1): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get('/courses/my-courses/', { params: { page } });
    return response.data;
  },
};

// ============ EXERCISES ============
export const exercisesAPI = {
  getByLesson: async (lessonId: number): Promise<Exercise[]> => {
    const response = await apiClient.get(`/lessons/${lessonId}/exercises/`);
    return response.data.results || response.data;
  },

  get: async (id: number): Promise<Exercise> => {
    const response = await apiClient.get(`/exercises/${id}/`);
    return response.data;
  },

  submit: async (exerciseId: number, studentAnswer: string): Promise<ExerciseAttempt> => {
    const response = await apiClient.post(`/exercises/${exerciseId}/submit/`, {
      student_answer: studentAnswer,
    });
    return response.data;
  },

  getAttempts: async (exerciseId: number): Promise<ExerciseAttempt[]> => {
    const response = await apiClient.get(`/exercises/${exerciseId}/attempts/`);
    return response.data.results || response.data;
  },
};

// ============ ERROR ANALYSIS ============
export const errorAnalysisAPI = {
  byErrorType: async (): Promise<any> => {
    const response = await apiClient.get('/error-analyses/by_error_type/');
    return response.data;
  },

  byConcept: async (): Promise<any> => {
    const response = await apiClient.get('/error-analyses/by_concept/');
    return response.data;
  },

  patterns: async (): Promise<any> => {
    const response = await apiClient.get('/error-analyses/patterns/');
    return response.data;
  },

  report: async (): Promise<any> => {
    const response = await apiClient.get('/error-analyses/report/');
    return response.data;
  },
};

// ============ EXPLANATIONS ============
export const explanationsAPI = {
  list: async (): Promise<SmartExplanation[]> => {
    const response = await apiClient.get('/explanations/');
    return response.data.results || response.data;
  },

  markHelpful: async (id: number, helpful: boolean): Promise<any> => {
    const response = await apiClient.post(`/explanations/${id}/mark_helpful/`, { was_helpful: helpful });
    return response.data;
  },

  rate: async (id: number, rating: number): Promise<any> => {
    const response = await apiClient.post(`/explanations/${id}/rate/`, { rating });
    return response.data;
  },
};

// ============ REVISION SYSTEM ============
export const revisionAPI = {
  revisionPlan: async (): Promise<RevisionPlan> => {
    const response = await apiClient.get('/revisions/revision_plan/');
    return response.data;
  },

  startSession: async (revisionId: number): Promise<any> => {
    const response = await apiClient.post(`/revisions/${revisionId}/start_session/`);
    return response.data;
  },

  completeSession: async (revisionId: number, masteryScore: number): Promise<any> => {
    const response = await apiClient.post(`/revisions/${revisionId}/complete_session/`, {
      mastery_score: masteryScore,
    });
    return response.data;
  },

  progress: async (): Promise<any> => {
    const response = await apiClient.get('/revisions/progress/');
    return response.data;
  },

  effectiveness: async (): Promise<any> => {
    const response = await apiClient.get('/revisions/effectiveness/');
    return response.data;
  },

  timing: async (revisionId?: number): Promise<any> => {
    if (revisionId) {
      const response = await apiClient.get(`/revisions/${revisionId}/timing/`);
      return response.data;
    } else {
      const response = await apiClient.get('/revisions/timing/');
      return response.data;
    }
  },
};

// ============ PROGRESS ============
export const progressAPI = {
  get: async (): Promise<ProgressData> => {
    const response = await apiClient.get('/progress/');
    return response.data;
  },

  bySubject: async (): Promise<any> => {
    const response = await apiClient.get('/progress/by-subject/');
    return response.data;
  },

  byLevel: async (): Promise<any> => {
    const response = await apiClient.get('/progress/by-level/');
    return response.data;
  },
};

// ============ RECOMMENDATIONS ============
export const recommendationsAPI = {
  predict: async (studentId: number, exerciseId: number): Promise<any> => {
    const response = await apiClient.get('/recommendations/predict/', {
      params: { student_id: studentId, exercise_id: exerciseId },
    });
    return response.data;
  },

  generate: async (): Promise<any> => {
    const response = await apiClient.get('/recommendations/generate/');
    return response.data;
  },
};
