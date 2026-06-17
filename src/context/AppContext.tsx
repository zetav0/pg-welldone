import { createContext, useContext, useState, type ReactNode } from "react";
import {
  saveInLocalStorage,
  clearLocalStorage,
  LocalStorageKeys,
} from "@/utilities/local-storage-manager";

/* ── Auth types ─────────────────────────────────────── */

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id: number | null;
  permissions: string[];
}

/* ── Helpers: read initial state from localStorage ── */

function readToken(): string | null {
  return localStorage.getItem(LocalStorageKeys.TOKEN);
}

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LocalStorageKeys.USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/* ── Context shape ──────────────────────────────────── */

interface AppContextValue {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  // Initialize from localStorage so a page refresh doesn't lose the session
  const [user, setUser] = useState<AuthUser | null>(readUser);
  const [token, setToken] = useState<string | null>(readToken);

  function login(newUser: AuthUser, newToken: string) {
    saveInLocalStorage(LocalStorageKeys.TOKEN, newToken);
    saveInLocalStorage(LocalStorageKeys.USER, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    clearLocalStorage();
    setToken(null);
    setUser(null);
  }

  function updateUser(updates: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveInLocalStorage(LocalStorageKeys.USER, JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <AppContext.Provider
      value={{
        count,
        increment: () => setCount((c) => c + 1),
        decrement: () => setCount((c) => c - 1),
        reset: () => setCount(0),
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
