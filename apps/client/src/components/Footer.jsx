import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">tracelink <span>ai suite</span></div>
            <p>Enterprise pharmaceutical AI compliance platform for supply chain intelligence and meeting automation.</p>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <Link to="/data-validation">Data Validation</Link>
            <Link to="/meetings">Meeting Intelligence</Link>
            <Link to="/transcripts">Transcript Viewer</Link>
            <Link to="/minutes">AI Minutes</Link>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <Link to="/platform">Platform Overview</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-contact">
            <h4>Contact (India)</h4>
            <p><FiMail /> india.support@tracelinkaisuite.com</p>
            <p><FiPhone /> +91 682 762 2001 (Pune)</p>
            <p><FiMapPin /> Amar Madhuban Tech Park, Baner, Pune</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TraceLink AI Suite · Developed by **Pruthvi Athrey**</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Optimized for TraceLink Pune & Mumbai Operations</p>
        </div>
      </div>

      <style>{`
        .site-footer {
          margin-top: auto;
          border-top: 1px solid rgba(0, 194, 178, 0.2);
          background: linear-gradient(180deg, rgba(8, 31, 26, 0.3), rgba(3, 17, 14, 0.95));
          padding: 3rem 5vw 1.5rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .footer-logo {
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: lowercase;
          margin-bottom: 0.75rem;
        }
        .footer-logo span { color: var(--teal-glow); }
        .footer-brand p {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.6;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-links h4, .footer-contact h4 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--teal-glow);
          margin-bottom: 0.5rem;
        }
        .footer-links a {
          color: var(--text-muted);
          font-size: 0.88rem;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--text-primary); }
        .footer-contact p {
          color: var(--text-muted);
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }
        .footer-bottom {
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.5rem;
          text-align: center;
        }
        .footer-bottom p {
          color: var(--text-dim);
          font-size: 0.82rem;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
