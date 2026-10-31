import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { authApi, onSessionExpired, setAccessToken, storage, refreshSession } from '../../api';
import { UserWithDetails } from '../../types/domain';

interface AuthContextValue {
  user: UserWithDetails | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  lastDevOtp: string | null;
  sendOtp: (email: string) => Promise<{ message: string; email: string; devOtp?: string }>;
  verifyOtp: (email: string, otp: string, name?: string) => Promise<UserWithDetails>;
  refreshProfile: () => Promise<UserWithDetails | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastDevOtp, setLastDevOtp] = useState<string | null>(null);

  // Determine if onboarding is required
  const needsOnboarding = useMemo(() => {
    if (!user) return false;
    const hasPlayerProfile = Boolean(user.profiles?.player);
    const hasRegisteredSports = Boolean(user.sports && user.sports.length > 0);
    return !hasPlayerProfile || !hasRegisteredSports;
  }, [user]);

  const refreshProfile = useCallback(async (): Promise<UserWithDetails | null> => {
    try {
      const freshUser = await authApi.getMe();
      setUser(freshUser);
      await storage.setCachedUser(freshUser);
      return freshUser;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    setAccessToken(null);
    setUser(null);
    setLastDevOtp(null);
    await storage.clearRefreshToken();
    await storage.clearCachedUser();
  }, []);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const storedRefreshToken = await storage.getRefreshToken();
        if (!storedRefreshToken) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // Try getting new access token
        const newAccessToken = await refreshSession();
        if (newAccessToken) {
          const freshUser = await authApi.getMe();
          if (isMounted) {
            setUser(freshUser);
            await storage.setCachedUser(freshUser);
          }
        } else {
          await logout();
        }
      } catch {
        await logout();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    // Listen for session expiration events from API client
    const unsubscribe = onSessionExpired(() => {
      if (isMounted) {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [logout]);

  const sendOtp = useCallback(async (email: string) => {
    const data = await authApi.sendOtp(email);
    if (data.otp) {
      setLastDevOtp(data.otp);
    }
    return {
      message: data.message,
      email: data.email,
      devOtp: data.otp,
    };
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string, name?: string) => {
    const data = await authApi.verifyOtp(email, otp, name);
    setAccessToken(data.accessToken);
    if (data.refreshToken) {
      await storage.setRefreshToken(data.refreshToken);
    }
    // Fetch full me details
    const me = await authApi.getMe();
    setUser(me);
    await storage.setCachedUser(me);
    return me;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        needsOnboarding,
        lastDevOtp,
        sendOtp,
        verifyOtp,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
