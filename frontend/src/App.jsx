import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import ResourcesPage from './pages/resources';
import AdminDashboard from './pages/resources/AdminDashboard';
import BookingsPage from './pages/bookings';
import BookingAdminPage from './pages/bookings/admin';
import TicketsPage from './pages/tickets/index';
import CreateTicket from './pages/tickets/CreateTicket';
import EditTicket from './pages/tickets/EditTicket';
import TicketTable from './pages/tickets/TicketTable';
import TicketAdmin from './pages/tickets/TicketAdmin';
import TicketDetail from './pages/tickets/TicketDetail';
import TechnicianPanel from './pages/tickets/TechnicianPanel';
import LoginPage from './pages/auth';
import NotificationsPage from './pages/notifications';

function Shell() {
  const location = useLocation();
  const showSharedNavbar = location.pathname !== '/';

  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      background: 'var(--page-radial), var(--bg-page)',
      minHeight: '100vh',
      color: 'var(--text-heading)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {showSharedNavbar ? (
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(14px)'
        }}>
          <Navbar />
        </header>
      ) : null}
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Manrope, sans-serif',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            color: 'var(--text-heading)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-soft)',
            fontSize: '0.875rem',
            maxWidth: '400px'
          },
          success: {
            iconTheme: {
              primary: '#1D9E75',
              secondary: '#FFFFFF'
            },
            style: {
              borderLeft: '4px solid #1D9E75'
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF'
            },
            style: {
              borderLeft: '4px solid #EF4444'
            }
          },
          loading: {
            iconTheme: {
              primary: '#D97706',
              secondary: '#FFFFFF'
            }
          }
        }}
      />
      
      <main style={{
        flex: 1,
        width: '100%',
        ...(showSharedNavbar ? { 
          paddingTop: '0',
          background: 'transparent'
        } : {
          background: 'transparent'
        })
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/admin" element={<BookingAdminPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/index" element={<TicketsPage />} />
          <Route path="/tickets/workflow" element={<TicketTable />} />
          <Route path="/tickets/admin" element={<TicketAdmin />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/createticket" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/tickets/technician" element={<TechnicianPanel />} />
          <Route path="/tickets/edit/:id" element={<EditTicket />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {showSharedNavbar && (
        <footer style={{
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontFamily: 'Manrope, sans-serif',
          backdropFilter: 'blur(14px)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            Copyright 2024 Smart Campus Facility Management System. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <AuthProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
