# 📗 TraceLink India AI Suite — Complete Project Manual (A-Z)

Welcome to the definitive manual for the **TraceLink India AI Suite**. This document is a comprehensive "All-to-Know" guide designed for developers, admins, and end-users. It explains the **Why, How, and Where** of every component, including detailed usage steps and system requirements.

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

## 💻 2. System Requirements & Prerequisites

### Minimum Hardware
- **CPU**: Dual-core 2.4GHz+
- **RAM**: 4GB (8GB Recommended for 1GB file processing)
- **Storage**: 500MB for installation + space for uploaded meeting data.

### Software Prerequisites
- **Node.js**: v20.x or higher.
- **npm**: v10.x or higher.
- **Docker** (Optional): Only if deploying via containerization.
- **OS**: Windows 10/11 (Preferred), macOS, or Linux.

---

## 📂 3. Folder Anatomy & File Map (A-Z)

The project follows a **Modular Monorepo** structure for maximum scanability:

### 📁 Root Directory
- `package.json`: **The Registry**. Defines scripts, tech stack, and dependencies.
- `apps/`: Core application source code.
- `storage/`: Isolated data directory (Persistent).
- `deploy/`: Containerization logic (Docker).
- `docs/`: Documentation and legacy archives.
- `tests/`: Autonomous QA suite.

### 📁 /apps
- **desktop/**: Electron Main process (`main.js`) and physical assets (Icons).
- **server/**: Backend Express API, DB schema (`db.js`), and Auth logic.
- **client/**: Frontend React + Vite source code.

### 📁 /storage
- **db/**: Contains `tracelink.db` (The source of truth).
- **uploads/**: Destination for disk-based large file storage.

---

## 🚀 4. Installation & Setup Guide

### Method A: Local Development (Node.js)
1.  Open terminal in the project root.
2.  Install dependencies: `npm install`
3.  Start the full suite (Frontend + Backend + Desktop Window):
    ```bash
    npm run dev
    ```

### Method B: Production Deployment (Docker)
1.  Ensure Docker is running.
2.  Navigate to the `deploy/` directory.
3.  Run: `docker-compose up -d`
4.  Access the suite at `http://localhost:5000`.

---

## 📖 5. Step-by-Step User Guide (How to Use)

### Step 1: Authentication
- **Login**: Use your credentials. If it's your first time, the Admin credentials are `admin` / `adminPass2026`.
- **Registration**: New users can sign up; their work (meetings/validations) will be isolated from yours.

### Step 2: Meeting Intelligence 🎙️
1.  Navigate to **Meeting Intelligence**.
2.  Upload your meeting audio (supports large pharma meeting files).
3.  The system will process the data and generate a **Generative Transcript**.
4.  **Export**: Use the PDF or DOCX buttons to download regulator-ready minutes.

### Step 3: Data Validation 📊
1.  Navigate to **Data Validation**.
2.  Upload your Batch Records or Supply Chain spreadsheets (XLSX/CSV).
3.  The system will perform high-speed validation against pharma criteria.
4.  Review the **Compliance Score** and **Data Integrity Alerts**.

### Step 4: Admin Moderation (Admins Only)
1.  Navigate to `/admin`.
2.  Monitor system health and database statistics.
3.  Admins can delete individual records or perform a "System Wipe" for fresh deployment preparation.

---

## 🛡️ 6. Security, Relationships & Data Flow

### The Data "Spider-Web" (Relationships)
The system uses a **Relational Schema** to ensure data integrity:
1.  **Users** (1) ↔ (N) **Meetings**: A user owns multiple meetings.
2.  **Meetings** (1) ↔ (1) **Minutes**: Each meeting has exactly one set of AI minutes.
3.  **Users** (1) ↔ (N) **ValidationHistory**: Files validated are tied to the specific user.

### Security Layers
- **Password Hashing**: Uses `bcryptjs` with 10 salt rounds. Even if the DB is stolen, passwords cannot be read.
- **JWT (Json Web Tokens)**: A cryptographically signed "ID Badge" issued at login.
- **Access Control**: Users are restricted to their own `UserId` via middleware.

---

## 📜 7. The 14-Phase Iteration Log
The project was built in a multi-stage autonomous engineering process:
1.  **Phases 1-6**: Moving from a raw prototype to a secure, SQL-backed system.
2.  **Phases 7-10**: Localization for Pune/Mumbai and stabilization of large file handling.
3.  **Phases 11-14**: Dockerization, Multi-tenant isolation, and 100% QA pass.

---

## ⚠️ 8. Maintenance Hazards (The "Do Not Change" Zone)

| Component | Risk | Consequence |
| :--- | :--- | :--- |
| **apps/server/db.js** | High | Schema changes without migrations will crash the app. |
| **storage/** | Critical | Deleting this folder deletes all user data and the database. |
| **apps/server/middleware/auth.js** | Critical | Disabling this creates a massive security leak. |
| **package.json** | Medium | Changing script paths breaks the Electron launcher. |

---

## 🏁 9. Final Context
The project transition ensures that the **TraceLink AI Suite** is no longer a "front-end demo" but a specialized, secure **Enterprise Engine** for the Indian Pharmaceutical sector.

**Project Owner**: Pruthvi Athrey  
**Preparations & Documentation**: Paarth Srivastava with Autonomous Engineering Team  
**Date of Completion**: 2026-03-17
