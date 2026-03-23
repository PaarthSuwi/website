import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLock, FiUser, FiArrowRight, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to the page they were trying to access, or home
    const from = location.state?.from?.pathname || "/";

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await login(username, password);
            if (res.success) {
                navigate(from, { replace: true });
            } else {
                setError(res.error || "Invalid credentials");
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
                style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="auth-icon-wrapper">
                        <FiShield />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Developer Login</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Authorized Personnel Only · TraceLink India</p>
                </div>

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
                                placeholder="Admin or Member ID"
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
                                placeholder="Enter secure key"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
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
                        {loading ? <span className="loading-spinner"></span> : <>Secure Access <FiArrowRight /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--teal-glow)', fontWeight: 600 }}>Create One</Link>
                </div>
            </motion.div>

            <style>{`
                .auth-card {
                    background: rgba(9, 34, 29, 0.7);
                    border: 1px solid var(--border-glow);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }
                .auth-icon-wrapper {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(0, 194, 178, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    font-size: 1.8rem;
                    color: var(--teal-glow);
                    border: 1px solid var(--border-glow);
                }
            `}</style>
        </div>
    );
};

export default Login;
