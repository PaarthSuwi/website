import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('tracelink_token'));
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:5000/api`;

    useEffect(() => {
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const verifyToken = async (t) => {
        try {
            const res = await fetch(`${API_BASE}/auth/me`, {
                headers: { 'Authorization': `Bearer ${t}` }
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            } else {
                logout();
            }
        } catch (err) {
            console.error("Token verification failed", err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (data) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('tracelink_token', data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('tracelink_token');
    };

    const register = async (username, password) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await res.json();
    };

    const performLogin = async (username, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            login(data.data);
        }
        return data;
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login: performLogin,
            register,
            logout,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
