/**
 * AI Service - Communication with AI backend endpoints
 * Provides chatbot, error analysis, and parent report features
 */

import { endpoints } from './endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatMessage {
    role: 'student' | 'assistant';
    content: string;
    timestamp?: string;
}

export interface ErrorAnalysis {
    attempt_id: number;
    analysis: {
        error_type: string;
        explanation: string;
        recommendation: string;
        similar_example: string;
        confidence: number;
    };
    exercise: {
        question: string;
        student_answer: string;
        correct_answer: string;
    };
}

export interface ParentReport {
    report: string;
    statistics: {
        total_exercises: number;
        avg_score: number;
        strong_subjects: string[];
        weak_subjects: string[];
        subject_stats: { [key: string]: number };
    };
    period: string;
    generated_at: string;
}

export interface AIStatus {
    gemini_api: string;
    ml_models: {
        recommendation: string;
        correction: string;
    };
    status: string;
}

class AIService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = endpoints.base;
    }

    /**
     * Get authentication token from storage
     */
    private async getAuthToken(): Promise<string | null> {
        try {
            const token = await AsyncStorage.getItem('access_token');
            return token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    /**
     * Send a chat message to the AI
     */
    async sendChatMessage(
        message: string,
        subject?: string,
        lessonId?: number,
        conversationHistory?: ChatMessage[]
    ): Promise<ChatMessage> {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${this.baseUrl}/ai/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                message,
                subject,
                lesson_id: lessonId,
                conversation_history: conversationHistory,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de l\'envoi du message');
        }

        const data = await response.json();
        return {
            role: 'assistant',
            content: data.message,
            timestamp: data.timestamp,
        };
    }

    /**
     * Analyze an error from an exercise attempt
     */
    async analyzeError(attemptId: number): Promise<ErrorAnalysis> {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${this.baseUrl}/ai/analyze_error/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                attempt_id: attemptId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de l\'analyse');
        }

        return await response.json();
    }

    /**
     * Get parent report
     */
    async getParentReport(period: 'week' | 'month' | 'all' = 'month'): Promise<ParentReport> {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${this.baseUrl}/ai/parent_report/?period=${period}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la génération du rapport');
        }

        return await response.json();
    }

    /**
     * Get exercise suggestions based on weak areas
     */
    async getSuggestedExercises(subject?: string): Promise<any> {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const url = subject
            ? `${this.baseUrl}/ai/suggest_exercises/?subject=${subject}`
            : `${this.baseUrl}/ai/suggest_exercises/`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la suggestion');
        }

        return await response.json();
    }

    /**
     * Check AI system status
     */
    async getStatus(): Promise<AIStatus> {
        const response = await fetch(`${this.baseUrl}/ai/status/`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Impossible de vérifier le statut de l\'IA');
        }

        return await response.json();
    }
}

export const aiService = new AIService();
