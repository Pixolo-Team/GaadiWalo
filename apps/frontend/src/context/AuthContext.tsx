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
import type { UserData } from "@/types/auth";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";

/** App-level auth session stored by frontend */
export type AppSessionData = {
  token: string;
};

type AuthContextData = {
  session: AppSessionData | null;
  user: UserData | null;
  isLoading: boolean;
  setAuthSessionService: (
    sessionData: AppSessionData | null,
    userData: UserData | null,
  ) => void;
  clearAuthSessionService: () => void;
};

const AuthContext = createContext<AuthContextData | null>(null);

type AuthProviderPropsData = {
  children: ReactNode;
};

/**
 * Restores and manages authenticated session state for the app.
 */
export function AuthProvider({ children }: AuthProviderPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [session, setSession] = useState<AppSessionData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper Functions

  /**
   * Persists and updates auth state in one place.
   */
  const parseStoredAuthDataService = <T,>(
    storedValueData: string | null,
  ): T | null => {
    if (!storedValueData) {
      return null;
    }

    try {
      return JSON.parse(storedValueData) as T;
    } catch {
      return null;
    }
  };

  const setAuthSessionService = useCallback(
    (sessionData: AppSessionData | null, userData: UserData | null): void => {
      setSession(sessionData);
      setUser(userData);

      // If either session or user data is missing, clear all auth state.
      if (!sessionData || !userData) {
        window.localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
        window.localStorage.removeItem(CONSTANTS.AUTH_USER);
        return;
      }

      // Store access token in Local Storage
      window.localStorage.setItem(CONSTANTS.ACCESS_TOKEN, sessionData.token);

      // Store user data in Local Storage
      window.localStorage.setItem(
        CONSTANTS.AUTH_USER,
        JSON.stringify(userData),
      );
    },
    [],
  );

  /**
   * Clears all stored auth state.
   */
  const clearAuthSessionService = useCallback((): void => {
    setAuthSessionService(null, null);
  }, [setAuthSessionService]);

  /** Restores auth state from local storage on first load */
  const restoreAuthSessionService = useCallback((): void => {
    const storedAccessToken = window.localStorage.getItem(
      CONSTANTS.ACCESS_TOKEN,
    );
    const storedUserData = window.localStorage.getItem(CONSTANTS.AUTH_USER);

    if (!storedAccessToken || !storedUserData) {
      clearAuthSessionService();
      setIsLoading(false);
      return;
    }

    setSession({ token: storedAccessToken });
    setUser(parseStoredAuthDataService<UserData>(storedUserData));
    setIsLoading(false);
  }, [clearAuthSessionService]);

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
