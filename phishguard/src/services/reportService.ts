// ============================================================
// services/reportService.ts
// Reports API calls
// ============================================================

import api from './axiosInstance';
import type { Report, PaginatedResponse } from '../types';

// ── Get all reports (paginated + filtered) ────────────────────
export async function getReports(
  page = 1,
  pageSize = 10,
  filters?: { type?: string; threat?: string; search?: string }
): Promise<PaginatedResponse<Report>> {
  const { data } = await api.get<PaginatedResponse<Report>>('/reports', {
    params: { page, pageSize, ...filters },
  });
  return data;
}

// ── Get single report by ID ───────────────────────────────────
export async function getReportById(reportId: string): Promise<Report> {
  const { data } = await api.get<Report>(`/reports/${reportId}`);
  return data;
}

// ── Download report as PDF ────────────────────────────────────
export async function downloadReport(reportId: string): Promise<Blob> {
  const { data } = await api.get(`/reports/${reportId}/download`, { responseType: 'blob' });
  return data;
}

// ── Delete a report ───────────────────────────────────────────
export async function deleteReport(reportId: string): Promise<void> {
  await api.delete(`/reports/${reportId}`);
}
