import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiUsers } from 'react-icons/fi';
import { getMeeting, getMeetings } from '../api';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const speakerColors = ['speaker-0', 'speaker-1', 'speaker-2', 'speaker-3', 'speaker-4'];

export default function TranscriptViewer() {
    const { id } = useParams();
    const [meeting, setMeeting] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [search, setSearch] = useState('');
    const [speakerFilter, setSpeakerFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMeetings()
            .then(res => setMeetings(res.data.data))
            .catch(() => { });

        if (id) {
            setLoading(true);
            getMeeting(id)
                .then(res => setMeeting(res.data.data))
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const filteredLines = meeting?.lines?.filter(line => {
        const matchesSearch = !search || line.text.toLowerCase().includes(search.toLowerCase()) || line.speaker.toLowerCase().includes(search.toLowerCase());
        const matchesSpeaker = speakerFilter === 'all' || line.speaker === speakerFilter;
        return matchesSearch && matchesSpeaker;
    }) || [];

    const uniqueSpeakers = meeting ? [...new Set(meeting.lines.map(l => l.speaker))] : [];

    const highlightSearch = (text) => {
        if (!search) return text;
        const parts = text.split(new RegExp(`(${search})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === search.toLowerCase()
                ? <mark key={i} style={{ background: 'rgba(0, 194, 178, 0.3)', color: 'var(--text-primary)', padding: '0 2px', borderRadius: '3px' }}>{part}</mark>
                : part
        );
    };

    // Meeting list view
    if (!id) {
        return (
            <div className="container">
                <motion.section className="page-hero" initial="hidden" animate="visible">
                    <motion.h1 variants={fadeUp} custom={0}>Transcript Viewer</motion.h1>
                    <motion.p variants={fadeUp} custom={1} style={{ color: 'var(--text-secondary)', maxWidth: 680 }}>
                        Searchable, role-aware transcript intelligence optimized for pharmaceutical terminology and compliance context.
                    </motion.p>
                </motion.section>

                {meetings.length === 0 ? (
                    <div className="empty-state">
                        <FiUsers className="icon" />
                        <h3>No transcripts available</h3>
                        <p>Upload a meeting from the <Link to="/meetings">Meeting Intelligence</Link> page to view transcripts here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {meetings.map((mtg, i) => (
                            <motion.div key={mtg.id} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                                <Link to={`/transcripts/${mtg.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ marginBottom: '0.3rem', fontSize: '1.05rem' }}>{mtg.title}</h3>
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <span><FiClock style={{ marginRight: '0.25rem' }} /> {mtg.duration}</span>
                                                <span><FiUsers style={{ marginRight: '0.25rem' }} /> {mtg.speakers.length} speakers</span>
                                                <span>{new Date(mtg.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <span className="badge neutral">View Transcript →</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Single transcript view
    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="transcript-layout">
                {/* Sidebar */}
                <aside className="transcript-sidebar card">
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                        <Link to="/transcripts" className="btn small secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            ← All Archive
                        </Link>
                    </div>

                    <div className="sidebar-header">
                        <FiUsers style={{ color: 'var(--teal-glow)' }} />
                        <h3>Recent Meetings</h3>
                    </div>

                    <div className="sidebar-list">
                        {meetings.map(m => (
                            <Link
                                key={m.id}
                                to={`/transcripts/${m.id}`}
                                className={`sidebar-item ${m.id === id ? 'active' : ''}`}
                            >
                                <div className="indicator"></div>
                                <div className="content">
                                    <div className="title">{m.title}</div>
                                    <div className="meta">
                                        <span>{m.duration}</span>
                                        <span className="dot"></span>
                                        <span>{new Date(m.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                        <div className="card-mini">
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                TraceLink India HQ · Pune
                            </p>
                        </div>
                    </div>
                </aside>

                <main className="transcript-main">
                    {loading ? (
                        <div className="card" style={{ textAlign: 'center', padding: '5rem' }}>
                            <span className="loading-spinner" style={{ width: 40, height: 40 }}></span>
                            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>Analyzing meeting transcript...</p>
                        </div>
                    ) : meeting ? (
                        <motion.section initial="hidden" animate="visible">
                            <header className="meeting-header">
                                <div className="badge neutral" style={{ marginBottom: '0.5rem' }}>Meeting Analysis Mode</div>
                                <h1>{meeting.title}</h1>
                                <div className="meeting-meta">
                                    <div className="meta-item">
                                        <FiClock /> <span>{meeting.duration} duration</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiUsers /> <span>{meeting.speakers.join(', ')}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiCalendar /> <span>{new Date(meeting.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </header>

                            {/* Search + Filter */}
                            <div className="controls-row">
                                <div className="search-bar" style={{ margin: 0, flex: 1 }}>
                                    <FiSearch className="icon" />
                                    <input
                                        placeholder="Search across transcript..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="form-select"
                                    value={speakerFilter}
                                    onChange={e => setSpeakerFilter(e.target.value)}
                                    style={{ width: '200px' }}
                                >
                                    <option value="all">All Speakers</option>
                                    {uniqueSpeakers.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Transcript Content */}
                            <div className="card transcript-container">
                                {filteredLines.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No matches found in this meeting.</p>
                                    </div>
                                ) : (
                                    filteredLines.map((line, i) => {
                                        const speakerIndex = uniqueSpeakers.indexOf(line.speaker);
                                        const colorClass = `speaker-${speakerIndex % 5}`;
                                        return (
                                            <div key={i} className={`transcript-line ${colorClass}`}>
                                                <span className="time">{line.time}</span>
                                                <div className="speaker-block">
                                                    <span className="speaker-name">{line.speaker}</span>
                                                    {line.role && <span className="speaker-role">{line.role}</span>}
                                                </div>
                                                <span className="text">{highlightSearch(line.text)}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="actions-footer">
                                <Link to={`/minutes/${meeting.id}`} className="btn">
                                    <FiFileText /> Generate Executive Minutes
                                </Link>
                                <Link to="/meetings" className="btn secondary">
                                    New Meeting
                                </Link>
                            </div>
                        </motion.section>
                    ) : (
                        <div className="alert error">
                            <FiAlertTriangle /> Meeting record not found in the TraceLink database.
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .transcript-layout {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 2.5rem;
                    align-items: flex-start;
                    margin-bottom: 3rem;
                }
                
                .transcript-sidebar {
                    position: sticky;
                    top: 2rem;
                    height: calc(100vh - 120px);
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    background: rgba(8, 31, 26, 0.7);
                    overflow: hidden;
                }

                .sidebar-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.25rem;
                    padding-left: 0.5rem;
                }

                .sidebar-header h3 {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    margin: 0;
                }

                .sidebar-list {
                    flex: 1;
                    overflow-y: auto;
                    display: grid;
                    gap: 0.6rem;
                    padding-right: 0.5rem;
                }

                .sidebar-item {
                    display: flex;
                    gap: 0.75rem;
                    padding: 0.85rem 1rem;
                    border-radius: var(--radius-md);
                    background: rgba(255, 255, 255, 0.03);
                    text-decoration: none;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                    position: relative;
                }

                .sidebar-item:hover {
                    background: rgba(0, 194, 178, 0.08);
                    border-color: rgba(0, 194, 178, 0.2);
                    transform: translateX(4px);
                }

                .sidebar-item.active {
                    background: linear-gradient(90deg, rgba(0, 194, 178, 0.15), rgba(0, 194, 178, 0.05));
                    border-color: var(--teal-glow);
                }

                .sidebar-item .indicator {
                    width: 3px;
                    border-radius: 3px;
                    background: var(--teal-glow);
                    opacity: 0;
                    margin: 4px 0;
                    transition: opacity 0.2s;
                }

                .sidebar-item.active .indicator {
                    opacity: 1;
                }

                .sidebar-item .content {
                    flex: 1;
                }

                .sidebar-item .title {
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .sidebar-item .meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: var(--text-dim);
                }

                .sidebar-item .dot {
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: var(--text-dim);
                    opacity: 0.5;
                }

                .meeting-header {
                    margin-bottom: 2rem;
                }

                .meeting-header h1 {
                    font-size: 2.2rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.2;
                }

                .meeting-meta {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.92rem;
                    color: var(--text-muted);
                }

                .controls-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    align-items: center;
                }

                .transcript-container {
                    padding: 0.5rem;
                    max-height: 550px;
                    overflow-y: auto;
                    background: rgba(5, 23, 19, 0.4);
                }

                .transcript-line {
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid rgba(0, 194, 178, 0.05);
                }

                .transcript-line:last-child {
                    border-bottom: none;
                }

                .speaker-block {
                    min-width: 160px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                }

                .speaker-name {
                    font-size: 0.95rem;
                    font-weight: 700;
                }

                .speaker-role {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    opacity: 0.7;
                }

                .actions-footer {
                    margin-top: 2rem;
                    display: flex;
                    gap: 1rem;
                }

                .card-mini {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-subtle);
                    text-align: center;
                }

                @media (max-width: 1024px) {
                    .transcript-layout {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .transcript-sidebar {
                        position: relative;
                        top: 0;
                        height: 250px;
                    }
                }
            `}</style>
        </div>
    );
}
