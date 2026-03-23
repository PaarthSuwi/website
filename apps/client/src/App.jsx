import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DataValidation from './pages/DataValidation';
import ZoomMeeting from './pages/ZoomMeeting';
import TranscriptViewer from './pages/TranscriptViewer';
import MinutesGenerator from './pages/MinutesGenerator';
import PlatformOverview from './pages/PlatformOverview';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { token, loading, isAdmin } = useAuth();

    if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}><span className="loading-spinner"></span></div>;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main className="page-wrapper">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Public but needs auth to see transcripts/minutes */}
                        <Route path="/transcripts" element={<ProtectedRoute><TranscriptViewer /></ProtectedRoute>} />
                        <Route path="/transcripts/:id" element={<ProtectedRoute><TranscriptViewer /></ProtectedRoute>} />
                        <Route path="/minutes" element={<ProtectedRoute><MinutesGenerator /></ProtectedRoute>} />
                        <Route path="/minutes/:id" element={<ProtectedRoute><MinutesGenerator /></ProtectedRoute>} />

                        {/* Always public */}
                        <Route path="/data-validation" element={<DataValidation />} />
                        <Route path="/meetings" element={<ZoomMeeting />} />
                        <Route path="/platform" element={<PlatformOverview />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Admin Only */}
                        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}
