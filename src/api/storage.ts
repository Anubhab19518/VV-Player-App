import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const REFRESH_TOKEN_KEY = 'vv_player_refresh_token';
const USER_KEY = 'vv_player_cached_user';

export const storage = {
  async getRefreshToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return null;
      }
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
        }
        return;
      }
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch {
      // ignore
    }
  },

  async clearRefreshToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
        return;
      }
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  async getCachedUser<T>(): Promise<T | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const raw = window.localStorage.getItem(USER_KEY);
          return raw ? JSON.parse(raw) : null;
        }
        return null;
      }
      const raw = await SecureStore.getItemAsync(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async setCachedUser<T>(user: T): Promise<void> {
    try {
      const serialized = JSON.stringify(user);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(USER_KEY, serialized);
        }
        return;
      }
      await SecureStore.setItemAsync(USER_KEY, serialized);
    } catch {
      // ignore
    }
  },

  async clearCachedUser(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(USER_KEY);
        }
        return;
      }
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
      // ignore
    }
  },
};
