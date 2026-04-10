import api from './api';

// Gestionnaire des appels API pour les cours et leçons
const gestionCours = {
  // Liste globale de la bibliothèque
  getToutLesCours: async (allLevels = false) => {
    try {
      const lien = allLevels ? '/courses/courses/?all_levels=true' : '/courses/courses/';
      const res = await api.get(lien);
      return { success: true, data: res.data };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data || 'Erreur chargement cours',
      };
    }
  },

  // Récupère les cours où l'élève est déjà inscrit
  getCoursInscrits: async () => {
    try {
      const response = await api.get('/courses/courses/my_courses/');
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || 'Erreur liste inscrits',
      };
    }
  },

  // Action d'inscription
  inscriptionCours: async (cId) => {
    try {
      const response = await api.post(`/courses/courses/${cId}/enroll/`);
      return { success: true, data: response.data };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data || 'Bug inscription',
      };
    }
  },

  // Pourcentage de réussite d'un cours
  getProgression: async (idCours) => {
    try {
      const data = await api.get(`/courses/courses/${idCours}/progress/`);
      return { success: true, data: data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data,
      };
    }
  },

  // Liste des chapitres
  getListeLecons: async (idC) => {
    try {
      const result = await api.get(`/courses/lessons/?course_id=${idC}`);
      return { success: true, data: result.data };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data,
      };
    }
  },

  // Marqueur de début
  startLaLecon: async (lId) => {
    try {
      const response = await api.post(`/courses/lessons/${lId}/mark_as_started/`);
      return { success: true, data: response.data };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data,
      };
    }
  },

  // Toutes les infos d'une leçon unique
  getDetailsLecon: async (lId) => {
    try {
      const response = await api.get(`/courses/lessons/${lId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data,
      };
    }
  },
};

export default gestionCours;