import { Link } from 'react-router-dom';
import AuthNavActions from './AuthNavActions';

export default function Navbar() {
  return (
    <nav className="app-nav">
      <Link className="app-nav-logo" to="/">
        <span className="app-nav-mark" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="1.5" width="4" height="4" rx="1.2" fill="white" />
            <rect x="8.5" y="1.5" width="4" height="4" rx="1.2" fill="white" opacity="0.75" />
            <rect x="1.5" y="8.5" width="4" height="4" rx="1.2" fill="white" opacity="0.75" />
            <rect x="8.5" y="8.5" width="4" height="4" rx="1.2" fill="white" opacity="0.5" />
          </svg>
        </span>
        FMS
      </Link>

      <div className="app-nav-links" aria-label="Primary navigation">
        <Link className="app-nav-link" to="/resources">Resources</Link>
        <Link className="app-nav-link" to="/bookings">Bookings</Link>
        <Link className="app-nav-link" to="/tickets">Tickets</Link>
      </div>

      <div className="app-nav-right">
        <AuthNavActions />
      </div>
    </nav>
  );
}
