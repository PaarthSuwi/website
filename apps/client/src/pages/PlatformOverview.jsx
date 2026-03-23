import { motion } from 'framer-motion';
import { FiDatabase, FiCpu, FiSettings, FiLayers, FiLink, FiZap, FiShield, FiBarChart2 } from 'react-icons/fi';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function PlatformOverview() {
    const layers = [
        {
            icon: <FiDatabase />,
            title: 'Data Layer',
            desc: 'Ingests ERP, serialization, quality, and partner exchange data into a normalized compliance graph.',
            features: ['Multi-source ingestion', 'Real-time normalization', 'Graph-based compliance model', 'Partner data exchange'],
        },
        {
            icon: <FiCpu />,
            title: 'AI Layer',
            desc: 'Domain-tuned models classify risks, summarize evidence, and suggest corrective action pathways.',
            features: ['Anomaly detection', 'Risk classification', 'NLP entity extraction', 'Confidence scoring'],
        },
        {
            icon: <FiSettings />,
            title: 'Control Layer',
            desc: 'Policy enforcement, approval routing, and audit logs ensure inspection-grade operational confidence.',
            features: ['Policy engine', 'Approval workflows', 'Immutable audit trail', 'Role-based access'],
        },
    ];

    const capabilities = [
        { icon: <FiLayers />, title: 'Multi-Tenancy', desc: 'Isolated environments for each business unit with shared governance policies.' },
        { icon: <FiLink />, title: 'API-First', desc: 'RESTful APIs for seamless integration with ERP, LIMS, and quality management systems.' },
        { icon: <FiZap />, title: 'Real-Time Processing', desc: 'Sub-second validation and alerting for critical supply chain events.' },
        { icon: <FiShield />, title: '21 CFR Part 11', desc: 'Full electronic record and signature compliance with audit trail capabilities.' },
        { icon: <FiBarChart2 />, title: 'Advanced Analytics', desc: 'Predictive risk scoring and trend analysis across global operations.' },
        { icon: <FiCpu />, title: 'Edge Computing', desc: 'Distributed processing nodes for low-latency operations at manufacturing sites.' },
    ];

    return (
        <div className="container">
            <motion.section className="page-hero" initial="hidden" animate="visible">
                <motion.h1 variants={fadeUp} custom={0}>Platform Overview</motion.h1>
                <motion.p variants={fadeUp} custom={1} style={{ color: 'var(--text-secondary)', maxWidth: 680 }}>
                    A unified AI compliance fabric for supply chain data validation, meeting automation, and enterprise governance.
                </motion.p>
            </motion.section>

            {/* Architecture Layers */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ margin: '1.5rem 0 3rem' }}>
                <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1.5rem' }}>Architecture</motion.h2>
                <div className="grid three">
                    {layers.map((layer, i) => (
                        <motion.article key={layer.title} className="card" variants={fadeUp} custom={i + 1}>
                            <div style={{ fontSize: '2rem', color: 'var(--teal-glow)', marginBottom: '0.75rem' }}>{layer.icon}</div>
                            <h3>{layer.title}</h3>
                            <p style={{ marginBottom: '1rem' }}>{layer.desc}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {layer.features.map(f => (
                                    <div key={f} style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '8px',
                                        background: 'rgba(0, 194, 178, 0.06)',
                                        border: '1px solid rgba(0, 194, 178, 0.12)',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-secondary)',
                                    }}>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </motion.article>
                    ))}
                </div>
            </motion.section>

            {/* Data Flow */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ margin: '3rem 0' }}>
                <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1.5rem' }}>Data Flow</motion.h2>
                <motion.div variants={fadeUp} custom={1} className="card" style={{ padding: '2rem' }}>
                    <div style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        gap: '0', flexWrap: 'wrap', textAlign: 'center',
                    }}>
                        {[
                            { label: 'Ingest', sub: 'ERP · Serialization · Quality', color: 'var(--teal)' },
                            { label: '→', sub: '', color: 'var(--text-dim)' },
                            { label: 'Normalize', sub: 'Compliance Graph', color: 'var(--teal-glow)' },
                            { label: '→', sub: '', color: 'var(--text-dim)' },
                            { label: 'Analyze', sub: 'AI Risk Models', color: 'var(--cyan-accent)' },
                            { label: '→', sub: '', color: 'var(--text-dim)' },
                            { label: 'Act', sub: 'Alerts · Approvals · Audit', color: 'var(--pear)' },
                        ].map((step, i) => (
                            <div key={i} style={{ padding: step.sub ? '1rem 1.5rem' : '0 0.5rem' }}>
                                <div style={{ fontSize: step.sub ? '1.2rem' : '1.5rem', fontWeight: 700, color: step.color }}>{step.label}</div>
                                {step.sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{step.sub}</div>}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* Capabilities */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ margin: '3rem 0' }}>
                <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1.5rem' }}>Enterprise Capabilities</motion.h2>
                <div className="grid three">
                    {capabilities.map((cap, i) => (
                        <motion.article key={cap.title} className="card" variants={fadeUp} custom={i + 1}>
                            <div style={{ fontSize: '1.4rem', color: 'var(--teal-glow)', marginBottom: '0.5rem' }}>{cap.icon}</div>
                            <h3 style={{ fontSize: '1.05rem' }}>{cap.title}</h3>
                            <p style={{ fontSize: '0.9rem' }}>{cap.desc}</p>
                        </motion.article>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
