import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_BASE_URL = Constants.expoConfig?.extra?.API_URL || 'http://127.0.0.1:8000/api/';

// Helper pour le stockage compatible Web/Mobile
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

let authStore = {
  token: null as string | null,
  refreshToken: null as string | null,
};

// Créer l'instance API
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const token = authStore.token || (await storage.getItem('authToken'));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      authStore.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor pour gérer les erreurs 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStore.refreshToken || (await storage.getItem('refreshToken'));
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          await storage.setItem('authToken', access);
          authStore.token = access;

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } else {
          // No refresh token, logout
          const { useAuthStore } = await import('../store/authStore');
          await useAuthStore.getState().logout();
        }
      } catch (refreshError) {
        const { useAuthStore } = await import('../store/authStore');
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthTokens = async (accessToken: string, refreshToken?: string) => {
  await storage.setItem('authToken', accessToken);
  authStore.token = accessToken;

  if (refreshToken) {
    await storage.setItem('refreshToken', refreshToken);
    authStore.refreshToken = refreshToken;
  }
};

export const clearAuth = async () => {
  await storage.deleteItem('authToken');
  await storage.deleteItem('refreshToken');
  authStore.token = null;
  authStore.refreshToken = null;
};

export const getStoredToken = async () => {
  return await storage.getItem('authToken');
};

export default apiClient;
