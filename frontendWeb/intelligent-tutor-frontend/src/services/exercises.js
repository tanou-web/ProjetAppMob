import api from './api';

const exercisesService = {
  // Récupérer les exercices d'une leçon
  getExercises: async (lessonId) => {
    try {
      const response = await api.get(/exercises/exercises/?lesson_id=${lessonId});
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la récupération des exercices',
      };
    }
  },

  // Soumettre une réponse
  submitAnswer: async (exerciseId, studentAnswer) => {
    try {
      const response = await api.post('/exercises/attempts/submit/', {
        exercise: exerciseId,
        student_answer: studentAnswer,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la soumission',
      };
    }
  },

  // Obtenir un indice
  getHint: async (attemptId) => {
    try {
      const response = await api.post(/exercises/attempts/${attemptId}/get_hint/);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la récupération de l\'indice',
      };
    }
  },

  // Récupérer les quiz d'une leçon
  getQuizzes: async (lessonId) => {
    try {
      const response = await api.get(/exercises/quizzes/?lesson_id=${lessonId});
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la récupération des quiz',
      };
    }
  },

  // Démarrer un quiz
  startQuiz: async (quizId) => {
    try {
      const response = await api.post('/exercises/quiz-attempts/', {
        quiz: quizId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors du démarrage du quiz',
      };
    }
  },

  // Soumettre un quiz
  submitQuiz: async (attemptId, answers) => {
    try {
      const response = await api.post(/exercises/quiz-attempts/${attemptId}/submit/, {
        answers: answers,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la soumission du quiz',
      };
    }
  },
};

export default exercisesService;