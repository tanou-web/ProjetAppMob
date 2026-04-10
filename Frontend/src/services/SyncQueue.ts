import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Offline Sync Queue
 * Stores exercise attempts when offline and syncs when back online
 */

interface QueuedAttempt {
    id: string;
    exerciseId: number;
    answer: string;
    timestamp: number;
}

const QUEUE_KEY = '@sync_queue';

export const SyncQueue = {
    /**
     * Add an attempt to the sync queue
     */
    async add(exerciseId: number, answer: string): Promise<void> {
        const queue = await this.getQueue();
        const attempt: QueuedAttempt = {
            id: `${Date.now()}_${exerciseId}`,
            exerciseId,
            answer,
            timestamp: Date.now(),
        };
        queue.push(attempt);
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    },

    /**
     * Get all queued attempts
     */
    async getQueue(): Promise<QueuedAttempt[]> {
        try {
            const data = await AsyncStorage.getItem(QUEUE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading sync queue:', error);
            return [];
        }
    },

    /**
     * Remove an attempt from the queue
     */
    async remove(attemptId: string): Promise<void> {
        const queue = await this.getQueue();
        const filtered = queue.filter(item => item.id !== attemptId);
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    },

    /**
     * Clear the entire queue
     */
    async clear(): Promise<void> {
        await AsyncStorage.removeItem(QUEUE_KEY);
    },

    /**
     * Get queue size
     */
    async size(): Promise<number> {
        const queue = await this.getQueue();
        return queue.length;
    },

    /**
     * Sync all queued attempts to server
     */
    async syncAll(submitFn: (exerciseId: number, answer: string) => Promise<any>): Promise<number> {
        const queue = await this.getQueue();
        let synced = 0;

        for (const attempt of queue) {
            try {
                await submitFn(attempt.exerciseId, attempt.answer);
                await this.remove(attempt.id);
                synced++;
            } catch (error) {
                console.error(`Failed to sync attempt ${attempt.id}:`, error);
                // Keep in queue for next sync
            }
        }

        return synced;
    },
};
