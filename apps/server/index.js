require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1024mb" }));
app.use(express.urlencoded({ extended: true, limit: "1024mb" }));

// ─── API Routes ──────────────────────────────────────────────────────
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/validation", require("./routes/validation"));
app.use("/api/meetings", require("./routes/meetings"));
app.use("/api/minutes", require("./routes/minutes"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/intelligence", require("./intelligence"));
app.use("/api/auth", require("./routes/auth"));

// ─── Health Check ────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "TraceLink AI Suite API",
        version: "1.0.0",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ─── Serve Frontend (production) ─────────────────────────────────────
const clientBuild = path.join(__dirname, "..", "client", "dist");
console.log(`[SERVER] Serving frontend from: ${clientBuild}`);
if (!require('fs').existsSync(clientBuild)) {
    console.error(`[SERVER] CRITICAL: Frontend build path does not exist: ${clientBuild}`);
}


app.use(express.static(clientBuild));
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        // Fallback for SPA routing
        const indexPath = path.join(clientBuild, "index.html");
        if (require('fs').existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send("Frontend build not found");
        }
    }
});

// ─── Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
});

// ─── Start Server ────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
    const interfaces = os.networkInterfaces();
    let localIP = "localhost";
    for (const ifName of Object.keys(interfaces)) {
        for (const iface of interfaces[ifName]) {
            if (iface.family === "IPv4" && !iface.internal) {
                localIP = iface.address;
                break;
            }
        }
    }

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║              TraceLink AI Suite — Server                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Local:     http://localhost:${PORT}                          ║
║  Network:   http://${localIP}:${PORT}                      ║
║                                                              ║
║  API Docs:  http://localhost:${PORT}/api/health              ║
║                                                              ║
║  Share the Network URL with anyone on your WiFi to           ║
║  give them access to the platform.                           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
