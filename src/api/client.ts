import { storage } from './storage';
import { ApiResponse, RefreshTokenResponseData } from '../types/api';

import { getApiBaseUrl } from './config';

// In-memory access token
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

// Listeners for session expiration
type SessionExpiredCallback = () => void;
const sessionExpiredCallbacks: Set<SessionExpiredCallback> = new Set();

export const onSessionExpired = (cb: SessionExpiredCallback) => {
  sessionExpiredCallbacks.add(cb);
  return () => {
    sessionExpiredCallbacks.delete(cb);
  };
};

const notifySessionExpired = () => {
  inMemoryAccessToken = null;
  storage.clearRefreshToken();
  storage.clearCachedUser();
  sessionExpiredCallbacks.forEach((cb) => {
    try {
      cb();
    } catch {
      // ignore
    }
  });
};

// Refresh token promise deduplication
let refreshPromise: Promise<string | null> | null = null;

export const refreshSession = async (): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = await storage.getRefreshToken();
      if (!storedRefreshToken) {
        notifySessionExpired();
        return null;
      }

      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        notifySessionExpired();
        return null;
      }

      const json: ApiResponse<RefreshTokenResponseData> = await response.json();
      if (json.status === 'success' && json.data) {
        const { accessToken, refreshToken: newRefreshToken } = json.data;
        setAccessToken(accessToken);
        if (newRefreshToken) {
          await storage.setRefreshToken(newRefreshToken);
        }
        return accessToken;
      }

      notifySessionExpired();
      return null;
    } catch {
      notifySessionExpired();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  errors?: any;

  constructor(message: string, statusCode: number, code?: string, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  isRetry?: boolean;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!options.skipAuth && inMemoryAccessToken) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && !options.skipAuth && !options.isRetry) {
    // Attempt single retry after refreshing token
    const newAccessToken = await refreshSession();
    if (newAccessToken) {
      headers.set('Authorization', `Bearer ${newAccessToken}`);
      return request<T>(endpoint, {
        ...options,
        headers,
        isRetry: true,
      });
    } else {
      throw new ApiError('Session expired. Please log in again.', 401, 'UNAUTHORIZED');
    }
  }

  let responseData: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const message =
      (responseData && typeof responseData === 'object' && (responseData.message || responseData.error)) ||
      `Request failed with status ${response.status}`;
    const code = responseData && typeof responseData === 'object' ? responseData.code : undefined;
    throw new ApiError(message, response.status, code, responseData);
  }

  return responseData as T;
}
