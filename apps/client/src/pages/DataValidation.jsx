import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCheckCircle, FiXCircle, FiAlertTriangle, FiList } from 'react-icons/fi';
import FileUpload from '../components/FileUpload';
import { uploadValidation, downloadSampleCSV } from '../api';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function DataValidation() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    const handleValidate = async () => {
        if (!file) return;

        // 1GB Client-Side Check
        if (file.size > 1024 * 1024 * 1024) {
            setError(`File too large (${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB). Max volume limit is 1GB.`);
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await uploadValidation(file);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Validation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const statusIcon = (status) => {
        if (status === 'pass') return <FiCheckCircle style={{ color: 'var(--success)' }} />;
        if (status === 'fail') return <FiXCircle style={{ color: 'var(--error)' }} />;
        return <FiAlertTriangle style={{ color: 'var(--warning)' }} />;
    };

    return (
        <div className="container">
            <motion.section className="page-hero" initial="hidden" animate="visible">
                <motion.h1 variants={fadeUp} custom={0}>Data Validation</motion.h1>
                <motion.p variants={fadeUp} custom={1} style={{ color: 'var(--text-secondary)', maxWidth: 680 }}>
                    Automate high-volume pharmaceutical supply chain record validation with explainable AI and compliance-ready traceability.
                </motion.p>
            </motion.section>

            {/* Info Cards */}
            <motion.div className="grid three" initial="hidden" animate="visible" style={{ marginBottom: '2rem' }}>
                {[
                    { title: 'Source Integrity', desc: 'Validate serialization events, lot lineage, and transaction documents against master data and policy constraints.' },
                    { title: 'Exception Intelligence', desc: 'Machine-learned patterns prioritize potential GDP/GMP non-conformance for rapid quality intervention.' },
                    { title: 'Audit Evidence', desc: 'Every AI decision logs rationale, model confidence, and reviewer activity for regulated accountability.' },
                ].map((card, i) => (
                    <motion.article key={card.title} className="card" variants={fadeUp} custom={i + 2}>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                    </motion.article>
                ))}
            </motion.div>

            {/* Upload */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={0}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h2>Upload Validation File</h2>
                        <a href={downloadSampleCSV()} className="btn small secondary" download>
                            <FiDownload /> Download Sample CSV
                        </a>
                    </div>

                    <FileUpload
                        onFileSelect={setFile}
                        accept=".csv,.xlsx,.xls"
                        label="Drop your CSV or Excel file here"
                        description="High-Volume Mode Enabled: Supports up to 1GB (CSV, XLSX, XLS)"
                    />

                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn" onClick={handleValidate} disabled={!file || loading}>
                            {loading ? (
                                <><span className="loading-spinner"></span> Validating...</>
                            ) : (
                                <><FiCheckCircle /> Run Validation</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.section>

            {/* Error */}
            {error && (
                <div className="alert error" style={{ marginTop: '1.5rem' }}>
                    <FiXCircle /> {error}
                </div>
            )}

            {/* Results */}
            {result && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '2rem' }}
                >
                    {/* Summary */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>
                            <FiList style={{ marginRight: '0.5rem' }} /> Validation Summary
                        </h3>
                        <div className="grid four" style={{ gap: '1rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div className="metric-value">{result.summary.totalRows}</div>
                                <div className="metric-label">Total Rows</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div className="metric-value" style={{ background: 'linear-gradient(90deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {result.summary.passCount}
                                </div>
                                <div className="metric-label">Passed</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div className="metric-value" style={{ background: 'linear-gradient(90deg, #ef4444, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {result.summary.failCount}
                                </div>
                                <div className="metric-label">Failed</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div className="metric-value" style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {result.summary.warningCount}
                                </div>
                                <div className="metric-label">Warnings</div>
                            </div>
                        </div>
                        <div className="progress-bar-container" style={{ marginTop: '1.25rem' }}>
                            <div className="progress-bar-fill" style={{ width: result.summary.passRate + '%' }}></div>
                        </div>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
                            {result.summary.passRate}% pass rate · {result.summary.rulesApplied} rules applied · {result.summary.fieldsDetected.length} fields detected
                        </p>
                    </div>

                    {/* Results Table */}
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Row</th>
                                    <th>Status</th>
                                    <th>Severity</th>
                                    <th>Checks</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.results.map((row) => (
                                    <>
                                        <tr key={row.row} onClick={() => setExpandedRow(expandedRow === row.row ? null : row.row)} style={{ cursor: 'pointer' }}>
                                            <td style={{ fontWeight: 600 }}>#{row.row}</td>
                                            <td>{statusIcon(row.status)} <span className={`badge ${row.status}`}>{row.status}</span></td>
                                            <td><span className={`badge ${row.severity === 'critical' ? 'error' : row.severity === 'medium' ? 'warning' : 'success'}`}>{row.severity}</span></td>
                                            <td>{row.checks.filter(c => c.status === 'pass').length}/{row.checks.length} passed</td>
                                            <td style={{ color: 'var(--teal-glow)', fontSize: '0.85rem' }}>
                                                {expandedRow === row.row ? '▲ Collapse' : '▼ Expand'}
                                            </td>
                                        </tr>
                                        {expandedRow === row.row && (
                                            <tr key={`${row.row}-detail`}>
                                                <td colSpan="5" style={{ padding: '0.5rem 1rem 1rem', background: 'rgba(14, 95, 75, 0.08)' }}>
                                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                        {row.checks.map((check, ci) => (
                                                            <div key={ci} style={{
                                                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                                padding: '0.5rem 0.75rem', borderRadius: '8px',
                                                                background: check.status === 'fail' ? 'rgba(239, 68, 68, 0.06)' : check.status === 'warning' ? 'rgba(245, 158, 11, 0.06)' : 'transparent',
                                                            }}>
                                                                {statusIcon(check.status)}
                                                                <span style={{ fontWeight: 600, minWidth: 130, fontSize: '0.88rem' }}>{check.ruleName}</span>
                                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1 }}>{check.message}</span>
                                                                <span className="badge neutral" style={{ fontSize: '0.75rem' }}>conf: {check.confidence}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            )}
        </div>
    );
}
