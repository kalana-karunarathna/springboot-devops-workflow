import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import ResourcesPage from './pages/resources';
import BookingsPage from './pages/bookings';
import TicketsPage from './pages/tickets';
import LoginPage from './pages/auth';
import NotificationsPage from './pages/notifications';

function Shell() {
  const location = useLocation();
  const showSharedNavbar = location.pathname !== '/';

  return (
    <>
      {showSharedNavbar ? <Navbar /> : null}
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}
