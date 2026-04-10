import api from './api';

// Service pour gérer les appels aux fonctionnalités d'IA (Chat, OCR, Audio)
export const aiManager = {
    // Envoi d'un message au tuteur avec historique et contexte de la leçon
    appelChat: async (msg, contexte = null, matiere = null, messageHistory = []) => {
        const payload = {
            message: msg,
            lesson_context: contexte,
            subject: matiere,
            history: messageHistory
        };
        const res = await api.post('/ai/chat/', payload);
        return res.data;
    },

    // Analyse d'image pour l'OCR (lecture manuscrite)
    scanManuscrit: async (base64Img, description = "") => {
        const result = await api.post('/ai/vision_correction/', {
            image: base64Img,
            context: description
        });
        return result.data;
    },

    // Génération de l'audio pour une leçon (TTS)
    getAudioLecon: async (contenuTexte) => {
        // On limite à 5k caractères pour éviter de saturer l'API
        const data = await api.post('/ai/lesson_audio/', {
            text: contenuTexte.substring(0, 5000)
        });
        return data.data;
    },

    // Récupération des suggestions de révision adaptatives
    getSuggests: async (subjectName = null) => {
        const response = await api.post('/ai/suggest_sessions/', {
            subject: subjectName
        });
        return response.data;
    }
};
