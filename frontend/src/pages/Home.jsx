import { useNavigate } from 'react-router-dom';
import './Home.css';

const modules = [
  {
    title: 'Facilities & assets',
    desc: 'Browse rooms, labs, and equipment. Check capacity, location, and availability status in real time.',
    chips: ['Rooms', 'Labs', 'Equipment'],
    path: '/resources',
    iconBg: '#E1F5EE',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="7" rx="1" fill="#1D9E75" />
        <rect x="10" y="2" width="6" height="4" rx="1" fill="#1D9E75" opacity="0.5" />
        <rect x="2" y="11" width="6" height="5" rx="1" fill="#1D9E75" opacity="0.5" />
        <rect x="10" y="8" width="6" height="8" rx="1" fill="#1D9E75" opacity="0.75" />
      </svg>
    ),
  },
  {
    title: 'Booking management',
    desc: 'Request and approve room bookings. Conflict detection ensures no double-booking ever happens.',
    chips: [
      { label: 'Pending', style: { color: '#0C447C', background: '#E6F1FB', borderColor: '#B5D4F4' } },
      { label: 'Approved', style: { color: '#085041', background: '#E1F5EE', borderColor: '#9FE1CB' } },
      { label: 'Rejected', style: { color: '#791F1F', background: '#FCEBEB', borderColor: '#F7C1C1' } },
    ],
    path: '/bookings',
    iconBg: '#E6F1FB',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="5" width="12" height="10" rx="1.5" fill="#378ADD" opacity="0.25" />
        <rect x="3" y="5" width="12" height="10" rx="1.5" stroke="#185FA5" strokeWidth="1" />
        <path d="M6 5V3M12 5V3M3 8h12" stroke="#185FA5" strokeWidth="1" strokeLinecap="round" />
        <rect x="6" y="10" width="2" height="2" rx="0.5" fill="#185FA5" />
        <rect x="10" y="10" width="2" height="2" rx="0.5" fill="#185FA5" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: 'Maintenance tickets',
    desc: 'Report issues with photos, set priority, and track repairs from open to resolved with technician updates.',
    chips: ['Open', 'In progress', 'Resolved'],
    path: '/tickets',
    iconBg: '#FAEEDA',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6" fill="#EF9F27" opacity="0.2" />
        <circle cx="9" cy="9" r="6" stroke="#BA7517" strokeWidth="1" />
        <path d="M9 6v3.5M9 12v.5" stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Auth & notifications',
    desc: 'Sign in with Google, access features based on your role, and get notified on booking and ticket updates.',
    chips: ['User', 'Admin', 'Technician'],
    path: '/login',
    iconBg: '#FBEAF0',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 3C6.5 3 4.5 5 4.5 7.5c0 2 .8 3.2 1.5 4.5H12c.7-1.3 1.5-2.5 1.5-4.5C13.5 5 11.5 3 9 3z" fill="#D4537E" opacity="0.25" />
        <path d="M9 3C6.5 3 4.5 5 4.5 7.5c0 2 .8 3.2 1.5 4.5H12c.7-1.3 1.5-2.5 1.5-4.5C13.5 5 11.5 3 9 3z" stroke="#993556" strokeWidth="1" />
        <path d="M7 12c0 1.1.9 2 2 2s2-.9 2-2" stroke="#993556" strokeWidth="1" />
        <circle cx="13" cy="4" r="2.5" fill="#E24B4A" />
      </svg>
    ),
  },
];

const activity = [
  {
    dot: '#1D9E75',
    text: (
      <>
        Booking <strong>#B-041</strong> approved - Lab 3B, 9:00-11:00 AM
      </>
    ),
    badge: 'Approved',
    badgeStyle: { background: '#E1F5EE', color: '#0F6E56' },
    time: '2m ago',
  },
  {
    dot: '#EF9F27',
    text: (
      <>
        Ticket <strong>#T-018</strong> assigned to technician - AC unit fault, Room 204
      </>
    ),
    badge: 'In progress',
    badgeStyle: { background: '#FAEEDA', color: '#854F0B' },
    time: '15m ago',
  },
  {
    dot: '#378ADD',
    text: 'New booking request - Conference Hall A, 2:00-4:00 PM',
    badge: 'Pending',
    badgeStyle: { background: '#E6F1FB', color: '#185FA5' },
    time: '34m ago',
  },
  {
    dot: '#888780',
    text: (
      <>
        Resource <strong>Projector-07</strong> status updated to maintenance
      </>
    ),
    badge: 'Updated',
    badgeStyle: { background: '#F1EFE8', color: '#5F5E5A' },
    time: '1h ago',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.75" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.75" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.5" />
            </svg>
          </div>
          FMS
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/resources')}>Resources</button>
          <button className="nav-link" onClick={() => navigate('/bookings')}>Bookings</button>
          <button className="nav-link" onClick={() => navigate('/tickets')}>Tickets</button>
          <button className="nav-link" onClick={() => navigate('/notifications')}>Notifications</button>
        </div>
        <div className="nav-right">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-primary" onClick={() => navigate('/login')}>Get started</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-badge">
          <span className="dot" />
          Now live - v1.0
        </div>
        <h1>Manage your facilities,<br />effortlessly.</h1>
        <p className="hero-sub">
          Book rooms, report incidents, and track resources - all in one place.
          Built for campus and facility teams.
        </p>
        <div className="hero-actions">
          <button className="btn-lg btn-lg-primary" onClick={() => navigate('/resources')}>
            Go to dashboard
          </button>
          <button className="btn-lg btn-lg-ghost" onClick={() => navigate('/bookings')}>
            View bookings
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

      <section className="section">
        <p className="section-label">What you can do</p>
        <div className="modules-grid">
          {modules.map((m) => (
            <div className="module-card" key={m.title} onClick={() => navigate(m.path)}>
              <div className="module-top">
                <div className="module-icon" style={{ background: m.iconBg }}>
                  {m.icon}
                </div>
                <span className="module-arrow">-&gt;</span>
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
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <p className="section-label">Recent activity</p>
        <div className="activity">
          {activity.map((a, i) => (
            <div className="activity-row" key={i}>
              <div className="a-dot" style={{ background: a.dot }} />
              <div className="a-text">{a.text}</div>
              <span className="a-badge" style={a.badgeStyle}>{a.badge}</span>
              <span className="a-time">{a.time}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span className="footer-text">Facility Management System - Group Project 2025</span>
        <span className="footer-text">Spring Boot - MongoDB - React</span>
      </footer>
    </div>
  );
}
