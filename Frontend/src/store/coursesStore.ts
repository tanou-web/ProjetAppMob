import { create } from 'zustand';
import { Course, Exercise, ExerciseAttempt, ErrorAnalysis, SmartExplanation } from '../types';
import { coursesAPI, exercisesAPI, errorAnalysisAPI, explanationsAPI } from '../services/endpoints';

interface CoursesStore {
  courses: Course[];
  selectedCourse: Course | null;
  currentExercise: Exercise | null;
  currentAttempt: ExerciseAttempt | null;
  errorAnalysis: ErrorAnalysis | null;
  explanation: SmartExplanation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCourses: () => Promise<void>;
  fetchAllCourses: () => Promise<void>;
  enrollInCourse: (id: number) => Promise<void>;
  selectCourse: (id: number) => Promise<void>;
  selectExercise: (id: number) => Promise<void>;
  submitAnswer: (exerciseId: number, answer: string) => Promise<void>;
  getErrorAnalysis: () => Promise<void>;
  getExplanation: () => Promise<void>;
  reset: () => void;
}

export const useCoursesStore = create<CoursesStore>((set, get) => ({
  courses: [],
  selectedCourse: null,
  currentExercise: null,
  currentAttempt: null,
  errorAnalysis: null,
  explanation: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await coursesAPI.myEnrolled();
      const results = response.results || (Array.isArray(response) ? response : []);
      set({ courses: results, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, courses: [] });
    }
  },

  fetchAllCourses: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await coursesAPI.list();
      const results = response.results || (Array.isArray(response) ? response : []);
      set({ courses: results, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, courses: [] });
    }
  },

  enrollInCourse: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await coursesAPI.enroll(id);
      // Re-fetch courses to show the new enrollment
      const response = await coursesAPI.myEnrolled();
      set({ courses: response.results || response, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectCourse: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const course = await coursesAPI.get(id);
      set({ selectedCourse: course, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectExercise: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const exercise = await exercisesAPI.get(id);
      set({ currentExercise: exercise, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitAnswer: async (exerciseId: number, answer: string) => {
    try {
      set({ isLoading: true, error: null });
      const attempt = await exercisesAPI.submit(exerciseId, answer);
      set({ currentAttempt: attempt, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getErrorAnalysis: async () => {
    try {
      set({ isLoading: true });
      const analysis = await errorAnalysisAPI.report();
      set({ errorAnalysis: analysis, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getExplanation: async () => {
    try {
      const explanations = await explanationsAPI.list();
      if (explanations.length > 0) {
        set({ explanation: explanations[0] });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  reset: () => {
    set({
      selectedCourse: null,
      currentExercise: null,
      currentAttempt: null,
      errorAnalysis: null,
      explanation: null,
      error: null,
    });
  },
}));
