import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, AUTH_EXPIRED_EVENT, TOKEN_KEY } from '../api/client';

type AuthUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

type AuthValue = {
  user: AuthUser | null;
  checking: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  // Restore the session after a page refresh
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api<AuthUser>('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setChecking(false));
  }, []);

  // The API rejected our token (expired): drop the session, ProtectedRoute sends us to /login.
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  async function login(username: string, password: string) {
    const res = await api<AuthUser & { accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setUser(res);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
