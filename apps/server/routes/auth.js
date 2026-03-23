const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "tracelink-india-secret-key-2026";

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: "Username and password are required" });
        }

        // Check if user exists
        const existing = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
        if (existing) {
            return res.status(400).json({ success: false, error: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = `usr-${uuidv4().slice(0, 8)}`;

        // Static admin check for initial setup
        let role = 'user';
        if (username.toLowerCase() === 'admin') {
            role = 'admin';
        }

        db.prepare("INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)").run(
            id,
            username,
            hashedPassword,
            role,
            new Date().toISOString()
        );

        res.json({ success: true, message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ success: false, error: "Server error during registration" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: "Username and password are required" });
        }

        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, error: "Server error during login" });
    }
});

// GET /api/auth/me (Verify token)
router.get("/me", (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, error: "No token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ success: true, data: decoded });
    } catch (err) {
        res.status(401).json({ success: false, error: "Invalid token" });
    }
});

module.exports = router;
