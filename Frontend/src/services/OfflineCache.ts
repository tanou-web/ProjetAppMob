import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api';

/**
 * Offline Cache Manager
 * Caches lessons and courses for offline access
 */

const CACHE_PREFIX = '@offline_cache_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedItem<T> {
    data: T;
    timestamp: number;
}

export const OfflineCache = {
    /**
     * Cache a lesson
     */
    async cacheLesson(lessonId: number, data: any): Promise<void> {
        const key = `${CACHE_PREFIX}lesson_${lessonId}`;
        const cached: CachedItem<any> = {
            data,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(key, JSON.stringify(cached));
    },

    /**
     * Get cached lesson
     */
    async getCachedLesson(lessonId: number): Promise<any | null> {
        const key = `${CACHE_PREFIX}lesson_${lessonId}`;
        try {
            const item = await AsyncStorage.getItem(key);
            if (!item) return null;

            const cached: CachedItem<any> = JSON.parse(item);

            // Check if expired
            if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
                await AsyncStorage.removeItem(key);
                return null;
            }

            return cached.data;
        } catch (error) {
            console.error('Error reading cached lesson:', error);
            return null;
        }
    },

    /**
     * Fetch lesson with offline fallback
     */
    async getLessonOffline(lessonId: number): Promise<any> {
        try {
            // Try to fetch from server
            const response = await apiClient.get(`courses/lessons/${lessonId}/`);
            // Cache for offline use
            await this.cacheLesson(lessonId, response.data);
            return response.data;
        } catch (error) {
            console.log('Network error, trying cache...');
            // Fallback to cache
            const cached = await this.getCachedLesson(lessonId);
            if (cached) {
                return cached;
            }
            throw new Error('Lesson not available offline');
        }
    },

    /**
     * Cache a course
     */
    async cacheCourse(courseId: number, data: any): Promise<void> {
        const key = `${CACHE_PREFIX}course_${courseId}`;
        const cached: CachedItem<any> = {
            data,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(key, JSON.stringify(cached));
    },

    /**
     * Get cached course
     */
    async getCachedCourse(courseId: number): Promise<any | null> {
        const key = `${CACHE_PREFIX}course_${courseId}`;
        try {
            const item = await AsyncStorage.getItem(key);
            if (!item) return null;

            const cached: CachedItem<any> = JSON.parse(item);

            if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
                await AsyncStorage.removeItem(key);
                return null;
            }

            return cached.data;
        } catch (error) {
            console.error('Error reading cached course:', error);
            return null;
        }
    },

    /**
     * Clear all cache
     */
    async clearAll(): Promise<void> {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
        await AsyncStorage.multiRemove(cacheKeys);
    },

    /**
     * Get cache size
     */
    async getCacheSize(): Promise<number> {
        const keys = await AsyncStorage.getAllKeys();
        return keys.filter(key => key.startsWith(CACHE_PREFIX)).length;
    },
};
