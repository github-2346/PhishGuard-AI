

import api, { saveTokens, clearTokens } from './axiosInstance';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthTokens,
  User,
} from '../types';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<any>('/auth/login', {
    email: payload.email,
    password: payload.password,
  });
  
  // Backend returns flat structure: { token, name, email, role }
  // We need to map it to our frontend AuthResponse: { token, refreshToken, user: { ... } }
  const mappedData: AuthResponse = {
    token: data.token,
    refreshToken: '',
    user: {
      id: data.email, // backend doesn't send ID currently, fallback to email
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.name ? data.name.charAt(0).toUpperCase() : 'U'
    }
  };

  saveTokens(mappedData.token, mappedData.refreshToken, payload.rememberMe ?? false);
  return mappedData;
}

// ── Register ─────────────────────────────────────────────────
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  saveTokens(data.token, data.refreshToken, false);
  return data;
}

// ── Refresh Token (called automatically by interceptor) ──────
export async function refreshToken(token: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/refresh', { refreshToken: token });
  return data;
}

// ── Logout ───────────────────────────────────────────────────
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    clearTokens();
  }
}

// ── Forgot Password ───────────────────────────────────────────
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', payload);
  return data;
}

// ── Reset Password ────────────────────────────────────────────
export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', payload);
  return data;
}

// ── Get Current User ──────────────────────────────────────────
export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}

// ── Update Profile ────────────────────────────────────────────
export async function updateProfile(payload: Partial<User>): Promise<User> {
  const { data } = await api.put<User>('/auth/profile', payload);
  return data;
}

// ── Upload Avatar ─────────────────────────────────────────────
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await api.post<{ avatarUrl: string }>('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ── Change Password ───────────────────────────────────────────
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.post('/auth/change-password', { currentPassword, newPassword });
}
