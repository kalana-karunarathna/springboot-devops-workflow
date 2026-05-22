import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserFirstName, getUserInitial, getUserRoleLabel } from '../utils/authUser';

function NotificationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2.25a3.75 3.75 0 0 0-3.75 3.75v1.16c0 .63-.2 1.24-.57 1.75L3.54 10.5a1.5 1.5 0 0 0 1.2 2.4h8.52a1.5 1.5 0 0 0 1.2-2.4l-1.14-1.59a3 3 0 0 1-.57-1.75V6A3.75 3.75 0 0 0 9 2.25Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.2 14.25a1.95 1.95 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M11.25 12.75 15 9m0 0-3.75-3.75M15 9H6.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 5.25V4.5A2.25 2.25 0 0 0 9 2.25H5.25A2.25 2.25 0 0 0 3 4.5v9A2.25 2.25 0 0 0 5.25 15.75H9a2.25 2.25 0 0 0 2.25-2.25v-.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthNavActions({ variant = 'app' }) {
  const navigate = useNavigate();
  const { user, logout, unreadNotificationCount } = useAuth();

  if (!user) {
    const ghostClass = variant === 'home' ? 'btn-ghost' : 'app-btn-ghost';
    const primaryClass = variant === 'home' ? 'btn-primary' : 'app-btn-primary';

    return (
      <>
        <button type="button" className={ghostClass} onClick={() => navigate('/login')}>Sign in</button>
        <button type="button" className={primaryClass} onClick={() => navigate('/login')}>Get started</button>
      </>
    );
  }

  return (
    <div className="auth-nav-cluster">
      <Link className="auth-nav-icon-btn auth-nav-notification-btn" to="/notifications" aria-label="View notifications">
        <NotificationIcon />
        {unreadNotificationCount > 0 ? (
          <span className="auth-nav-notification-badge" aria-label={`${unreadNotificationCount} unread notifications`}>
            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
          </span>
        ) : null}
      </Link>

      <div className="auth-nav-profile" aria-label="Current user">
        {user.picture ? (
          <img className="auth-nav-avatar-image" src={user.picture} alt={getUserFirstName(user)} />
        ) : (
          <span className="auth-nav-avatar-fallback">{getUserInitial(user)}</span>
        )}

        <div className="auth-nav-copy">
          <span className="auth-nav-name">{getUserFirstName(user)}</span>
          <span className="auth-nav-role">{getUserRoleLabel(user)}</span>
        </div>
      </div>

      <button type="button" className="auth-nav-icon-btn" onClick={logout} aria-label="Logout">
        <LogoutIcon />
      </button>
    </div>
  );
}
