import api from './api';

const progressService = {
  // Récupérer les statistiques globales
  getStatistics: async () => {
    try {
      const response = await api.get('/progress/statistics/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la récupération des statistiques',
      };
    }
  },

  // Récupérer la progression par cours
  getLessonProgressByCourse: async (courseId) => {
    try {
      const response = await api.get(/progress/lesson-progress/by_course/?course_id=${courseId});
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la récupération de la progression',
      };
    }
  },

  // Récupérer les achievements
  getAchievements: async () => {
    try {
      const response = await api.get('/progress/my-achievements/summary/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la récupération des achievements',
      };
    }
  },

  // Récupérer les insights IA
  getInsights: async () => {
    try {
      const response = await api.get('/progress/performance-analysis/insights/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la récupération des insights',
      };
    }
  },
};

export default progressService;
