# TraceLink India AI Suite — Production Guide

## 🚀 Overview
The TraceLink India AI Suite is a production-hardened platform for meeting intelligence and regulatory data validation, designed specifically for the Indian pharmaceutical and supply chain sector.

## 🛠️ Key Production Features
- **Multi-Tenancy**: Data isolation per user ID.
- **Relational Persistence**: SQLite storage with foreign key integrity.
- **Security**: JWT-based authentication and Role-Based Access Control (RBAC).
- **Disk Safety**: Disk-based file handling to prevent RAM exhaustion.
- **Localization**: Specialized for Pune/Mumbai regional contexts and Indian regulatory standards.

---

## 🏗️ Deployment Options

### 1. Standard Node.js (Local/VPS)
1. **Configure Environment**:
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env and set a secure JWT_SECRET
   ```
2. **Build Client**:
   ```bash
   cd client && npm install && npm run build
   ```
3. **Start Platform**:
   ```bash
   cd ..
   npm run platform:build
   ```

### 2. Docker (Recommended for Production)
1. **Single Command Startup**:
   ```bash
   docker-compose up -d --build
   ```
   *The platform will be accessible at `http://localhost:5000`.*

---

## 🧪 Maintenance & Testing
- **Health Check**: `GET /api/health`
- **QA Suite**: Run `node server/test_api.js` from the root to perform a full system validation.
- **Database**: Located at `server/data/tracelink.sqlite`.

## 👤 Admin Access
- **Default username**: `admin`
- **Default password**: `adminPass2026`
- **Moderation**: Access the `/admin` route to manage meetings and validate system health.

---
**Project Owner**: Pruthvi Athrey  
**Preparations & Documentation**: Paarth Srivastava with Autonomous Engineering Team  
