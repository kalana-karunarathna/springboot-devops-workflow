import { useNavigate } from 'react-router-dom';
import AuthNavActions from '../components/AuthNavActions';
import './Home.css';

const modules = [
  {
    title: 'Facilities & assets',
    desc: 'Browse rooms, labs, and equipment. Check capacity, location, and availability status in real time.',
    chips: ['Rooms', 'Labs', 'Equipment'],
    path: '/resources',
    accent: '#2563EB',
    accentBg: '#EFF4FF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="8" rx="1.5" fill="#2563EB" />
        <rect x="11" y="2" width="7" height="5" rx="1.5" fill="#2563EB" opacity="0.4" />
        <rect x="2" y="12" width="7" height="6" rx="1.5" fill="#2563EB" opacity="0.4" />
        <rect x="11" y="9" width="7" height="9" rx="1.5" fill="#2563EB" opacity="0.65" />
      </svg>
    ),
  },
  {
    title: 'Booking management',
    desc: 'Request and approve room bookings. Conflict detection ensures no double-booking ever happens.',
    chips: [
      { label: 'Pending', style: { color: '#1D4ED8', background: '#EFF4FF', border: '1px solid #BFCFFE' } },
      { label: 'Approved', style: { color: '#065F46', background: '#ECFDF5', border: '1px solid #A7F3D0' } },
      { label: 'Rejected', style: { color: '#991B1B', background: '#FEF2F2', border: '1px solid #FECACA' } },
    ],
    path: '/bookings',
    accent: '#7C3AED',
    accentBg: '#F3EFFE',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="5" width="14" height="12" rx="2" fill="#7C3AED" opacity="0.12" />
        <rect x="3" y="5" width="14" height="12" rx="2" stroke="#7C3AED" strokeWidth="1.25" />
        <path d="M7 5V3M13 5V3M3 9h14" stroke="#7C3AED" strokeWidth="1.25" strokeLinecap="round" />
        <rect x="7" y="12" width="2.5" height="2.5" rx="0.5" fill="#7C3AED" />
        <rect x="11" y="12" width="2.5" height="2.5" rx="0.5" fill="#7C3AED" opacity="0.45" />
      </svg>
    ),
  },
  {
    title: 'Maintenance tickets',
    desc: 'Report issues with photos, set priority, and track repairs from open to resolved with technician updates.',
    chips: ['Open', 'In progress', 'Resolved'],
    path: '/tickets',
    accent: '#D97706',
    accentBg: '#FFFBEB',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" fill="#D97706" opacity="0.12" />
        <circle cx="10" cy="10" r="7" stroke="#D97706" strokeWidth="1.25" />
        <path d="M10 7v4M10 13.5v.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Auth & notifications',
    desc: 'Sign in with Google, access features based on your role, and get notified on booking and ticket updates.',
    chips: ['User', 'Admin', 'Technician'],
    path: '/login',
    accent: '#DB2777',
    accentBg: '#FDF2F8',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3C7 3 5 5.5 5 8.5c0 2.2 1 3.8 2 5.5h6c1-1.7 2-3.3 2-5.5C15 5.5 13 3 10 3z" fill="#DB2777" opacity="0.12" />
        <path d="M10 3C7 3 5 5.5 5 8.5c0 2.2 1 3.8 2 5.5h6c1-1.7 2-3.3 2-5.5C15 5.5 13 3 10 3z" stroke="#DB2777" strokeWidth="1.25" />
        <path d="M8 14c0 1.1.9 2 2 2s2-.9 2-2" stroke="#DB2777" strokeWidth="1.25" />
        <circle cx="14" cy="5" r="2.5" fill="#EF4444" />
      </svg>
    ),
  },
];

