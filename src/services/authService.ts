import { apiRequest, setStoredToken } from './api';
import type { AuthSession, AuthUser } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthTokenResponse {
  success?: boolean;
  access_token: string;
  token_type?: string;
}

const readPersistedSession = (): AuthSession | null => {
  const raw = localStorage.getItem('horigine_admin_session');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const persistSession = (session: AuthSession | null) => {
  if (!session) {
    localStorage.removeItem('horigine_admin_session');
    setStoredToken(null);
    return;
  }

  localStorage.setItem('horigine_admin_session', JSON.stringify(session));
  setStoredToken(session.token);
};

export const getCurrentSession = (): AuthSession | null => {
  const session = readPersistedSession();
  if (!session || !session.token) {
    return null;
  }

  return session;
};

export const authService = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthTokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => ({
      token: response.access_token,
      user: {
        id: 'admin',
        email: payload.email,
        first_name: payload.email.split('@')[0] || 'Admin',
        last_name: '',
        role: 'admin',
        name: payload.email,
      } as AuthUser,
    })),

  getMe: () =>
    apiRequest<AuthUser>('/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((user) => ({
      id: user.id ?? 'admin',
      email: user.email ?? '',
      first_name: user.first_name ?? user.name?.split(' ')[0] ?? 'Admin',
      last_name: user.last_name ?? '',
      role: user.role ?? 'admin',
      name: user.name ?? user.email ?? 'Admin',
    } as AuthUser)),

  logout: () =>
    apiRequest<{ success?: boolean }>('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => ({ success: false })).finally(() => {
      persistSession(null);
    }),
};
