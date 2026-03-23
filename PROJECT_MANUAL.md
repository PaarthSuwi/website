# 📗 TraceLink India AI Suite — Complete Engineering Manual (A-Z)

Welcome to the definitive manual for the **TraceLink India AI Suite**. This document is a comprehensive "A-Z" guide designed for developers, admins, and stakeholders. It explains the **Why, How, and Where** of every component in the system.

---

## 🏗️ 1. Technical Philosophy — "The How & Why"

### The Goal
The suite was designed to transform a raw AI prototype into an **Enterprise-Ready Platform** specialized for the Indian pharmaceutical and supply chain sector (specifically Pune/Mumbai hubs).

### Core Principles
1.  **Work Isolation (Multi-Tenancy)**: Every user must only see their own work.
2.  **Persistence over Volatility**: No data should be in-memory only. Everything is saved to disk via SQLite.
3.  **Stability First**: Prevents memory crashes by using disk-based storage for large (up to 1GB) enterprise files.
4.  **Hardware Independence**: Built as an Electron app so it can run on a desktop without needing a separate web server setup.

---

## 📂 2. Folder Anatomy & File Map (A-Z)

### 📁 Root Directory
- `main.js`: **The Brain**. Initializes the Electron window and the background Node.js server.
- `package.json`: **The Registry**. Defines the tech stack, dependencies, and launch scripts (`npm run dev`).
- `Dockerfile` / `docker-compose.yml`: **The Infrastructure**. Logic for containerizing the app for production.
- `README.md`: The quick-start guide.
- `PROJECT_MANUAL.md`: (This file) The deep-dive engineering reference.

### 📁 /client (Frontend - React + Vite)
- `src/main.jsx`: Entry point for the frontend.
- `src/App.jsx`: Main routing configuration.
- `src/context/AuthContext.jsx`: Manages logins, tokens, and user persistence.
- `src/pages/`:
    - `Login.jsx` / `Register.jsx`: Multi-tenant entry points.
    - `Dashboard.jsx`: Unified overview of meeting tasks.
    - `MeetingIntelligence.jsx`: The "AI Brain" interface.
    - `TranscriptViewer.jsx`: Dedicated engine for scrolling 120min+ transcripts.
    - `AdminDashboard.jsx`: Restricted environment for system wipes/moderation.

### 📁 /server (Backend - Express + SQLite)
- `index.js`: **The Bridge**. Sets up the API, security middleware, and serves the frontend.
- `db.js`: **The Foundation**. Defines the relational SQL schema and manages migrations.
- `routes/`:
    - `auth.js`: Logic for registration, password hashing (bcrypt), and token issuance (JWT).
    - `meetings.js`: Handles disk-based uploads and "AI" simulation logic.
    - `minutes.js`: Manages the persistent storage of generated meeting notes.
    - `validation.js`: Processes large CSV/XLSX files without leaking memory.
- `middleware/auth.js`: **The Gatekeeper**. Verifies tokens and prevents cross-user data leaks.
- `data/`: Contains `tracelink.sqlite` (The actual database).
- `test_api.js`: **The Validator**. An autonomous QA suite that checks every system feature.

---

## 🛡️ 3. Security, Relationships & Data Flow

### The Data "Spider-Web" (Relationships)
The system uses a **Relational Schema** to ensure data integrity:
1.  **Users** (1) ↔ (N) **Meetings**: A user owns multiple meetings.
2.  **Meetings** (1) ↔ (1) **Minutes**: Each meeting has exactly one set of AI minutes.
3.  **Users** (1) ↔ (N) **ValidationHistory**: Files validated are tied to the specific user.

### Security Layers
- **Password Hashing**: Uses `bcryptjs` with 10 salt rounds. Even if the DB is stolen, passwords cannot be read.
- **JWT (Json Web Tokens)**: A cryptographically signed "ID Badge" issued at login. Every API call requires this badge.
- **Access Control (isAdmin)**: Specific routes (like database wiping) verify if the `role` is `admin`.

---

## 📜 4. The 14-Phase Iteration Log
The project was built in a multi-stage autonomous engineering process:

1.  **Phases 1-3 (Discovery & Audit)**: Analyzing the original "Green Screen" code for weaknesses.
2.  **Phases 4-6 (Repair & Hardening)**: 
    - Fixed the "Memory Leak" where uploads stayed in RAM.
    - Replaced mock data with a Real SQL Database.
    - Implemented the first security layer (Login).
3.  **Phases 7-9 (Stabilization)**: 
    - Perfected the Pune/Mumbai localization.
    - Added the autonomous `test_api.js` to ensure zero errors.
4.  **Phases 10-14 (Production Readiness)**:
    - Dockerization (Packaging for the world).
    - Multi-tenant isolation (Work isolation).
    - Final engineering handoff.

---

## ⚠️ 5. Maintenance Hazards (The "Do Not Change" Zone)

| Component | Risk of Changing | Consequence |
| :--- | :--- | :--- |
| **db.js (Schema)** | High | Modifying table columns without a migration will cause "No such column" crashes. |
| **middleware/auth.js** | Critical | Disabling this will allow anyone to see everyone's private meeting notes. |
| **multer.diskStorage** | High | Switching back to `memoryStorage` will cause the server to crash on large files. |
| **package.json (Scripts)** | Medium | Changing the `dev` script paths will prevent the desktop app from being able to find the server. |
| **jwtSecret** | Critical | If changed in production, all current users will be logged out immediately. |

---

## 📦 6. Dependencies — "The Engine Parts"

### Frontend
- **React & Vite**: Fast UI rendering.
- **Framer Motion**: Smooth glassmorphism transitions.
- **jspdf / docx**: Local file generation (No internet required for PDFs).

### Backend
- **Better-SQLite3**: The fastest local SQL engine available.
- **jsonwebtoken**: For secure sessions.
- **bcryptjs**: For military-grade password security.
- **xlsx**: For processing massive pharmaceutical batch records.

---

## 🏁 7. Iteration Context
The logs for this project reflect a move from **Simulated Logic** toward **Persistent Reality**. Every time the user requested a "save" or "secure" feature, the code was refactored to move away from JavaScript Variables (RAM) and into SQL Rows (Disk). 

**Prepared by**: Autonomous Engineering Team  
**Project Owner**: Pruthvi Athrey  
**Date of Completion**: 2026-03-17
