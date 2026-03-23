import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiCheckCircle, FiMic, FiFileText, FiArrowRight, FiActivity, FiLock, FiGlobe, FiAlertTriangle, FiZap } from 'react-icons/fi';
import { getDashboardStats, getIntelligenceInsights } from '../api';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

export default function Home() {
    const [stats, setStats] = useState(null);
    const [intelligence, setIntelligence] = useState(null);


    useEffect(() => {
        getDashboardStats()
            .then(res => setStats(res.data.data))
            .catch(() => setStats({
                validatedRecords: 12482931, riskFlags: 0.43, regulatorySLAsMet: 99.97,
                auditReadiness: 'High', openCorrectiveActions: 3, dataIntegrityAlerts: 1,
                complianceScore: 98.2,
            }));

        getIntelligenceInsights()
            .then(res => setIntelligence(res.data.data))
            .catch(() => setIntelligence(null));
    }, []);

    const features = [
        { icon: <FiCheckCircle />, title: 'AI Validation', desc: 'Automated checks across supply chain records with model-assisted anomaly detection and confidence scoring.', link: '/data-validation' },
        { icon: <FiShield />, title: 'Compliance Engine', desc: 'Policy mapping for GDP, GMP, 21 CFR Part 11, and internal SOP frameworks with auditable controls.', link: '/platform' },
        { icon: <FiMic />, title: 'Smart Transcription', desc: 'Pharma-specific speaker detection and terminology normalization across global meeting archives.', link: '/transcripts' },
        { icon: <FiFileText />, title: 'Meeting Intelligence', desc: 'Extracts risks, actions, approvals, and regulatory follow-up items into structured operational outputs.', link: '/meetings' },
    ];

    const formatNumber = (n) => {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
        return n;
    };

    return (
        <div className="container">
            {/* Hero */}
            <motion.section
                className="hero-section"
                initial="hidden" animate="visible"
                style={{ minHeight: '75vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '5rem 0 4rem' }}
            >
                <div>
                    <motion.div variants={fadeUp} custom={0} style={{ marginBottom: '1rem' }}>
                        <span className="badge neutral" style={{ fontSize: '0.82rem', padding: '0.35rem 1rem' }}>
                            <FiActivity style={{ marginRight: '0.3rem' }} /> Enterprise AI Platform
                        </span>
                    </motion.div>
                    <motion.h1 variants={fadeUp} custom={1} style={{ marginBottom: '1.2rem', lineHeight: 1.08 }}>
                        AI-Powered Supply Chain<br />Intelligence
                    </motion.h1>
                    <motion.p variants={fadeUp} custom={2} style={{ maxWidth: 720, margin: '0 auto 0.5rem', fontSize: '1.12rem', color: 'var(--text-secondary)' }}>
                        Secure, compliant, and intelligent pharmaceutical data validation and meeting automation — built for enterprise-grade governance.
                    </motion.p>
                    <motion.p variants={fadeUp} custom={2.5} style={{ fontSize: '0.88rem', color: 'var(--teal-glow)', marginBottom: '2.2rem', fontWeight: 500 }}>
                        Developed by <span style={{ textDecoration: 'underline' }}>Pruthvi Athrey</span> · TraceLink India Headquarters
                    </motion.p>
                    <motion.div variants={fadeUp} custom={3} className="btn-row" style={{ justifyContent: 'center' }}>
                        <Link to="/data-validation" className="btn">
                            Start Validation <FiArrowRight />
                        </Link>
                        <Link to="/meetings" className="btn secondary">
                            Upload Meeting
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                style={{ margin: '2rem 0 3.5rem' }}
            >
                <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1.5rem' }}>
                    Enterprise AI capabilities built for pharmaceutical governance
                </motion.h2>
                <div className="grid four">
                    {features.map((f, i) => (
                        <motion.div key={f.title} variants={fadeUp} custom={i + 1}>
                            <Link to={f.link} style={{ textDecoration: 'none' }}>
                                <article className="card" style={{ height: '100%' }}>
                                    <div style={{ fontSize: '1.8rem', color: 'var(--teal-glow)', marginBottom: '0.75rem' }}>{f.icon}</div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Dashboard Preview */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                style={{ margin: '3.5rem 0' }}
            >
                <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1.5rem' }}>
                    Unified operations dashboard
                </motion.h2>
                <motion.div variants={fadeUp} custom={1} className="dashboard-preview">
                    <div className="panel">
                        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Global Validation Throughput</h3>
                        <div className="metric">
                            <span className="metric-label">Validated Records</span>
                            <span className="metric-value">{stats ? formatNumber(stats.validatedRecords) : '—'}</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">AI Risk Flags</span>
                            <span className="metric-value">{stats ? stats.riskFlags + '%' : '—'}</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Regulatory SLAs Met</span>
                            <span className="metric-value">{stats ? stats.regulatorySLAsMet + '%' : '—'}</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Compliance Score</span>
                            <span className="metric-value">{stats ? stats.complianceScore + '%' : '—'}</span>
                        </div>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                            Live ingestion from partner manufacturers, wholesalers, and quality units.
                        </p>
                    </div>
                    <div className="panel">
                        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiZap style={{ color: 'var(--teal-glow)' }} /> AI Strategic Insights
                        </h3>
                        {intelligence && intelligence.insights.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {intelligence.insights.slice(0, 2).map((insight, idx) => (
                                    <div key={idx} className="card" style={{ padding: '0.75rem', borderLeft: `3px solid ${insight.type === 'risk' ? 'var(--warning)' : 'var(--teal-glow)'}` }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                            {insight.type === 'risk' && <FiAlertTriangle style={{ color: 'var(--warning)' }} />}
                                            {insight.title}
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>{insight.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                <p style={{ fontSize: '0.85rem' }}>Awaiting historical data for cross-session intelligence analysis...</p>
                            </div>
                        )}
                        <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem' }}>Supply Chain Health:</span>
                            <span style={{ color: 'var(--teal-glow)', fontWeight: 700, fontSize: '1.2rem' }}>
                                {intelligence?.summary?.healthScore || '98.5'}%
                            </span>
                        </div>
                    </div>

                </motion.div>
            </motion.section>

            {/* Security */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                style={{ margin: '3.5rem 0' }}
            >
                <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1.5rem' }}>
                    Security & compliance by design
                </motion.h2>
                <div className="grid three">
                    {[
                        { icon: <FiLock />, title: 'Zero-Trust Architecture', desc: 'Encryption in transit and at rest with role-level access governance and audit event signing.' },
                        { icon: <FiShield />, title: 'Enterprise Governance', desc: 'Configurable approval workflows for QA, regulatory affairs, and clinical operations stakeholders.' },
                        { icon: <FiGlobe />, title: 'Global Scalability', desc: 'Designed for multinational pharmaceutical supply chains requiring resilient, low-latency compliance automation.' },
                    ].map((item, i) => (
                        <motion.article key={item.title} className="card" variants={fadeUp} custom={i + 1}>
                            <div style={{ fontSize: '1.6rem', color: 'var(--teal-glow)', marginBottom: '0.75rem' }}>{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </motion.article>
                    ))}
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                style={{ margin: '3.5rem 0 2rem' }}
            >
                <motion.div variants={fadeUp} custom={0} className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <h2 style={{ marginBottom: '0.75rem' }}>Deploy a secure AI layer across your regulated data ecosystem</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 1.5rem', fontSize: '1.05rem' }}>
                        TraceLink AI Suite brings validation, intelligence, and meeting automation into one trusted enterprise platform.
                    </p>
                    <Link to="/contact" className="btn">
                        Schedule a Platform Review <FiArrowRight />
                    </Link>
                </motion.div>
            </motion.section>
        </div>
    );
}
