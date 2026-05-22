import { useState, useEffect } from 'react';
import NotificationPanel from './NotificationPanel';

export default function NotificationsPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userEmail] = useState('user@example.com'); // This would come from auth context

  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#0F172A',
            margin: '0 0 0.5rem 0'
          }}>
            Notifications
          </h1>
          <p style={{
            color: '#64748B',
            fontSize: '1rem',
            margin: '0'
          }}>
            Manage your notifications and stay updated
          </p>
        </div>

        {/* Demo Content */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            ð
          </div>
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            color: '#0F172A',
            margin: '0 0 0.5rem 0'
          }}>
            Notification Center
          </h3>
          <p style={{
            color: '#64748B',
            marginBottom: '1.5rem'
          }}>
            Click the notification icon in the navbar to view your notifications
          </p>
          <button
            onClick={() => setIsPanelOpen(true)}
            style={{
              backgroundColor: '#DB2777',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              fontFamily: 'Manrope, sans-serif',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Open Notification Panel
          </button>
        </div>
      </div>

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        userEmail={userEmail}
      />
    </div>
  );
}
