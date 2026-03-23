const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const os = require('os');

const API_BASE = 'http://localhost:5000/api';
let token = '';

async function runTests() {
    console.log("🚀 Starting TraceLink India AI Suite API Validation\n");

    const tmpDir = os.tmpdir();
    const dummyPath = path.join(tmpDir, 'dummy_meeting.txt');
    const csvPath = path.join(tmpDir, 'test_data.csv');
    const largePath = path.join(tmpDir, 'large_test.txt');

    try {
        // 1. Health Check
        console.log("Checking Health...");
        const health = await fetch(`${API_BASE}/health`).then(r => r.json());
        console.log("Health Status:", health.status, "\n");

        // 2. Authentication Test
        console.log("Testing Registration...");
        const user = { username: `tester-${Date.now()}`, password: "testPassword123" };
        const reg = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(r => r.json());
        console.log("Registration:", reg.success ? "Passed" : "Failed", reg.error || "");

        console.log("Testing Login...");
        const login = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(r => r.json());

        if (login.success) {
            token = login.data.token;
            console.log("Login: Passed (Token acquired)");
        } else {
            console.error("Login: Failed", login.error);
            process.exit(1);
        }
        console.log("");

        // 3. Meeting Intelligence Upload Test
        console.log("Testing Meeting Upload...");
        // Create a dummy file
        fs.writeFileSync(dummyPath, 'This is a test meeting recording simulation content.');

        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fs.createReadStream(dummyPath));

        const upload = await fetch(`${API_BASE}/meetings/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: form
        }).then(r => r.json());

        let meetingId = '';
        if (upload.success) {
            meetingId = upload.data.id;
            console.log("Meeting Upload: Passed (ID:", meetingId, ")");
        } else {
            console.error("Meeting Upload: Failed", upload.error);
        }
        console.log("");

        // 4. AI Minutes Generation Test (AI FEATURE)
        if (meetingId) {
            console.log(`Testing AI Minutes Generation for Meeting: ${meetingId}...`);
            const minutes = await fetch(`${API_BASE}/minutes/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ meetingId })
            }).then(r => r.json());

            if (minutes.success) {
                console.log("AI Minutes Generation: Passed");
                console.log("MOM Agenda Count:", minutes.data.agenda.length);
                console.log("MOM Action Items:", minutes.data.actionItems.length);
            } else {
                console.error("AI Minutes Generation: Failed", minutes.error);
            }
        }
        console.log("");

        // 5. Data Validation Test
        console.log("Testing Data Validation Upload...");
        fs.writeFileSync(csvPath, "gtin,serial_number,lot_number,expiry_date\n00312345678901,SN-001,LOT-A,2027-01-01");

        const valForm = new FormData();
        valForm.append('file', fs.createReadStream(csvPath));

        const valUpload = await fetch(`${API_BASE}/validation/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: valForm
        }).then(r => r.json());

        if (valUpload.success) {
            console.log("Data Validation Upload: Passed");
            console.log("Pass Rate:", valUpload.summary.passRate, "%");
        } else {
            console.error("Data Validation Upload: Failed", valUpload.error);
        }
        console.log("");

        // 6. Admin Actions (Requires token and admin role)
        // Note: Our test user is not admin by default unless username starts with 'admin'
        // Let's try to delete the meeting as normal user (should fail or we can test with admin seeded account)
        console.log("Testing Restricted Admin Access (Should fail for normal user)...");
        const del = await fetch(`${API_BASE}/meetings/${meetingId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        console.log("Admin Delete (Normal User):", del.success ? "UNEXPECTED SUCCESS" : "Correctly Denied", del.error || "");

        // --- ADVERSARIAL & EDGE CASE TESTING ---
        console.log("🛠️ Starting Adversarial & Edge Case Tests...\n");

        // A1. Empty Meeting ID for Minutes
        console.log("Adversarial: Empty Meeting ID...");
        const emptyMtg = await fetch(`${API_BASE}/minutes/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ meetingId: "" })
        }).then(r => r.json());
        console.log("Empty ID Response:", emptyMtg.success ? "UNEXPECTED SUCCESS" : "Correctly Denied", emptyMtg.error || "");

        // A2. Non-existent Meeting ID
        console.log("Adversarial: Non-existent Meeting ID...");
        const fakeMtg = await fetch(`${API_BASE}/minutes/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ meetingId: "mtg-fake-id-123" })
        }).then(r => r.json());
        console.log("Fake ID Result:", fakeMtg.success ? "Passed (Returns Mock)" : "Error", fakeMtg.error || "");

        // A3. Huge File Upload (10MB limit test - simulation)
        console.log("Testing Large File Upload (10MB Simulation Content)...");
        const largeContent = 'A'.repeat(10 * 1024 * 1024); // 10MB
        fs.writeFileSync(largePath, largeContent);

        const largeForm = new FormData();
        largeForm.append('file', fs.createReadStream(largePath));
        const largeUpload = await fetch(`${API_BASE}/meetings/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: largeForm
        }).then(r => r.json());
        console.log("Large Upload Status:", largeUpload.success ? "Processed" : "Failed", largeUpload.error || "");
        if (largeUpload.success) console.log("Estimated Duration:", largeUpload.data.duration);

        // --- PERFORMANCE METRICS ---
        console.log("\n📊 Performance Metrics:");
        const start = Date.now();
        await fetch(`${API_BASE}/intelligence/insights`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        console.log("AI Intelligence Brain Latency:", Date.now() - start, "ms");

        console.log("\n✅ Comprehensive QA Complete.");

    } catch (err) {
        console.error("\n❌ Test Suite Crashed:", err);
    } finally {
        // Cleanup
        [dummyPath, csvPath, largePath].forEach(f => {
            if (fs.existsSync(f)) fs.unlinkSync(f);
        });
    }
}

runTests();
