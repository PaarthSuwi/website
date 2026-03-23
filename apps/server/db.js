const Database = require('better-sqlite3');
const path = require('path');
const { dashboardStats } = require('./data/mockData');
const fs = require('fs');

// Path handling for packaged app vs dev
let dbPath;
if (process.env.APPDATA) {
  // If in Windows environment, use AppData
  const userDataPath = path.join(process.env.APPDATA, 'tracelink-ai-suite');
  if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath, { recursive: true });
  dbPath = path.join(userDataPath, 'tracelink.db');
} else {
  // Use storage/db in new hierarchy
  const storageDbDir = path.join(__dirname, '..', '..', 'storage', 'db');
  if (!fs.existsSync(storageDbDir)) fs.mkdirSync(storageDbDir, { recursive: true });
  dbPath = path.join(storageDbDir, 'tracelink.db');
}

const db = new Database(dbPath);

// ─── Initialize Schema ───────────────────────────────────────────────

// 0. Users & Authentication
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    created_at TEXT
  )
`);

// 1. Dashboard Stats (Single row)
db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    validatedRecords INTEGER,
    riskFlags REAL,
    regulatorySLAsMet REAL,
    auditReadiness TEXT,
    openCorrectiveActions INTEGER,
    dataIntegrityAlerts INTEGER,
    complianceScore REAL,
    lastUpdated TEXT
  )
`);

// Migrations for existing tables (ensure userId column exists)
try { db.exec("ALTER TABLE meetings ADD COLUMN userId TEXT"); } catch (e) { /* already exists */ }
try { db.exec("ALTER TABLE validation_history ADD COLUMN userId TEXT"); } catch (e) { /* already exists */ }

// Ensure foreign keys are enabled
db.exec("PRAGMA foreign_keys = ON;");

// 4. Minutes of Meeting (MOM)
db.exec(`
  CREATE TABLE IF NOT EXISTS minutes (
    id TEXT PRIMARY KEY,
    meetingId TEXT UNIQUE,
    userId TEXT,
    title TEXT,
    generatedAt TEXT,
    attendees JSON,
    agenda JSON,
    decisions JSON,
    actionItems JSON,
    risks JSON,
    complianceNotes JSON,
    FOREIGN KEY (meetingId) REFERENCES meetings(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

// 5. Contact Inquiries
db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    company TEXT,
    phone TEXT,
    department TEXT,
    message TEXT,
    submittedAt TEXT,
    status TEXT
  )
`);

// ─── Seed Initial Data ───────────────────────────────────────────────

// 0. Default Admin (If not exists)
// Note: In production, users should register their own admin.
// For initial delivery, we seed a default account.
const bcrypt = require('bcryptjs');
(async () => {
  const adminExists = db.prepare("SELECT * FROM users WHERE username = 'admin'").get();
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("adminPass2026", 10);
    db.prepare("INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)").run(
      "usr-admin-default",
      "admin",
      hashedPassword,
      "admin",
      new Date().toISOString()
    );
    console.log("[DATABASE] Default admin account seeded: admin / adminPass2026");
  }
})();

const insertStat = db.prepare(`
  INSERT OR IGNORE INTO stats (id, validatedRecords, riskFlags, regulatorySLAsMet, auditReadiness, openCorrectiveActions, dataIntegrityAlerts, complianceScore, lastUpdated)
  VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertStat.run(
  dashboardStats.validatedRecords,
  dashboardStats.riskFlags,
  dashboardStats.regulatorySLAsMet,
  dashboardStats.auditReadiness,
  dashboardStats.openCorrectiveActions,
  dashboardStats.dataIntegrityAlerts,
  dashboardStats.complianceScore,
  new Date().toISOString()
);

module.exports = db;
