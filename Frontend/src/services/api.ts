import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8000/api';

let authStore = {
  token: null as string | null,
  refreshToken: null as string | null,
};

// Créer l'instance API
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const token = authStore.token || (await SecureStore.getItemAsync('authToken'));
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
        const refreshToken = authStore.refreshToken || (await SecureStore.getItemAsync('refreshToken'));
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          await SecureStore.setItemAsync('authToken', access);
          authStore.token = access;

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthTokens = async (accessToken: string, refreshToken?: string) => {
  await SecureStore.setItemAsync('authToken', accessToken);
  authStore.token = accessToken;

  if (refreshToken) {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    authStore.refreshToken = refreshToken;
  }
};

export const clearAuth = async () => {
  await SecureStore.deleteItemAsync('authToken');
  await SecureStore.deleteItemAsync('refreshToken');
  authStore.token = null;
  authStore.refreshToken = null;
};

export const getStoredToken = async () => {
  return await SecureStore.getItemAsync('authToken');
};

export default apiClient;
