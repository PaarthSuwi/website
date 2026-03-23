const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/dashboard/stats
router.get("/stats", (req, res) => {
    try {
        const stats = db.prepare("SELECT * FROM stats WHERE id = 1").get();
        res.json({
            success: true,
            data: stats,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
