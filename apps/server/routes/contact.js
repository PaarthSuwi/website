const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/contact
router.post("/", (req, res) => {
    try {
        const { name, email, company, phone, message, department } = req.body;

        // Validation
        const errors = [];
        if (!name || name.trim().length < 2) errors.push("Name is required (min 2 characters)");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required");
        if (!message || message.trim().length < 10) errors.push("Message is required (min 10 characters)");

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const id = `inq-${Date.now()}`;
        const submittedAt = new Date().toISOString();
        const status = "received";

        const stmt = db.prepare(`
            INSERT INTO inquiries (id, name, email, company, phone, department, message, submittedAt, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            name.trim(),
            email.trim(),
            company?.trim() || "Not specified",
            phone?.trim() || "Not provided",
            department?.trim() || "General",
            message.trim(),
            submittedAt,
            status
        );

        res.json({
            success: true,
            data: {
                id,
                message: "Thank you for your inquiry. Our enterprise team will contact you within 24 hours.",
                status,
            },
        });
    } catch (err) {
        console.error("Contact error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/contact/submissions (admin)
router.get("/submissions", (req, res) => {
    try {
        const inquiries = db.prepare("SELECT * FROM inquiries ORDER BY submittedAt DESC").all();
        res.json({ success: true, data: inquiries });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
