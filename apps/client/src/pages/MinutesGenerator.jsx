import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiCalendar, FiUser, FiFlag, FiShield, FiDownload } from 'react-icons/fi';
import { generateMinutes, getMinutes, getMeetings } from '../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const priorityColors = {
    Critical: 'error', High: 'warning', Medium: 'info', Low: 'neutral',
};

export default function MinutesGenerator() {
    const { id } = useParams();
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(id || '');
    const [minutes, setMinutes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getMeetings()
            .then(res => setMeetings(res.data.data))
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (id) {
            setSelectedMeeting(id);
            handleGenerate(id);
        }
    }, [id]);

    const handleGenerate = async (meetingId) => {
        const target = meetingId || selectedMeeting;
        if (!target) return;
        setLoading(true);
        setError('');

        try {
            const res = await generateMinutes(target);
            setMinutes(res.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate minutes.');
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async () => {
        const element = document.getElementById('minutes-report');
        if (!element) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(element, { scale: 2, background: '#0a1916' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${minutes.title.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('PDF Export Error:', err);
        } finally {
            setExporting(false);
        }
    };

    const exportToDocx = () => {
        if (!minutes) return;
        setExporting(true);

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ text: minutes.title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: `Generated: ${new Date(minutes.generatedAt).toLocaleString()}`, alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "\n" }),

                    new Paragraph({ text: "Attendees", heading: HeadingLevel.HEADING_2 }),
                    ...minutes.attendees.map(a => new Paragraph({ text: `• ${a}`, bullet: { level: 0 } })),
                    new Paragraph({ text: "\n" }),

                    new Paragraph({ text: "Agenda", heading: HeadingLevel.HEADING_2 }),
                    ...minutes.agenda.map((a, i) => new Paragraph({ text: `${i + 1}. ${a}` })),
                    new Paragraph({ text: "\n" }),

                    new Paragraph({ text: "Decisions", heading: HeadingLevel.HEADING_2 }),
                    ...minutes.decisions.map(d => new Paragraph({ text: `[✓] ${d}` })),
                    new Paragraph({ text: "\n" }),

                    new Paragraph({ text: "Action Items", heading: HeadingLevel.HEADING_2 }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: ["Action", "Owner", "Deadline", "Priority"].map(h => new TableCell({ children: [new Paragraph({ text: h, bold: true })] }))
                            }),
                            ...minutes.actionItems.map(item => new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(item.action)] }),
                                    new TableCell({ children: [new Paragraph(item.owner)] }),
                                    new TableCell({ children: [new Paragraph(new Date(item.deadline).toLocaleDateString())] }),
                                    new TableCell({ children: [new Paragraph(item.priority)] }),
                                ]
                            }))
                        ]
                    }),
                    new Paragraph({ text: "\n" }),

                    new Paragraph({ text: "TraceLink Pune Operations · Compliance Guaranteed", alignment: AlignmentType.CENTER, style: { color: "#00c2b2" } }),
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `${minutes.title.replace(/\s+/g, '_')}.docx`);
            setExporting(false);
        });
    };

    // List view
    if (!minutes && !loading && !id) {
        return (
            <div className="container">
                <motion.section className="page-hero" initial="hidden" animate="visible">
                    <motion.h1 variants={fadeUp} custom={0}>AI Minutes Generator</motion.h1>
                    <motion.p variants={fadeUp} custom={1} style={{ color: 'var(--text-secondary)', maxWidth: 680 }}>
                        Generate regulator-ready minutes from cross-functional meetings with clear accountability and decision trails.
                    </motion.p>
                </motion.section>

                {/* Feature Cards */}
                <motion.div className="grid three" initial="hidden" animate="visible" style={{ marginBottom: '2.5rem' }}>
                    {[
                        { icon: <FiFileText />, title: 'Structured Summary', desc: 'Captures agenda, decisions, blockers, and compliance implications.' },
                        { icon: <FiCheckCircle />, title: 'Action Registry', desc: 'Assigns owners, deadlines, and quality impact level per action item.' },
                        { icon: <FiShield />, title: 'Approval Workflow', desc: 'Routes generated minutes to required stakeholders for e-signature and archival.' },
                    ].map((card, i) => (
                        <motion.article key={card.title} className="card" variants={fadeUp} custom={i + 2}>
                            <div style={{ fontSize: '1.6rem', color: 'var(--teal-glow)', marginBottom: '0.5rem' }}>{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </motion.article>
                    ))}
                </motion.div>

                {/* Select Meeting */}
                <motion.section initial="hidden" animate="visible">
                    <motion.h2 variants={fadeUp} custom={0} style={{ marginBottom: '1rem' }}>Select a Meeting</motion.h2>
                    {meetings.length === 0 ? (
                        <div className="empty-state">
                            <FiFileText className="icon" />
                            <p>No meetings available. Upload from the <Link to="/meetings">Meeting Intelligence</Link> page first.</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <select
                                    className="form-select"
                                    value={selectedMeeting}
                                    onChange={e => setSelectedMeeting(e.target.value)}
                                >
                                    <option value="">Choose a meeting...</option>
                                    {meetings.map(m => (
                                        <option key={m.id} value={m.id}>{m.title} — {new Date(m.date).toLocaleDateString()}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn" onClick={() => handleGenerate()} disabled={!selectedMeeting || loading}>
                                {loading ? <><span className="loading-spinner"></span> Generating...</> : <><FiFileText /> Generate Minutes</>}
                            </button>
                        </>
                    )}
                </motion.section>

                {error && <div className="alert error" style={{ marginTop: '1rem' }}><FiAlertTriangle /> {error}</div>}
            </div>
        );
    }

    // Minutes display
    return (
        <div className="container">
            <motion.section className="page-hero" initial="hidden" animate="visible">
                <motion.div variants={fadeUp} custom={0} style={{ marginBottom: '0.5rem' }}>
                    <Link to="/minutes" style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>← All Minutes</Link>
                </motion.div>
                <motion.h1 variants={fadeUp} custom={1}>{minutes?.title || 'Generating...'}</motion.h1>
            </motion.section>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <span className="loading-spinner" style={{ width: 32, height: 32 }}></span>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Generating structured minutes...</p>
                </div>
            ) : minutes ? (
                <motion.div initial="hidden" animate="visible">
                    <div id="minutes-report">
                        {/* Attendees & Agenda */}
                        <div className="grid two" style={{ marginBottom: '1.5rem' }}>
                            <motion.div variants={fadeUp} custom={0} className="card">
                                <h3><FiUser style={{ marginRight: '0.5rem' }} /> Attendees</h3>
                                {minutes.attendees.map((a, i) => (
                                    <p key={i} style={{ padding: '0.3rem 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>• {a}</p>
                                ))}
                            </motion.div>
                            <motion.div variants={fadeUp} custom={1} className="card">
                                <h3><FiCalendar style={{ marginRight: '0.5rem' }} /> Agenda</h3>
                                {minutes.agenda.map((a, i) => (
                                    <p key={i} style={{ padding: '0.3rem 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{i + 1}. {a}</p>
                                ))}
                            </motion.div>
                        </div>

                        {/* Decisions */}
                        <motion.div variants={fadeUp} custom={2} className="card" style={{ marginBottom: '1.5rem' }}>
                            <h3><FiCheckCircle style={{ marginRight: '0.5rem', color: 'var(--success)' }} /> Decisions</h3>
                            {minutes.decisions.map((d, i) => (
                                <div key={i} style={{ padding: '0.5rem 0.75rem', marginTop: '0.5rem', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.15)', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                                    {d}
                                </div>
                            ))}
                        </motion.div>

                        {/* Action Items */}
                        <motion.div variants={fadeUp} custom={3} className="card" style={{ marginBottom: '1.5rem' }}>
                            <h3><FiFlag style={{ marginRight: '0.5rem', color: 'var(--teal-glow)' }} /> Action Items</h3>
                            <div className="table-wrapper" style={{ marginTop: '0.75rem' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>Owner</th>
                                            <th>Deadline</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {minutes.actionItems.map((item, i) => (
                                            <tr key={i}>
                                                <td style={{ maxWidth: 320 }}>{item.action}</td>
                                                <td style={{ fontWeight: 500 }}>{item.owner}</td>
                                                <td>{new Date(item.deadline).toLocaleDateString()}</td>
                                                <td><span className={`badge ${priorityColors[item.priority] || 'neutral'}`}>{item.priority}</span></td>
                                                <td><span className={`badge ${item.status === 'In Progress' ? 'info' : 'neutral'}`}>{item.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Risks */}
                        <motion.div variants={fadeUp} custom={4} className="card" style={{ marginBottom: '1.5rem' }}>
                            <h3><FiAlertTriangle style={{ marginRight: '0.5rem', color: 'var(--warning)' }} /> Risk Assessment</h3>
                            {minutes.risks.map((r, i) => (
                                <div key={i} style={{ padding: '0.75rem', marginTop: '0.75rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{r.risk}</strong>
                                        <span className={`badge ${r.severity === 'High' ? 'error' : r.severity === 'Medium' ? 'warning' : 'info'}`}>{r.severity}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><strong>Mitigation:</strong> {r.mitigation}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Compliance Notes */}
                        <motion.div variants={fadeUp} custom={5} className="card" style={{ marginBottom: '1.5rem' }}>
                            <h3><FiShield style={{ marginRight: '0.5rem', color: 'var(--teal-glow)' }} /> Compliance Notes</h3>
                            {minutes.complianceNotes.map((note, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.4rem 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                                    <FiCheckCircle style={{ color: 'var(--success)', marginTop: '0.2rem', flexShrink: 0 }} />
                                    <span>{note}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <button className="btn" onClick={exportToPDF} disabled={exporting}>
                            {exporting ? 'Exporting...' : <><FiDownload /> Export PDF</>}
                        </button>
                        <button className="btn secondary" onClick={exportToDocx} disabled={exporting}>
                            {exporting ? 'Exporting...' : <><FiFileText /> Export DOCX</>}
                        </button>
                        <Link to={`/transcripts/${minutes.meetingId}`} className="btn secondary">View Transcript</Link>
                    </div>

                    <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '2rem' }}>
                        Generated at {new Date(minutes.generatedAt).toLocaleString()} · Optimized for TraceLink Pune & Mumbai Operations
                    </p>
                </motion.div>
            ) : error ? (
                <div className="alert error"><FiAlertTriangle /> {error}</div>
            ) : null}
        </div>
    );
}
