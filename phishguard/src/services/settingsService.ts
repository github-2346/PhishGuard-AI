// ============================================================
// services/settingsService.ts
// User settings & preferences API calls
// ============================================================

import api from './axiosInstance';
import type { AppSettings } from '../types';

export async function getSettings(): Promise<AppSettings> {
  const { data } = await api.get<AppSettings>('/settings');
  return data;
}

export async function updateSettings(payload: Partial<AppSettings>): Promise<AppSettings> {
  const { data } = await api.put<AppSettings>('/settings', payload);
  return data;
}
