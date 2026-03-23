const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { authenticate } = require("../middleware/auth");

// POST /api/minutes/generate
router.post("/generate", authenticate, (req, res) => {
    try {
        const { meetingId } = req.body;
        const userId = req.user.id;

        if (!meetingId) {
            return res.status(400).json({ success: false, error: "meetingId is required" });
        }

        // 1. Check if minutes already exist in DB
        const existing = db.prepare("SELECT * FROM minutes WHERE meetingId = ? AND userId = ?").get(meetingId, userId);
        if (existing) {
            return res.json({
                success: true,
                data: {
                    ...existing,
                    attendees: JSON.parse(existing.attendees),
                    agenda: JSON.parse(existing.agenda),
                    decisions: JSON.parse(existing.decisions),
                    actionItems: JSON.parse(existing.actionItems),
                    risks: JSON.parse(existing.risks),
                    complianceNotes: JSON.parse(existing.complianceNotes)
                }
            });
        }

        // 2. Generate new minutes (Simulated AI Logic)
        const id = `mom-${uuidv4().slice(0, 8)}`;
        const generatedAt = new Date().toISOString();

        const minutes = {
            id,
            meetingId,
            userId,
            title: `Meeting ${meetingId} — Minutes of Meeting`,
            generatedAt,
            attendees: JSON.stringify(["Dr. Sarah Chen (QA Lead)", "Raj Patel (RA Manager)", "Lisa Wong (Manufacturing)"]),
            agenda: JSON.stringify([
                "Review of compliance audit findings",
                "Regulatory submission timeline update",
                "Batch record review status",
                "Root cause analysis finalization",
                "Equipment qualification progress",
            ]),
            decisions: JSON.stringify([
                "Deviation investigation marked as complete pending final documentation",
                "IQ/OQ protocol execution approved to begin next week",
                "Supplier audit to be scheduled based on ICH Q7 guidelines",
            ]),
            actionItems: JSON.stringify([
                { action: "Finalize root cause analysis documentation", owner: "Dr. Sarah Chen", deadline: "2026-03-20", priority: "High", status: "In Progress" },
                { action: "Submit comprehensive regulatory follow-up within 30-day window", owner: "Raj Patel", deadline: "2026-04-09", priority: "Critical", status: "Pending" },
                { action: "Execute IQ/OQ protocols for qualified equipment", owner: "Lisa Wong", deadline: "2026-03-25", priority: "Medium", status: "Pending" },
            ]),
            risks: JSON.stringify([
                { risk: "30-day regulatory response deadline is approaching", severity: "High", mitigation: "Raj Patel has drafted initial response; comprehensive follow-up in progress" },
                { risk: "Equipment qualification delays could impact production schedule", severity: "Medium", mitigation: "Protocols approved; execution starts next week" },
            ]),
            complianceNotes: JSON.stringify([
                "All batch records reviewed per 21 CFR Part 211 requirements",
                "Deviation CAPA aligned with ICH Q10 pharmaceutical quality system",
                "Supplier audit checklist compliant with ICH Q7 GMP guidelines",
                "Electronic records maintained per 21 CFR Part 11",
            ]),
        };

        const stmt = db.prepare(`
            INSERT INTO minutes (id, meetingId, userId, title, generatedAt, attendees, agenda, decisions, actionItems, risks, complianceNotes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            minutes.id,
            minutes.meetingId,
            minutes.userId,
            minutes.title,
            minutes.generatedAt,
            minutes.attendees,
            minutes.agenda,
            minutes.decisions,
            minutes.actionItems,
            minutes.risks,
            minutes.complianceNotes
        );

        res.json({
            success: true,
            data: {
                ...minutes,
                attendees: JSON.parse(minutes.attendees),
                agenda: JSON.parse(minutes.agenda),
                decisions: JSON.parse(minutes.decisions),
                actionItems: JSON.parse(minutes.actionItems),
                risks: JSON.parse(minutes.risks),
                complianceNotes: JSON.parse(minutes.complianceNotes)
            }
        });
    } catch (err) {
        console.error("Minutes generation error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/minutes/:meetingId
router.get("/:meetingId", authenticate, (req, res) => {
    try {
        const minutes = db.prepare("SELECT * FROM minutes WHERE meetingId = ? AND userId = ?").get(req.params.meetingId, req.user.id);
        if (!minutes) {
            return res.status(404).json({ success: false, error: "Minutes not generated or access denied" });
        }
        res.json({
            success: true,
            data: {
                ...minutes,
                attendees: JSON.parse(minutes.attendees),
                agenda: JSON.parse(minutes.agenda),
                decisions: JSON.parse(minutes.decisions),
                actionItems: JSON.parse(minutes.actionItems),
                risks: JSON.parse(minutes.risks),
                complianceNotes: JSON.parse(minutes.complianceNotes)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
