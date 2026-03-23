import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/data-validation', label: 'Data Validation' },
    { to: '/meetings', label: 'Meeting Intelligence' },
    { to: '/transcripts', label: 'Transcript Viewer' },
    { to: '/minutes', label: 'AI Minutes' },
    { to: '/platform', label: 'Platform' },
    { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { token, logout, isAdmin, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setOpen(false);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                tracelink <span>ai suite</span>
            </Link>
            <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
                {open ? <HiX /> : <HiMenu />}
            </button>
            <div className={`nav-links ${open ? 'open' : ''}`}>
                {navItems.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={() => setOpen(false)}
                    >
                        {label}
                    </NavLink>
                ))}

                {isAdmin && (
                    <NavLink to="/admin" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
                        <FiShield /> Moderation
                    </NavLink>
                )}

                {token ? (
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut /> Logout
                    </button>
                ) : (
                    <NavLink to="/login" className="login-btn" onClick={() => setOpen(false)}>
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
}
