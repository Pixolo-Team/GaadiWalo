"use client";

// REACT //
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

// TYPES //
import type { UserData } from "@/types/auth";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";

/**
 * Defines auth session payload stored in app state.
 */
export type AppSessionData = {
  token: string;
};

/**
 * Defines internal auth state shape.
 */
type AuthStateData = {
  isAuthenticated: boolean | null; // null = not yet hydrated
  session: AppSessionData | null;
  user: UserData | null;
  isLoading: boolean;
};

/**
 * Defines auth context contract exposed to consumers.
 */
type AuthContextData = AuthStateData & {
  setAuthSessionService: (
    sessionData: AppSessionData | null,
    userData: UserData | null,
  ) => void;
  clearAuthSessionService: () => void;
};

const AuthContext = createContext<AuthContextData | null>(null);

/**
 * Defines AuthProvider props shape.
 */
type AuthProviderPropsData = {
  children: ReactNode;
};

/**
 * Parses stored JSON safely and returns typed value.
 */
const parseStoredAuthDataService = <T,>(
  storedValueData: string | null,
): T | null => {
  if (!storedValueData) return null;
  try {
    return JSON.parse(storedValueData) as T;
  } catch {
    return null;
  }
};

/**
 * Reads auth snapshot from localStorage and normalizes fallback state.
 */
const readStoredAuthSessionService = (): {
  isAuthenticated: boolean;
  session: AppSessionData | null;
  user: UserData | null;
} => {
  try {
    const storedAccessToken = window.localStorage.getItem(
      CONSTANTS.ACCESS_TOKEN,
    );
    const storedUserData = window.localStorage.getItem(CONSTANTS.AUTH_USER);
    const parsedUserData = parseStoredAuthDataService<UserData>(storedUserData);

    if (!storedAccessToken || !parsedUserData) {
      return { isAuthenticated: false, session: null, user: null };
    }

    return {
      isAuthenticated: true,
      session: { token: storedAccessToken },
      user: parsedUserData,
    };
  } catch {
    return { isAuthenticated: false, session: null, user: null };
  }
};

/** Stable server-safe initial state — identical on server and client first render */
const INITIAL_AUTH_STATE: AuthStateData = {
  isAuthenticated: null,
  session: null,
  user: null,
  isLoading: true,
};

/**
 * Provides and manages authenticated state for the full frontend app.
 */
export function AuthProvider({ children }: AuthProviderPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [authState, setAuthState] = useState<AuthStateData>(INITIAL_AUTH_STATE);

  // Helper Functions
  /**
   * Runs only on the client after hydration.
   * Server and client both start from INITIAL_AUTH_STATE,
   * so the first render always matches.
   */
  useEffect(() => {
    const storedAuthState = readStoredAuthSessionService();
    setAuthState({
      isAuthenticated: storedAuthState.isAuthenticated,
      session: storedAuthState.session,
      user: storedAuthState.user,
      isLoading: false,
    });
  }, []);

  /**
   * Persists and updates auth session state in one place.
   */
  const setAuthSessionService = useCallback(
    (sessionData: AppSessionData | null, userData: UserData | null): void => {
      if (!sessionData || !userData) {
        // Clear auth state and persisted auth payload.
        setAuthState({
          isAuthenticated: false,
          session: null,
          user: null,
          isLoading: false,
        });
        window.localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
        window.localStorage.removeItem(CONSTANTS.AUTH_USER);
        return;
      }

      // Persist authenticated session payload.
      window.localStorage.setItem(CONSTANTS.ACCESS_TOKEN, sessionData.token);
      window.localStorage.setItem(
        CONSTANTS.AUTH_USER,
        JSON.stringify(userData),
      );

      setAuthState({
        isAuthenticated: true,
        session: sessionData,
        user: userData,
        isLoading: false,
      });
    },
    [],
  );

  /**
   * Clears authenticated session from state and storage.
   */
  const clearAuthSessionService = useCallback((): void => {
    setAuthSessionService(null, null);
  }, [setAuthSessionService]);

  /**
   * Memoizes context value to prevent unnecessary re-renders.
   */
  const authContextValue = useMemo<AuthContextData>(
    () => ({
      ...authState,
      setAuthSessionService,
      clearAuthSessionService,
    }),
    [authState, setAuthSessionService, clearAuthSessionService],
  );

  // Use Effects

  return (
    // Provide centralized auth session state and actions.
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Returns auth context safely within AuthProvider scope.
 */
export function useAuthContext(): AuthContextData {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuthContext must be used within AuthProvider.");
  }
  return authContext;
}
