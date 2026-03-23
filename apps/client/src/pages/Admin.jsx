import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiDatabase, FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const { user, isAdmin, token } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wiping, setWiping] = useState(false);
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:5000/api`;

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchMeetings();
    }, [isAdmin]);

    const fetchMeetings = async () => {
        try {
            const res = await fetch(`${API_BASE}/meetings`);
            const data = await res.json();
            if (data.success) {
                setMeetings(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch meetings for admin", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteMeeting = async (id) => {
        if (!window.confirm("Are you sure you want to delete this meeting? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_BASE}/meetings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setMeetings(prev => prev.filter(m => m.id !== id));
            }
        } catch (err) {
            alert("Delete failed");
        }
    };

    const wipeDatabase = async () => {
        const confirm1 = window.confirm("CRITICAL ACTION: You are about to wipe the entire meeting database. Proceed?");
        if (!confirm1) return;
        const confirm2 = window.confirm("FINAL WARNING: All transcripts, minutes, and analysis will be permanently deleted. Are you absolutely sure?");
        if (!confirm2) return;

        setWiping(true);
        try {
            const res = await fetch(`${API_BASE}/meetings/wipe`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setMeetings([]);
                alert("Database wiped successfully.");
            }
        } catch (err) {
            alert("Wipe failed");
        } finally {
            setWiping(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="container" style={{ paddingTop: '3rem' }}>
            <div className="section-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Admin Moderation</h1>
                        <p>Manage TraceLink India database records and platform health.</p>
                    </div>
                    <div className="badge neutral">Admin Access: {user.username}</div>
                </div>
            </div>

            <div className="grid two" style={{ marginBottom: '3rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <FiDatabase style={{ fontSize: '2rem', color: 'var(--teal-glow)' }} />
                        <div>
                            <h3 style={{ margin: 0 }}>System Health</h3>
                            <p style={{ fontSize: '0.85rem' }}>Monitor database integrity</p>
                        </div>
                    </div>
                    <div className="metric">
                        <span className="metric-label">Total Meetings Recorded</span>
                        <span className="metric-value">{meetings.length}</span>
                    </div>
                    <div className="metric">
                        <span className="metric-label">Database Status</span>
                        <span className="badge success">Healthy</span>
                    </div>
                    <button
                        className="btn danger small"
                        style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
                        onClick={wipeDatabase}
                        disabled={wiping}
                    >
                        {wiping ? 'Wiping Engine...' : <><FiTrash2 /> Wipe All Meeting Data</>}
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1rem', textAlign: 'center' }}>
                        <FiAlertCircle /> Caution: Wiping records is permanent.
                    </p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <FiRefreshCw style={{ fontSize: '2rem', color: 'var(--cyan-accent)' }} />
                        <div>
                            <h3 style={{ margin: 0 }}>Admin Logs</h3>
                            <p style={{ fontSize: '0.85rem' }}>Recent moderation activity</p>
                        </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                        <p>Currently displaying all persistent meeting records from the SQLite storage engine.</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>Persistent Meetings</h2>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Meeting Title</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                                        No meeting records found.
                                    </td>
                                </tr>
                            ) : (
                                meetings.map(m => (
                                    <tr key={m.id}>
                                        <td style={{ fontWeight: 600 }}>{m.title}</td>
                                        <td>{new Date(m.date).toLocaleDateString()}</td>
                                        <td>{m.duration}</td>
                                        <td><span className="badge success">{m.status}</span></td>
                                        <td>
                                            <button
                                                className="btn danger small"
                                                onClick={() => deleteMeeting(m.id)}
                                                title="Delete this record"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
