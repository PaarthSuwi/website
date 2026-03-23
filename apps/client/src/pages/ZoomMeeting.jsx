import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiUsers, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';
import FileUpload from '../components/FileUpload';
import { uploadMeeting, getMeetings } from '../api';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function ZoomMeeting() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getMeetings()
            .then(res => setMeetings(res.data.data))
            .catch(() => { });
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        // 1GB Client-Side Check
        if (file.size > 1024 * 1024 * 1024) {
            setError(`File too large (${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB). Enterprise limit is 1GB.`);
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await uploadMeeting(file);
            setResult(res.data.data);
            // Refresh meeting list
            const listRes = await getMeetings();
            setMeetings(listRes.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <motion.section className="page-hero" initial="hidden" animate="visible">
                <motion.h1 variants={fadeUp} custom={0}>Zoom Meeting Intelligence</motion.h1>
                <motion.p variants={fadeUp} custom={1} style={{ color: 'var(--text-secondary)', maxWidth: 680 }}>
                    Convert Indian pharmaceutical meeting recordings into structured compliance action. Developed by **Pruthvi Athrey**.
                </motion.p>
            </motion.section>

            {/* Upload */}
            <motion.section initial="hidden" animate="visible" style={{ marginBottom: '2rem' }}>
                <motion.div variants={fadeUp} custom={2}>
                    <FileUpload
                        onFileSelect={setFile}
                        accept=".mp3,.mp4,.wav,.m4a,.webm,.txt,.vtt,.srt"
                        label="Drop meeting files here"
                        description="Professional Enterprise Mode: Supports up to 1.0GB (MP4, MP3, WAV, etc.)"
                    />
                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn" onClick={handleUpload} disabled={!file || loading}>
                            {loading ? (
                                <><span className="loading-spinner"></span> Processing...</>
                            ) : (
                                <><FiUploadCloud /> Process Meeting</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.section>

            {/* Processing Animation */}
            {loading && (
                <div className="processing-indicator">
                    <span className="dot"></span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        AI processing in progress · speaker mapping · regulatory entity extraction
                    </span>
                </div>
            )}

            {error && (
                <div className="alert error" style={{ marginTop: '1rem' }}>
                    <FiAlertTriangle /> {error}
                </div>
            )}

            {/* Upload Result */}
            {result && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '2rem' }}
                >
                    <h2 style={{ marginBottom: '1rem' }}>Processing Complete</h2>
                    <div className="grid three">
                        {/* Transcript Preview */}
                        <div className="card">
                            <h3><FiUsers style={{ marginRight: '0.5rem' }} /> Speakers Detected</h3>
                            <div style={{ marginTop: '0.75rem' }}>
                                {result.speakers?.map((s, i) => (
                                    <div key={i} style={{ padding: '0.4rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        • {s}
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <Link to={`/transcripts/${result.id}`} className="btn small">View Full Transcript</Link>
                            </div>
                        </div>

                        {/* Decisions & Actions */}
                        <div className="card">
                            <h3><FiCheckCircle style={{ marginRight: '0.5rem' }} /> Decisions & Actions</h3>
                            <div style={{ marginTop: '0.75rem' }}>
                                <strong style={{ fontSize: '0.85rem', color: 'var(--teal-glow)' }}>Decisions:</strong>
                                {result.extractedEntities?.decisions?.map((d, i) => (
                                    <p key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>• {d}</p>
                                ))}
                                <strong style={{ fontSize: '0.85rem', color: 'var(--teal-glow)', display: 'block', marginTop: '0.75rem' }}>Actions:</strong>
                                {result.extractedEntities?.actions?.map((a, i) => (
                                    <p key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                                        • {a.action} <span style={{ color: 'var(--text-dim)' }}>→ {a.owner}</span>
                                    </p>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <Link to={`/minutes/${result.id}`} className="btn small secondary">Generate Minutes</Link>
                            </div>
                        </div>

                        {/* Risks */}
                        <div className="card">
                            <h3><FiAlertTriangle style={{ marginRight: '0.5rem', color: 'var(--warning)' }} /> Risk Alerts</h3>
                            <div style={{ marginTop: '0.75rem' }}>
                                {result.extractedEntities?.risks?.map((r, i) => (
                                    <div key={i} style={{
                                        padding: '0.65rem', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.88rem',
                                        background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)',
                                        color: 'var(--text-secondary)',
                                    }}>
                                        {r}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Meeting History */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ marginTop: '3rem' }}
            >
                <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1rem' }}>Meeting Archive</motion.h2>
                {meetings.length === 0 ? (
                    <div className="empty-state">
                        <FiClock className="icon" />
                        <p>No meetings processed yet. Upload a meeting to get started.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {meetings.map((mtg, i) => (
                            <motion.div key={mtg.id} variants={fadeUp} custom={i + 1} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>{mtg.title}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <span><FiClock style={{ marginRight: '0.3rem' }} /> {mtg.duration}</span>
                                        <span><FiUsers style={{ marginRight: '0.3rem' }} /> {mtg.speakers.length} speakers</span>
                                        <span>{new Date(mtg.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/transcripts/${mtg.id}`} className="btn small secondary">Transcript</Link>
                                    <Link to={`/minutes/${mtg.id}`} className="btn small">Minutes</Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>
        </div>
    );
}
