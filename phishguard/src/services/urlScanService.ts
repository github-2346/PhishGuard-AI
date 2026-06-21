import api from './axiosInstance';
import type { URLScanResult } from '../types';

export async function scanUrl(url: string): Promise<URLScanResult> {
  const { data } = await api.post<URLScanResult>('/scanner/url', { url });
  return data;
}
