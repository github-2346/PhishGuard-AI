# PhishGuard  AI — Frontend

**AI Phishing Detection Platform** built with React 18, TypeScript, Vite, and Axios, designed to integrate with a Java Spring Boot + PostgreSQL backend via REST APIs and JWT authentication.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit VITE_API_BASE_URL to point to your Spring Boot backend

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

##  Project Structure

```
src/
├── assets/                  # Static assets (images, icons)
├── components/
│   ├── common/              # Reusable UI: Button, Badge, Modal, Tooltip, Toggle…
│   ├── dashboard/           # Dashboard-specific charts and widgets
│   ├── scanner/             # URL scanner components
│   ├── email/               # Email analysis components
│   ├── history/             # Scan history table
│   ├── reports/             # Reports list and detail
│   ├── admin/               # Admin panel components
│   └── layouts/             # AppShell (sidebar + topbar)
├── pages/
│   ├── auth/                # Login, Register, ForgotPassword, ResetPassword
│   ├── dashboard/           # DashboardPage
│   ├── scanner/             # URLScannerPage
│   ├── email/               # EmailAnalysisPage
│   ├── history/             # ScanHistoryPage
│   ├── reports/             # ReportsPage
│   ├── admin/               # AdminUsersPage, AdminAnalyticsPage, AdminThreatsPage
│   ├── profile/             # ProfilePage
│   └── settings/            # SettingsPage
├── services/
│   ├── axiosInstance.ts     # Axios base + JWT interceptors + token refresh
│   ├── authService.ts       # login, register, logout, refresh, forgot, reset
│   ├── urlScanService.ts    # scanURL, getHistory, deleteScan, download
│   ├── emailScanService.ts  # analyzeEmail, getResult
│   ├── reportService.ts     # getReports, getById, download, delete
│   ├── adminService.ts      # getUsers, createUser, toggleStatus, deleteUser, analytics
│   ├── settingsService.ts   # getSettings, updateSettings
│   └── index.ts             # barrel export
├── hooks/
│   └── index.ts             # useURLScan, useEmailScan, useScanHistory, useReports, useAdmin
├── context/
│   ├── AuthContext.tsx      # JWT auth state: user, tokens, rehydration
│   └── AppContext.tsx       # Global state: scans, notifications, settings, users
├── routes/
│   └── AppRouter.tsx        # React Router v6: protected + admin-only + public-only routes
├── utils/                   # Helpers (formatDate, getRiskColor, initials, …)
├── types/
│   └── index.ts             # All TypeScript interfaces and types
└── styles/
    └── globals.css          # CSS variables, reset, animations
```


##  Authentication Flow

1. User submits login → `POST /auth/login` → receives `{ token, refreshToken, user }`
2. Tokens saved to `localStorage` (remember me) or `sessionStorage`
3. Every request attaches `Authorization: Bearer <token>` via Axios interceptor
4. On 401 → interceptor calls `POST /auth/refresh` → retries original request
5. On refresh failure → tokens cleared → redirect to `/login`


##  Route Structure

| Path                  | Access    | Page                  |
|-----------------------|-----------|-----------------------|
| `/login`              | Public    | Login                 |
| `/register`           | Public    | Register              |
| `/forgot-password`    | Public    | Forgot Password       |
| `/reset-password`     | Public    | Reset Password        |
| `/dashboard`          | Auth      | Dashboard             |
| `/scanner`            | Auth      | URL Scanner           |
| `/email`              | Auth      | Email Analysis        |
| `/history`            | Auth      | Scan History          |
| `/reports`            | Auth      | Reports               |
| `/profile`            | Auth      | Profile               |
| `/settings`           | Auth      | Settings              |
| `/admin/users`        | Admin     | User Management       |
| `/admin/analytics`    | Admin     | Analytics             |
| `/admin/threats`      | Admin     | Threat Monitor        |


##  Backend API Endpoints Expected

| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | `/auth/login`                 | Login                    |
| POST   | `/auth/register`              | Register                 |
| POST   | `/auth/refresh`               | Refresh JWT token        |
| POST   | `/auth/logout`                | Logout                   |
| POST   | `/auth/forgot-password`       | Send reset email         |
| POST   | `/auth/reset-password`        | Reset password           |
| GET    | `/auth/me`                    | Get current user         |
| PUT    | `/auth/profile`               | Update profile           |
| POST   | `/auth/avatar`                | Upload avatar            |
| POST   | `/scan/url`                   | Scan URL                 |
| GET    | `/scan/url/:id`               | Get URL scan result      |
| POST   | `/scan/email`                 | Analyze email            |
| GET    | `/scan/history`               | Get scan history         |
| DELETE | `/scan/:id`                   | Delete scan              |
| GET    | `/reports`                    | Get all reports          |
| GET    | `/reports/:id`                | Get report by ID         |
| GET    | `/reports/:id/download`       | Download report PDF      |
| GET    | `/admin/users`                | Get all users            |
| POST   | `/admin/users`                | Create user              |
| PUT    | `/admin/users/:id/status`     | Toggle user status       |
| DELETE | `/admin/users/:id`            | Delete user              |
| GET    | `/admin/analytics`            | Get platform analytics   |
| GET    | `/settings`                   | Get settings             |
| PUT    | `/settings`                   | Update settings          |


##  Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | React 18                          |
| Language       | TypeScript 5                      |
| Build Tool     | Vite 5                            |
| HTTP Client    | Axios (with interceptors)         |
| Routing        | React Router v6                   |
| State          | Context API (Auth + App)          |
| Styling        | CSS Variables + Inline styles     |
| Fonts          | Syne (display) + JetBrains Mono   |
| Backend        | Java Spring Boot (JWT + REST)     |
| Database       | PostgreSQL / MySQL                |
