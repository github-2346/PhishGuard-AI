// ============================================================
// TYPES — AI Phishing Detection Platform
// ============================================================

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ScanType  = 'URL' | 'Email';
export type UserRole  = 'ADMIN' | 'USER';
export type UserStatus = 'Active' | 'Inactive';
export type ThemeType = 'dark' | 'light' | 'system';

// AUTH
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company?: string;
  phone?: string;
  joinedAt?: string;
  totalScans?: number;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  code: string;
  password: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// URL SCAN
export interface URLScanPayload {
  url: string;
}

export interface URLScanResult {
  scanId: string;
  url: string;
  riskScore: number;
  threatLevel: RiskLevel;
  status: string;
  https: boolean;
  reputation: string;
  domainAge: string;
  ssl: string;
  malware: string;
  recommendation: string;
  scannedAt?: string;
}

// EMAIL SCAN
export interface EmailScanPayload {
  content: string;
}

export interface EmailThreatDistribution {
  credentialTheft: number;
  urgencyManipulation: number;
  maliciousLinks: number;
  socialEngineering: number;
}

export interface EmailScanResult {
  scanId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  credentialRequest: boolean;
  urgencyDetected: boolean;
  maliciousLinks: boolean;
  socialEngineering: boolean;
  suspiciousKeywords: string[];
  recommendation: string;
  distribution: EmailThreatDistribution;
  scannedAt?: string;
}

// HISTORY
export interface ScanHistoryItem {
  id: string;
  type: ScanType;
  content: string;
  risk: RiskLevel;
  status: string;
  date: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// REPORTS
export interface Report {
  id: string;
  type: string;
  threat: RiskLevel;
  result: string;
  created: string;
  summary: string;
}

// ADMIN
export interface AdminUser extends User {
  scans: number;
  joined: string;
  status: UserStatus;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  password?: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalScans: number;
  accuracy: number;
  avgResponse: number;
  byCategory: Array<{
    label: string;
    pct: number;
    color: string;
  }>;
}

// NOTIFICATIONS
export type NotifType = 'danger' | 'info' | 'warn';

export interface Notification {
  id: number;
  msg: string;
  time: string;
  read: boolean;
  type: NotifType;
}

// SETTINGS
export interface AppSettings {
  emailNotif: boolean;
  pushNotif: boolean;
  smsAlert: boolean;
  weeklyReport: boolean;
  twoFA: boolean;
  loginNotif: boolean;
  sessionTimeout: boolean;
  theme: ThemeType;
  dataRetention: string;
  analyticsShare: boolean;
  autoDelete: boolean;
}

// CONTEXT
export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  tokens: AuthTokens | null;
  setTokens: (tokens: AuthTokens | null) => void;
}

export interface AppContextType {
  notifications: Notification[];
  scanHistory: ScanHistoryItem[];
  reports: Report[];
  users: AdminUser[];
  settings: AppSettings;
  loading: Record<string, boolean>;
  unreadCount: number;
  setLoad: (key: string, val: boolean) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  addScan: (scan: ScanHistoryItem) => void;
  deleteScan: (id: string) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  addUser: (user: CreateUserPayload) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
}
