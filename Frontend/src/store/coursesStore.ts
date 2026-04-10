import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, Exercise, ExerciseAttempt, ErrorAnalysis, SmartExplanation, ContentRecommendation } from '../types';
import { coursesAPI, exercisesAPI, errorAnalysisAPI, explanationsAPI, lessonsAPI, authAPI, recommendationsAPI, aiAPI } from '../services/endpoints';
import { allLocalCourses as allMathCourses } from '../data/mathData';
import { allFrenchCourses } from '../data/frenchData';
import { allHistoryCourses } from '../data/historyData';
import { allGeographyCourses } from '../data/geographyData';
import { allSVTCourses } from '../data/svtData';
import { allEnglishCourses } from '../data/englishData';
import { allMath4eCourses } from '../data/math4eData';
import { allFrench4eCourses } from '../data/french4eData';
import { allEnglish4eCourses } from '../data/english4eData';
import { allHistory4eCourses } from '../data/history4eData';
import { allGeography4eCourses } from '../data/geography4eData';
import { allMath3eCourses } from '../data/math3eData';
import { allEnglish3eCourses } from '../data/english3eData';
import { allFrench3eCourses } from '../data/french3eData';
import { allGeography3eCourses } from '../data/geography3eData';
import { allHistory3eCourses } from '../data/history3eData';
import { allSVT3eCourses } from '../data/svt3eData';

const allLocalCourses = [...allMathCourses, ...allFrenchCourses, ...allHistoryCourses, ...allGeographyCourses, ...allSVTCourses, ...allEnglishCourses, ...allMath4eCourses, ...allFrench4eCourses, ...allEnglish4eCourses, ...allHistory4eCourses, ...allGeography4eCourses, ...allMath3eCourses, ...allEnglish3eCourses, ...allFrench3eCourses, ...allGeography3eCourses, ...allHistory3eCourses, ...allSVT3eCourses];

interface CoursesStore {
  courses: Course[]; // For catalog
  myCourses: any[]; // For enrolled courses (enrollment objects)
  selectedCourse: Course | null;
  currentExercise: Exercise | null;
  currentAttempt: ExerciseAttempt | null;
  errorAnalysis: ErrorAnalysis | null;
  explanation: SmartExplanation | null;
  recommendations: ContentRecommendation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCourses: () => Promise<void>;
  fetchAllCourses: () => Promise<void>;
  enrollInCourse: (id: number) => Promise<void>;
  selectCourse: (id: number) => Promise<void>;
  fetchLesson: (id: number) => Promise<any>;
  selectExercise: (id: number) => Promise<void>;
  submitAnswer: (exerciseId: number, answer: string) => Promise<void>;
  getErrorAnalysis: () => Promise<void>;
  getExplanation: () => Promise<void>;
  fetchRecommendations: () => Promise<ContentRecommendation[]>;
  correctExerciseByVision: (exerciseId: number, imageB64: string) => Promise<any>;
  generateLessonAudio: (text: string) => Promise<string | null>;
  reset: () => void;
}

