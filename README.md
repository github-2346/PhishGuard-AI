#  PhishGuard AI - A Phishing Detection Platform

PhishGuard AI is a full-stack threat intelligence platform designed to detect and prevent phishing attacks, malicious URLs, and social engineering email scams in real-time, Built with a robust **Spring Boot** backend and a sleek, dynamic **React (Vite)** frontend, the application integrates industry leading APIs like **VirusTotal** and **Google Safe Browsing** for highly accurate threat detection.

## Key Features

- **Real-Time URL Scanning:** Multi-layered security checks using Google Safe Browsing API, VirusTotal v3 API, and a custom Heuristic Fallback Engine.
- **AI Email Analysis:** Deep textual analysis to detect social engineering tactics, urgency keywords, and credential theft attempts.
- **Secure Authentication:** Stateless JWT (JSON Web Token) authentication with Bcrypt password hashing.
- **Interactive Dashboard:** Rich, real-time analytics displaying threat breakdowns, risk scores, and recent scan histories.
- **Cloud-Native Database:** Fully integrated with Serverless Neon DB (PostgreSQL) for scalable, reliable data persistence.


## Tech Stack

### **Frontend (Client)**
- **React 18** (Vite + TypeScript)
- **React Router v6** (Protected & Admin Routes)
- **Axios** (with JWT Interceptors)
- **Vanilla CSS + CSS Variables** 

### **Backend (Server)**
- **Java 17 & Spring Boot 3**
- **Spring Security & JWT**
- **Spring Data JPA & Hibernate**
- **Maven** (Dependency Management)

### **Database & Integrations**
- **Neon DB (PostgreSQL)**
- **VirusTotal API v3**
- **Google Safe Browsing API v4**


## Project Structure
```

├── backend
│   ├── src/main/java/com/phishguard/api
│   │   ├── controllers      # REST API endpoints
│   │   ├── services         # Business logic
│   │   ├── repositories     # Database access layer
│   │   ├── models           # Entity classes
│   │   ├── dto              # Request/Response DTOs
│   │   └── security         # JWT & Spring Security
│   │
│   ├── src/main/resources
│   │   └── application.properties
│   │
│   └── pom.xml
│
├── phishguard
│   ├── src
│   │   ├── components       # Reusable UI components
│   │   ├── pages            # Application pages
│   │   ├── services         # API communication layer
│   │   ├── context          # Global state management
│   │   ├── routes           # Route configuration
│   │   ├── styles           # Global styles
│   │   └── types            # TypeScript definitions
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore

```
## Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven
- A PostgreSQL database (or Neon DB account)

### 1. Clone the repository

git clone https://github.com/github-2346/PhishGuard-AI.git


### 2. Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create an `.env.local` file in the `backend` folder and add your credentials:
   ```env
   DB_URL=jdbc:postgresql://your-neon-db-url...
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   VIRUSTOTAL_API_KEY=your_virustotal_key
   GOOGLE_SB_API_KEY=your_google_safe_browsing_key
   JWT_SECRET=your_super_secret_jwt_key
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd phishguard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an `.env.local` file in the `phishguard` folder:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Architecture Flow

1. **Client Request:** User submits a URL or Email via the React UI.
2. **Security Filter:** Spring Security intercepts the request and validates the JWT token.
3. **Controller Layer:** The request is mapped to the `ScannerController`.
4. **Service Layer:** 
   - *Fast Path:* Checks Google Safe Browsing.
   - *Deep Scan:* Queries VirusTotal.
   - *Fallback:* Custom heuristic keyword matching.
5. **Persistence:** The scan result is saved to Neon DB via Spring Data JPA.
6. **Response:** A comprehensive JSON response is sent back and visualized on the React Dashboard.
