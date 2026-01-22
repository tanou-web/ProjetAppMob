import { create } from 'zustand';
import { User, AuthState } from '../types';
import { setAuthTokens, clearAuth } from '../services/api';
import { authAPI } from '../services/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isSignout: false,
  isSignup: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await authAPI.login(email, password);

      await setAuthTokens(response.access, response.refresh);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.access,
        isLoading: false,
        isSignout: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      set({ isLoading: true });
      const user = await authAPI.signup(email, password, firstName, lastName);
      set({
        isLoading: false,
        isSignup: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await clearAuth();
      await AsyncStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isSignout: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  restoreToken: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          token: 'restored',
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Restore token error:', error);
      set({ isLoading: false });
    }
  },

  updateUser: (user: User) => {
    set({ user });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