export const useCoursesStore = create<CoursesStore>()(
  persist(
    (set, get) => ({
      courses: [],
      myCourses: [],
      selectedCourse: null,
      currentExercise: null,
      currentAttempt: null,
      errorAnalysis: null,
      explanation: null,
      recommendations: [],
      isLoading: false,
      error: null,

      fetchCourses: async () => {
        try {
          set({ isLoading: true, error: null });
          console.log("Fetching courses...");

          let results: any[] = [];

          try {
            // 1. D'abord l'API
            const response = await coursesAPI.myEnrolled();
            results = response.results || (Array.isArray(response) ? response : []);
            console.log("API Courses fetched:", results.length);
          } catch (apiError) {
            console.warn("API Error fetching courses:", apiError);
            // On continue pour charger les données locales
          }

          // 2. Ensuite les données locales filtrées
          try {
            // Utilisation directe de l'API statique
            let userLevel: string | null = null;
            try {
              const user = await authAPI.me();
              if (user && user.level) {
                userLevel = user.level;
                console.log("User level for filtering:", userLevel);
              } else {
                console.log("User or level not found, showing all.");
              }
            } catch (authError) {
              console.warn("Could not fetch user profile for level filtering:", authError);
            }

            // Filtrer les cours locaux selon le niveau (Strictement)
            let relevantMathCourses = allLocalCourses.filter(c => {
              if (!userLevel) return false; // Ne rien montrer si pas de niveau (sécurité)
              const cLevel = String(c.level || "").toLowerCase().trim();
              const uLevel = String(userLevel).toLowerCase().trim();

              // Correspondance exacte ou inclusion pour "primary_cp2" vs "CP2"
              return cLevel === uLevel ||
                uLevel.includes(cLevel) ||
                cLevel.includes(uLevel) ||
                (uLevel === 'primary_cp1' && cLevel === 'cp1') ||
                (uLevel === 'primary_cp2' && cLevel === 'cp2') ||
                (uLevel === 'primary_ce1' && cLevel === 'ce1') ||
                (uLevel === 'primary_ce2' && cLevel === 'ce2') ||
                (uLevel === '3ème' && cLevel === '3ème');
            });

            // Si aucun cours au niveau, on ne montre PAS tout (trop risqué), on laisse vide ou on log
            if (relevantMathCourses.length === 0) {
              console.log("No specific local courses found for level: " + userLevel);
            }

            const localEnrollments = relevantMathCourses.map((c, index) => ({
              id: 9000 + index,
              course: c as Course
            }));

            // Fusion intelligente + Safety filter on API results
            const uLevel = userLevel ? String(userLevel).toLowerCase().trim() : null;

            // Filter existing API results by level as well (Safety)
            if (uLevel) {
              results = results.filter((e: any) => {
                if (!e.course) return true;
                const cLevel = String(e.course.level || "").toLowerCase().trim();
                return cLevel === uLevel || uLevel.includes(cLevel) || cLevel.includes(uLevel);
              });
            }

            localEnrollments.forEach(le => {
              if (le.course && le.course.title && !results.find((e: any) => e.course && e.course.title === le.course.title)) {
                results = [le, ...results];
              }
            });
          } catch (e) {
            console.error("Critical error in local course filtering:", e);
            // Fallback ultime: On montre tout
            const localEnrollments = allLocalCourses.map((c, index) => ({
              id: 9000 + index,
              course: c as Course
            }));
            localEnrollments.forEach(le => {
              if (!results.find((e: any) => e.course && e.course.title === le.course.title)) {
                results = [le, ...results];
              }
            });
          }

          set({ myCourses: results, isLoading: false });
        } catch (error: any) {
          console.error('Fatal error fetching enrolled courses:', error);
          // En cas d'erreur fatale, on montre au moins les cours locaux sans filtre
          const localEnrollments = allLocalCourses.map((c, index) => ({
            id: 9000 + index,
            course: c as Course
          }));
          set({ myCourses: localEnrollments, isLoading: false });
        }
      },

      fetchAllCourses: async () => {
        try {
          console.log('[CoursesStore] fetchAllCourses started');
          set({ isLoading: true, error: null });
          const response = await coursesAPI.list();
          let results = response.results || (Array.isArray(response) ? response : []);
          console.log('[CoursesStore] fetchAllCourses got results:', results.length);

          // 2. Fetch user level for filtering
          let userLevel: string | null = null;
          try {
            const user = await authAPI.me();
            if (user && user.level) userLevel = user.level;
          } catch (authError) {
            console.warn("Could not fetch user profile for level filtering:", authError);
          }

          // 3. Filter local math courses
          const relevantMathCourses = allLocalCourses.filter(c => {
            if (!userLevel) return false;
            const cLevel = String(c.level || "").toLowerCase().trim();
            const uLevel = String(userLevel).toLowerCase().trim();
            return cLevel === uLevel ||
              uLevel.includes(cLevel) ||
              cLevel.includes(uLevel) ||
              (uLevel === 'primary_cp1' && cLevel === 'cp1') ||
              (uLevel === '3ème' && cLevel === '3ème');
          });

          relevantMathCourses.forEach(c => {
            if (!results.find((rc: any) => rc.title === c.title)) {
              results = [c as Course, ...results];
            }
          });

          // 4. Safety Filter: Ensure even API results match the level if possible
          if (userLevel) {
            const uLevel = String(userLevel).toLowerCase().trim();
            results = results.filter((c: any) => {
              const courseData = c.course || c;
              const cLevel = String(courseData.level || "").toLowerCase().trim();
              return !cLevel || cLevel === uLevel || uLevel.includes(cLevel) || cLevel.includes(uLevel);
            });
          }

          set({ courses: results, isLoading: false });
        } catch (error: any) {
          // OFFLINE FALLBACK: Keep existing courses if available, otherwise just local math
          const currentCourses = get().courses;
          if (currentCourses.length > 0) {
            set({ isLoading: false }); // Keep current data
          } else {
            set({ courses: allLocalCourses as Course[], isLoading: false });
          }
          console.error('Error fetching courses (Offline mode):', error);
        }
      },

      enrollInCourse: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          await coursesAPI.enroll(id);
          const response = await coursesAPI.myEnrolled();
          set({ myCourses: response.results || response, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      selectCourse: async (id: number) => {
        try {
          set({ isLoading: true, error: null });

          const localCourse = allLocalCourses.find(c => c.id === id);
          if (localCourse) {
            set({ selectedCourse: localCourse as Course, isLoading: false });
            return;
          }

          // Check if we already have it in list (offline optimization)
          const existing = get().courses.find(c => c.id === id);
          if (existing) {
            set({ selectedCourse: existing, isLoading: false });
            // Try to refresh in background
            coursesAPI.get(id).then(c => set({ selectedCourse: c })).catch(() => { });
            return;
          }

          const course = await coursesAPI.get(id);
          set({ selectedCourse: course, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchLesson: async (id: number) => {
        try {
          const lesson = await lessonsAPI.get(id);
          return lesson;
        } catch (error: any) {
          console.error('Error fetching lesson:', error);
          throw error;
        }
      },

      selectExercise: async (id: number) => {
        try {
          set({ isLoading: true, error: null });

          // 1. Chercher d'abord dans les cours locaux (mathData)
          let localExec: Exercise | null = null;
          // Parcours inefficace mais sûr pour trouver l'exo
          for (const c of allLocalCourses) {
            if (c.lessons) {
              for (const l of c.lessons) {
                if (l.exercises) {
                  const found = l.exercises.find((e: any) => e.id === id);
                  if (found) {
                    localExec = { ...found, lesson: l.id } as Exercise; // On injecte l'ID de la leçon
                    break;
                  }
                }
              }
            }
            if (localExec) break;
          }

          if (localExec) {
            set({ currentExercise: localExec, isLoading: false });
            return;
          }

          // 2. Sinon API
          const exercise = await exercisesAPI.get(id);
          set({ currentExercise: exercise, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      submitAnswer: async (exerciseId: number, answer: string) => {
        try {
          set({ isLoading: true, error: null });

          // Vérifier si c'est un exo local
          const currentEx = get().currentExercise;
          const isLocal = currentEx && currentEx.id === exerciseId && (currentEx.id >= 10000);

          let attempt;
          if (isLocal) {
            // Utiliser l'API interactive pour que le backend "apprenne" l'exercice
            // On a besoin du lesson_id, qu'on a injecté dans selectExercise
            const lessonId = currentEx.lesson || (currentEx as any).lesson_id;

            if (!lessonId) throw new Error("Lesson ID manquant pour l'exercice local");

            // Cast pour accéder aux propriétés spécifiques de mathData non dans l'interface Exercise standard
            const localExAny = currentEx as any;

            const result = await exercisesAPI.submitInteractive(lessonId, 'exercise', [{
              question: localExAny.question || currentEx.title,
              student_answer: answer,
              correct_answer: localExAny.correct_answer || ''
            }]);

            // Simuler un objet Attempt complet pour le frontend
            // Le backend a créé l'attempt via submitInteractive mais ne le renvoie pas complet
            // On le "bricole" pour l'affichage immédiat
            const isCorrect = (answer.trim() === (localExAny.correct_answer || ''));
            attempt = {
              id: Date.now(),
              exercise: exerciseId,
              student: 0, // Placeholder
              student_answer: answer,
              is_correct: isCorrect,
              score: isCorrect ? currentEx.points : 0,
              status: 'submitted',
              submitted_at: new Date().toISOString(),
              feedback: isCorrect ? "Bravo ! C'est correct." : (localExAny.explanation || "Incorrect."),
              time_spent: 0,
              created_at: new Date().toISOString(),
            } as ExerciseAttempt;

            // IMPORTANT: Rafraîchir le plan de révision car le backend a analysé l'erreur
            setTimeout(() => {
              coursesAPI.myEnrolled(); // Rafraîchir les stats
              // Le composant RevisionScreen se rechargera au focus, ou on pourrait forcer un fetch ici
            }, 1000);

          } else {
            attempt = await exercisesAPI.submit(exerciseId, answer);
          }

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

      fetchRecommendations: async () => {
        try {
          // Utiliser l'API de recommandations si disponible, sinon fallback
          try {
            const response = await recommendationsAPI.pending();
            const results = response.results || (Array.isArray(response) ? response : []);
            set({ recommendations: results });
            return results;
          } catch (e) {
            console.warn("Recommendations API not available, using empty list");
            return [];
          }
        } catch (error: any) {
          set({ error: error.message });
          return [];
        }
      },

      correctExerciseByVision: async (exerciseId: number, imageB64: string) => {
        try {
          set({ isLoading: true, error: null });
          const result = await aiAPI.visionCorrection(imageB64, exerciseId);
          set({ isLoading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      generateLessonAudio: async (text: string) => {
        try {
          // Utiliser l'IA locale (expo-speech) comme fallback ou Google TTS si dispo
          // Pour l'instant, on utilise l'API Google via le backend
          const result = await aiAPI.lessonAudio(text);
          return result.audio_url;
        } catch (error: any) {
          console.warn("Google TTS failed, fallback to local speech", error);
          return null;
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
    }),
    {
      name: 'courses-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ courses: state.courses, myCourses: state.myCourses }), // Only persist catalog and enrollment
    }
  )
);
