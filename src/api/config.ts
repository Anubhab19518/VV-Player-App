import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PORT = 3000;
const API_PREFIX = '/api/v1';

/**
 * Dynamically resolves the reachable backend API base URL:
 * 1. Honors EXPO_PUBLIC_API_BASE_URL if explicitly set with a reachable IP/domain.
 * 2. If running on a physical device or emulator where localhost fails, dynamically extracts
 *    the host machine's LAN IP from Expo Metro's `hostUri` (e.g., 192.168.x.x:8081 -> 192.168.x.x:3000).
 * 3. On web, dynamically matches the current browser host (e.g., window.location.hostname).
 * 4. On Android emulator fallback, maps to 10.0.2.2:3000.
 * 5. Falls back to localhost:3000 for local desktop/simulator environments.
 */
export function resolveApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  // If envUrl is set and is NOT localhost on a native device, use it directly
  if (envUrl && envUrl.length > 0 && !envUrl.includes('<API_HOST>')) {
    const isLoopback = envUrl.includes('localhost') || envUrl.includes('127.0.0.1');
    if (!isLoopback || Platform.OS === 'web') {
      return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }
  }

  // Extract dynamically from Expo Metro development server hostUri
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const metroHost = hostUri.split(':')[0];
    if (metroHost && metroHost !== 'localhost' && metroHost !== '127.0.0.1') {
      return `http://${metroHost}:${DEFAULT_PORT}${API_PREFIX}`;
    }
  }

  // Web platform: match the hostname currently loaded in the browser
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const webHost = window.location.hostname;
    return `http://${webHost}:${DEFAULT_PORT}${API_PREFIX}`;
  }

  // Android emulator loopback alias to host machine
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEFAULT_PORT}${API_PREFIX}`;
  }

  // Default fallback for simulators and local machines
  return `http://localhost:${DEFAULT_PORT}${API_PREFIX}`;
}

export const getApiBaseUrl = (): string => {
  const base = resolveApiBaseUrl();
  return base.endsWith('/') ? base.slice(0, -1) : base;
};
