// ─── Realistic Pharmaceutical Mock Data for TraceLink AI Suite ─────────────

const dashboardStats = {
    validatedRecords: 12_482_931,
    riskFlags: 0.43,
    regulatorySLAsMet: 99.97,
    auditReadiness: "High",
    openCorrectiveActions: 3,
    dataIntegrityAlerts: 1,
    activeMeetings: 47,
    pendingMinutes: 12,
    totalTranscripts: 183,
    complianceScore: 98.2,
    lastUpdated: new Date().toISOString(),
};

const sampleTranscripts = [
    {
        id: "mtg-001",
        title: "Q1 Batch Release — Cipla Pune",
        date: "2026-03-10T10:00:00Z",
        duration: "47 min",
        speakers: ["Dr. Ananya Iyer (QA Lead)", "Rajat Sharma (RA Manager)", "Priya Nair (Production)"],
        status: "processed",
        lines: [
            { time: "00:00:06", speaker: "Dr. Ananya Iyer", role: "QA Lead", text: "Namaste team. Let's start with the batch release status for our Pune facility. We have three lots pending final disposition." },
            { time: "00:00:22", speaker: "Rajat Sharma", role: "RA Manager", text: "Ananya, I must flag that Lot 2024-MH-0847 has an open deviation from the transport team regarding the Mumbai-Pune corridor heat index." },
            { time: "00:00:41", speaker: "Priya Nair", role: "Production", text: "We've completed the impact assessment at our Baner lab. Stability data shows no degradation. The report is ready for sign-off." },
            { time: "00:01:03", speaker: "Dr. Ananya Iyer", role: "QA Lead", text: "Good. I'll review that today. For the remaining lots, ensure the CDSCO compliance check is complete." },
        ],
    },
    {
        id: "mtg-002",
        title: "Regulatory Check-in — Dr. Reddy's",
        date: "2026-03-08T14:30:00Z",
        duration: "32 min",
        speakers: ["Vikram Kulkarni (VP Supply Chain)", "Dr. Kavita Rao (Compliance)", "Arjun Mehra (IT Ops)"],
        status: "processed",
        lines: [
            { time: "00:00:05", speaker: "Vikram Kulkarni", role: "VP Supply Chain", text: "Let's review our DSCSA and local Indian compliance posture. Are our systems synced with the Mumbai data center?" },
            { time: "00:00:25", speaker: "Dr. Kavita Rao", role: "Compliance", text: "Our serialization coverage across the Hyderabad and Pune lines is at 100%. No issues reported in the last audit." },
        ],
    },
];

const sampleMinutes = {
    "mtg-001": {
        meetingId: "mtg-001",
        title: "Q1 Batch Release Pune — Minutes of Meeting",
        generatedAt: "2026-03-10T11:00:00Z",
        attendees: ["Dr. Ananya Iyer (QA Lead)", "Rajat Sharma (RA Manager)", "Priya Nair (Production)"],
        agenda: [
            "Q1 batch release status review (Pune facility)",
            "Open deviation discussion (Maharashtra Transit)",
            "CAPA timeline revision for Sun Pharma partners",
        ],
        decisions: [
            "Two lots cleared for release; one lot pending Mumbai transit deviation review",
            "CAPA timeline revision to be signed off by Friday IST",
        ],
        actionItems: [
            { action: "Review deviation report for Lot 2024-MH-0847", owner: "Dr. Ananya Iyer", deadline: "2026-03-10", priority: "High", status: "In Progress" },
            { action: "Update CDSCO compliance checklist", owner: "Rajat Sharma", deadline: "2026-03-12", priority: "High", status: "Pending" },
        ],
        risks: [
            { risk: "Heat index during Mumbai-Pune transit impacting cold-chain", severity: "Medium", mitigation: "Sensors confirmed within threshold; stability data validated" },
        ],
        complianceNotes: [
            "Aligned with CDSCO and WHO-GMP standards",
            "Electronic records maintained per 21 CFR Part 11 and Indian IT Act",
        ],
    },
};

const validationRules = [
    { id: "rule-001", name: "GTIN Format", description: "GTIN must be exactly 14 digits", field: "gtin", check: (val) => /^\d{14}$/.test(String(val).trim()) },
    { id: "rule-002", name: "Serial Number", description: "Serial number must not be empty", field: "serial_number", check: (val) => val && String(val).trim().length > 0 },
    { id: "rule-003", name: "Lot Number", description: "Lot number format must match pattern", field: "lot_number", check: (val) => /^[A-Z0-9\-]{4,20}$/i.test(String(val).trim()) },
    { id: "rule-004", name: "Expiry Date", description: "Expiry date must be a valid future date", field: "expiry_date", check: (val) => { const d = new Date(val); return !isNaN(d.getTime()) && d > new Date(); } },
    { id: "rule-005", name: "NDC Code", description: "NDC must match xxxxx-xxxx-xx format", field: "ndc", check: (val) => /^\d{5}-\d{4}-\d{2}$/.test(String(val).trim()) },
    { id: "rule-006", name: "Manufacturer", description: "Manufacturer name required", field: "manufacturer", check: (val) => val && String(val).trim().length >= 2 },
    { id: "rule-007", name: "Transaction Date", description: "Transaction date must be valid", field: "transaction_date", check: (val) => !isNaN(new Date(val).getTime()) },
    { id: "rule-008", name: "Quantity", description: "Quantity must be a positive integer", field: "quantity", check: (val) => Number.isInteger(Number(val)) && Number(val) > 0 },
];

module.exports = {
    dashboardStats,
    sampleTranscripts,
    sampleMinutes,
    validationRules,
};
