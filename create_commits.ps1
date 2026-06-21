git init

# Commit 1
git add .gitignore
git commit -m "Initial commit: Add project gitignore"

# Commit 2
git add backend/pom.xml backend/mvnw backend/mvnw.cmd backend/.mvn
git commit -m "Initialize Spring Boot backend project"

# Commit 3
git add backend/src/main/resources
git commit -m "Setup backend configuration properties"

# Commit 4
git add backend/src/main/java/com/phishguard/api/models
git commit -m "Implement core domain models for User and Threat Analysis"

# Commit 5
git add backend/src/main/java/com/phishguard/api/repositories backend/src/main/java/com/phishguard/api/exceptions
git commit -m "Add JPA repositories and custom error handling"

# Commit 6
git add backend/src/main/java/com/phishguard/api/security
git commit -m "Configure JWT authentication and Spring Security"

# Commit 7
git add backend/src/main/java/com/phishguard/api/dto
git commit -m "Create Data Transfer Objects (DTOs) for API communication"

# Commit 8
git add backend/src/main/java/com/phishguard/api/services
git commit -m "Integrate VirusTotal and Google Safe Browsing service layers"

# Commit 9
git add backend/src/main/java/com/phishguard/api/controllers
git add backend/src/main/java/com/phishguard/api/PhishguardApiApplication.java
git commit -m "Develop REST controllers for authentication and scanning"

# Commit 10
git add phishguard/package.json phishguard/vite.config.ts phishguard/tsconfig.json phishguard/tsconfig.node.json phishguard/index.html phishguard/public
git commit -m "Initialize React 18 + Vite frontend workspace"

# Commit 11
git add phishguard/src/styles
git commit -m "Add global CSS styles and design system variables"

# Commit 12
git add phishguard/src/types phishguard/src/context
git commit -m "Implement global state management and TypeScript interfaces"

# Commit 13
git add phishguard/src/components
git commit -m "Create reusable UI components (Badges, Cards, Layout)"

# Commit 14
git add phishguard/src/pages/auth
git commit -m "Develop authentication pages (Login, Register)"

# Commit 15
git add phishguard/src/pages/dashboard phishguard/src/pages/scanner phishguard/src/pages/email
git commit -m "Build dashboard and scanner UI interfaces"

# Commit 16
git add phishguard/src/services
git commit -m "Integrate frontend Axios services with Spring Boot backend"

# Commit 17
git add phishguard/src/routes phishguard/src/App.tsx phishguard/src/main.tsx phishguard/eslint.config.js
git commit -m "Setup React Router navigation and protected routes"

# Commit 18
git add .
git commit -m "Final integration fixes and cleanup"

# Add remote and push instructions
git branch -M main
git remote add origin https://github.com/SaurabhBiswal/MEGA-PROJECT-16-Java---AI-Phishing-Detection-Platform.git
