"use client";

// REACT //
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

// TYPES //
import type { AuthenticatedUserData } from "@/types/auth";

// CONSTANTS //
import { AUTH_STORAGE_KEYS } from "@/constants/constants";

/** App-level auth session stored by frontend */
export type AppSessionData = {
  token: string;
};

type AuthContextData = {
  session: AppSessionData | null;
  user: AuthenticatedUserData | null;
  isLoading: boolean;
  setAuthSessionService: (
    sessionData: AppSessionData | null,
    userData: AuthenticatedUserData | null,
  ) => void;
  clearAuthSessionService: () => void;
};

const AuthContext = createContext<AuthContextData | null>(null);

type AuthProviderPropsData = {
  children: ReactNode;
};

/**
 * Validates stored token before restoring session.
 */
const isValidStoredTokenService = (
  tokenData: string | null,
): tokenData is string => {
  if (!tokenData) {
    return false;
  }

  const normalizedToken = tokenData.trim();

  if (!normalizedToken) {
    return false;
  }

  if (normalizedToken === "undefined" || normalizedToken === "null") {
    return false;
  }

  return true;
};

/**
 * Restores and manages authenticated session state for the app.
 */
export function AuthProvider({ children }: AuthProviderPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [session, setSession] = useState<AppSessionData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedAccessTokenData = window.localStorage.getItem(
      AUTH_STORAGE_KEYS.accessToken,
    );

    if (!isValidStoredTokenService(storedAccessTokenData)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
      return null;
    }

    return { token: storedAccessTokenData };
  });
  const [user, setUser] = useState<AuthenticatedUserData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUserData = window.localStorage.getItem(AUTH_STORAGE_KEYS.user);

    if (!storedUserData) {
      return null;
    }

    try {
      return JSON.parse(storedUserData) as AuthenticatedUserData;
    } catch {
      return null;
    }
  });
  const [isLoading] = useState<boolean>(false);

  // Helper Functions

  /**
   * Persists and updates auth state in one place.
   */
  const setAuthSessionService = useCallback(
    (
      sessionData: AppSessionData | null,
      userData: AuthenticatedUserData | null,
    ): void => {
      setSession(sessionData);
      setUser(userData);

      if (!sessionData || !userData) {
        // If either value is missing, clear full auth footprint.
        window.localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
        window.localStorage.removeItem(AUTH_STORAGE_KEYS.user);
        window.localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
        window.localStorage.removeItem(AUTH_STORAGE_KEYS.expiresIn);
        return;
      }

      // Persist session token and user payload for future visits.
      window.localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, sessionData.token);
      window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(userData));
    },
    [],
  );

  /**
   * Clears all stored auth state.
   */
  const clearAuthSessionService = useCallback((): void => {
    setAuthSessionService(null, null);
  }, [setAuthSessionService]);

  const authContextValue = useMemo(() => {
    return {
      session,
      user,
      isLoading,
      setAuthSessionService,
      clearAuthSessionService,
    };
  }, [
    session,
    user,
    isLoading,
    setAuthSessionService,
    clearAuthSessionService,
  ]);

  // Use Effects

  return (
    // Provide centralized auth session state and actions.
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Returns the auth context safely.
 */
export function useAuthContext(): AuthContextData {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuthContext must be used within AuthProvider.");
  }

  return authContext;
}
