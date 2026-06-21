

import api from './axiosInstance';
import type { EmailScanPayload, EmailScanResult } from '../types';

// ── Analyze email content ─────────────────────────────────────
export async function analyzeEmail(payload: EmailScanPayload): Promise<EmailScanResult> {
  const { data } = await api.post<EmailScanResult>('/scanner/email', payload);
  return data;
}

// ── Get email analysis result by ID ──────────────────────────
export async function getEmailAnalysisResult(scanId: string): Promise<EmailScanResult> {
  const { data } = await api.get<EmailScanResult>(`/scanner/email/${scanId}`);
  return data;
}
