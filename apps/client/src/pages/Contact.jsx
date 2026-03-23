import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiPhone, FiMapPin, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { submitContact } from '../api';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', department: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await submitContact(form);
            setSuccess(res.data.data.message);
            setForm({ name: '', email: '', company: '', phone: '', department: '', message: '' });
        } catch (err) {
            const errors = err.response?.data?.errors;
            setError(errors ? errors.join('. ') : 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <motion.section className="page-hero" initial="hidden" animate="visible">
                <motion.h1 variants={fadeUp} custom={0}>Contact Us</motion.h1>
                <motion.p variants={fadeUp} custom={1} style={{ color: 'var(--text-secondary)', maxWidth: 680 }}>
                    Connect with our enterprise team to deploy TraceLink AI Suite across your regulated operations.
                </motion.p>
            </motion.section>

            <motion.div initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Form */}
                <motion.div variants={fadeUp} custom={2} className="card">
                    <h3 style={{ marginBottom: '1.25rem' }}>Send us a message</h3>

                    {success && (
                        <div className="alert success" style={{ marginBottom: '1rem' }}>
                            <FiCheckCircle /> {success}
                        </div>
                    )}

                    {error && (
                        <div className="alert error" style={{ marginBottom: '1rem' }}>
                            <FiAlertTriangle /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input id="name" name="name" className="form-input" placeholder="Arjun Mehra" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input id="email" name="email" type="email" className="form-input" placeholder="arjun@cipla.com" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="company">Company</label>
                                <input id="company" name="company" className="form-input" placeholder="Sun Pharma / Cipla" value={form.company} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input id="phone" name="phone" className="form-input" placeholder="+91 98XXX XXXXX" value={form.phone} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <select id="department" name="department" className="form-select" value={form.department} onChange={handleChange}>
                                <option value="">Select department...</option>
                                <option value="Quality Assurance">Quality Assurance</option>
                                <option value="Regulatory Affairs">Regulatory Affairs</option>
                                <option value="Supply Chain">Supply Chain</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="IT / Technology">IT / Technology</option>
                                <option value="Executive">Executive</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message *</label>
                            <textarea id="message" name="message" className="form-textarea" placeholder="Tell us about your compliance requirements..." value={form.message} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? <><span className="loading-spinner"></span> Sending...</> : <><FiSend /> Send Message</>}
                        </button>
                    </form>
                </motion.div>

                {/* Contact Info */}
                <motion.div variants={fadeUp} custom={3}>
                    <div className="card" style={{ marginBottom: '1.25rem' }}>
                        <h3>India Headquarters</h3>
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0, 194, 178, 0.1)', border: '1px solid var(--border-glow)', display: 'grid', placeItems: 'center', color: 'var(--teal-glow)' }}>
                                    <FiMapPin />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Pune Office</div>
                                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>11th Floor, Smartworks, Amar Madhuban Tech Park, Baner 411045</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0, 194, 178, 0.1)', border: '1px solid var(--border-glow)', display: 'grid', placeItems: 'center', color: 'var(--teal-glow)' }}>
                                    <FiMapPin />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Mumbai Office</div>
                                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Natraj Studios, Western Express Highway, Andheri (East) 400069</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0, 194, 178, 0.1)', border: '1px solid var(--border-glow)', display: 'grid', placeItems: 'center', color: 'var(--teal-glow)' }}>
                                    <FiPhone />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Phone</div>
                                    <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>+91 682 762 2001</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3>Response SLA</h3>
                        <div style={{ marginTop: '0.75rem' }}>
                            {[
                                { label: 'Initial Response', time: '< 24 hours' },
                                { label: 'Technical Demo', time: '< 3 business days' },
                                { label: 'Security Review', time: '< 5 business days' },
                                { label: 'POC Setup', time: '< 2 weeks' },
                            ].map(sla => (
                                <div key={sla.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{sla.label}</span>
                                    <span style={{ color: 'var(--teal-glow)', fontWeight: 600, fontSize: '0.88rem' }}>{sla.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