const activity = [
  {
    color: '#059669',
    text: (<>Booking <strong>#B-041</strong> approved - Lab 3B, 9:00-11:00 AM</>),
    badge: 'Approved',
    badgeStyle: { color: '#065F46', background: '#ECFDF5', border: '1px solid #A7F3D0' },
    time: '2m ago',
  },
  {
    color: '#D97706',
    text: (<>Ticket <strong>#T-018</strong> assigned to technician - AC unit fault, Room 204</>),
    badge: 'In progress',
    badgeStyle: { color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A' },
    time: '15m ago',
  },
  {
    color: '#2563EB',
    text: 'New booking request - Conference Hall A, 2:00-4:00 PM',
    badge: 'Pending',
    badgeStyle: { color: '#1D4ED8', background: '#EFF4FF', border: '1px solid #BFCFFE' },
    time: '34m ago',
  },
  {
    color: '#94A3B8',
    text: (<>Resource <strong>Projector-07</strong> status updated to maintenance</>),
    badge: 'Updated',
    badgeStyle: { color: '#475569', background: '#F1F5F9', border: '1px solid #E2E8F0' },
    time: '1h ago',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.65" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.65" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.38" />
            </svg>
          </div>
          FMS
        </div>
        <div className="nav-links">
          <button type="button" className="nav-link" onClick={() => navigate('/resources')}>Resources</button>
          <button type="button" className="nav-link" onClick={() => navigate('/bookings')}>Bookings</button>
          <button type="button" className="nav-link" onClick={() => navigate('/tickets')}>Tickets</button>
          <button type="button" className="nav-link" onClick={() => navigate('/notifications')}>Notifications</button>
        </div>
        <div className="nav-right">
          <AuthNavActions variant="home" />
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-grid-overlay" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-badge">
          <span className="badge-dot" />
          Now live - v1.0
        </div>

        <h1 className="hero-title">
          Manage your facilities,<br />
          <span className="hero-title-accent">effortlessly.</span>
        </h1>

        <p className="hero-sub">
          Book rooms, report incidents, and track resources - all in one place.
          Built for campus and facility teams.
        </p>

        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={() => navigate('/resources')}>
            Go to dashboard
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-hero-ghost" onClick={() => navigate('/bookings')}>
            View bookings
          </button>
          <button className="btn-hero-ghost" onClick={() => navigate('/tickets/createticket')}>
            Create Ticket
          </button>
        </div>

        <div className="stats">
          {[
            { num: '48', label: 'Resources' },
            { num: '12', label: 'Bookings today' },
            { num: '5', label: 'Open tickets' },
          ].map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MODULES */}
      <section className="section">
        <div className="section-header">
          <span className="section-eyebrow">What you can do</span>
          <h2 className="section-title">Everything your facility needs</h2>
        </div>
        <div className="modules-grid">
          {modules.map((m) => (
            <div className="module-card" key={m.title} onClick={() => navigate(m.path)}>
              <div className="module-top">
                <div className="module-icon" style={{ background: m.accentBg }}>
                  {m.icon}
                </div>
                <span className="module-arrow">
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="module-title">{m.title}</div>
              <div className="module-desc">{m.desc}</div>
              <div className="module-footer">
                {m.chips.map((c) =>
                  typeof c === 'string' ? (
                    <span className="chip" key={c}>{c}</span>
                  ) : (
                    <span className="chip" key={c.label} style={c.style}>{c.label}</span>
                  )
                )}
              </div>
              <div className="module-line" style={{ background: m.accent }} />
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVITY */}
      <section className="section section-activity">
        <div className="section-header">
          <span className="section-eyebrow">Recent activity</span>
          <h2 className="section-title">Live system feed</h2>
        </div>
        <div className="activity-card">
          {activity.map((a, i) => (
            <div className="activity-row" key={i}>
              <div className="a-indicator">
                <div className="a-dot" style={{ background: a.color }} />
                {i < activity.length - 1 && <div className="a-line" />}
              </div>
              <div className="a-content">
                <div className="a-text">{a.text}</div>
                <div className="a-meta">
                  <span className="a-badge" style={a.badgeStyle}>{a.badge}</span>
                  <span className="a-time">{a.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">
          <div className="logo-mark logo-mark-sm">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.65" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.65" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.38" />
            </svg>
          </div>
          FMS
        </div>
        <span className="footer-text">Facility Management System — Group Project 2025</span>
        <span className="footer-text">Spring Boot - MongoDB - React</span>
      </footer>
    </div>
  );
}

