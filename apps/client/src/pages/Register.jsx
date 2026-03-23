import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await register(username, password);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(res.error || "Registration failed");
            }
        } catch (err) {
            setError("Connection to TraceLink Auth server failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                className="card auth-card"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>TraceLink India Enterprise Suite</p>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <FiCheckCircle style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }} />
                        <h3>Registration Successful!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert error" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Username</label>
                            <div className="search-bar" style={{ margin: 0, paddingLeft: '0.75rem' }}>
                                <FiUser className="icon" />
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="search-bar" style={{ margin: 0, paddingLeft: '0.75rem' }}>
                                <FiLock className="icon" />
                                <input
                                    type="password"
                                    placeholder="Create password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="search-bar" style={{ margin: 0, paddingLeft: '0.75rem' }}>
                                <FiLock className="icon" />
                                <input
                                    type="password"
                                    placeholder="Repeat password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                            disabled={loading}
                        >
                            {loading ? <span className="loading-spinner"></span> : <>Create Account <FiArrowRight /></>}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--teal-glow)', fontWeight: 600 }}>Sign In</Link>
                </div>
            </motion.div>

            <style>{`
                .auth-card {
                    background: rgba(9, 34, 29, 0.7);
                    border: 1px solid var(--border-glow);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
};

export default Register;
