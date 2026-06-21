import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, AuthTokens, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

interface Props { children: ReactNode }

export function AuthProvider({ children }: Props) {
  // Try to load persisted user from localStorage
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('pg_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [tokens, setTokensState] = useState<AuthTokens | null>(() => {
    try {
      const token = localStorage.getItem('pg_token');
      return token ? { token, refreshToken: '' } : null;
    } catch { return null; }
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem('pg_user', JSON.stringify(u));
    else { localStorage.removeItem('pg_user'); localStorage.removeItem('pg_token'); }
  };

  const setTokens = (t: AuthTokens | null) => {
    setTokensState(t);
    if (t) localStorage.setItem('pg_token', t.token);
    else localStorage.removeItem('pg_token');
  };

  // Context only provides state and setters. API calls are in authService.tsx
  return (
    <AuthContext.Provider value={{ user, setUser, tokens, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
}
