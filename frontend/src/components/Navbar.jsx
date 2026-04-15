import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/resources">Resources</Link>
      <Link to="/bookings">Bookings</Link>
      <Link to="/tickets">Tickets</Link>
      <Link to="/login">Auth</Link>
      <div style={{ marginLeft: 'auto' }}>
        <button type="button">{user ? 'Logout' : 'Login'}</button>
      </div>
    </nav>
  );
}
