import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function NotificationPanel({ isOpen, onClose, userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userEmail) {
      fetchNotifications();
    }
  }, [isOpen, userEmail]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/notifications/user/${userEmail}`);
      if (response.data.success) {
        setNotifications(response.data.data);
        
        // Get unread count
        const countResponse = await axios.get(`/notifications/user/${userEmail}/count`);
        if (countResponse.data.success) {
          setUnreadCount(countResponse.data.data);
        }
      }
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true, readAt: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAsUnread = async (notificationId) => {
    try {
      const response = await axios.put(`/notifications/${notificationId}/unread`);
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: false, readAt: null }
              : notif
          )
        );
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error marking notification as unread:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put(`/notifications/user/${userEmail}/read-all`);
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await axios.delete(`/notifications/${notificationId}`);
      if (response.data.success) {
        const deletedNotification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleDeleteRead = async () => {
    try {
      const response = await axios.delete(`/notifications/user/${userEmail}/read`);
      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => !notif.isRead));
      }
    } catch (err) {
      console.error('Error deleting read notifications:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TICKET_CREATED': return 'ð';
      case 'TICKET_ASSIGNED': return 'ð';
      case 'TICKET_RESOLVED': return 'â';
      case 'TICKET_REJECTED': return 'â';
      case 'BOOKING_APPROVED': return 'â';
      case 'BOOKING_REJECTED': return 'â';
      case 'SYSTEM': return 'â';
      default: return 'ð';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'TICKET_CREATED': return '#D97706';
      case 'TICKET_ASSIGNED': return '#2563EB';
      case 'TICKET_RESOLVED': return '#10B981';
      case 'TICKET_REJECTED': return '#EF4444';
      case 'BOOKING_APPROVED': return '#10B981';
      case 'BOOKING_REJECTED': return '#EF4444';
      case 'SYSTEM': return '#64748B';
      default: return '#64748B';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '400px',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #E3E8EF',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#0F172A',
              margin: 0
            }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '0.5rem',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {unreadCount}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                color: '#64748B',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#EEF2F7';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              style={{
                backgroundColor: unreadCount > 0 ? '#2563EB' : '#EEF2F7',
                color: unreadCount > 0 ? '#FFFFFF' : '#64748B',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                fontFamily: 'Manrope, sans-serif',
                cursor: unreadCount > 0 ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
            >
              Mark All Read
            </button>
            <button
              onClick={handleDeleteRead}
              disabled={notifications.every(n => !n.isRead)}
              style={{
                backgroundColor: notifications.some(n => n.isRead) ? '#EF4444' : '#EEF2F7',
                color: notifications.some(n => n.isRead) ? '#FFFFFF' : '#64748B',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                fontFamily: 'Manrope, sans-serif',
                cursor: notifications.some(n => n.isRead) ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
            >
              Delete Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#64748B',
              fontFamily: 'Manrope, sans-serif'
            }}>
              Loading notifications...
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#EF4444',
              fontFamily: 'Manrope, sans-serif'
            }}>
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#64748B',
              fontFamily: 'Manrope, sans-serif'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                ð
              </div>
              <p style={{ margin: 0 }}>No notifications yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    backgroundColor: notification.isRead ? '#F8FAFC' : '#FFFFFF',
                    border: `1px solid ${notification.isRead ? '#E3E8EF' : getNotificationColor(notification.type)}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Notification Content */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      color: getNotificationColor(notification.type),
                      flexShrink: 0,
                      marginTop: '0.125rem'
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: notification.isRead ? '500' : '600',
                        color: '#0F172A',
                        fontSize: '0.875rem',
                        marginBottom: '0.25rem',
                        lineHeight: '1.4'
                      }}>
                        {notification.title}
                      </div>
                      
                      <div style={{
                        color: '#475569',
                        fontSize: '0.875rem',
                        fontFamily: 'Manrope, sans-serif',
                        marginBottom: '0.5rem',
                        lineHeight: '1.4'
                      }}>
                        {notification.message}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          color: '#94A3B8',
                          fontSize: '0.75rem',
                          fontFamily: 'Manrope, sans-serif'
                        }}>
                          {formatDate(notification.createdAt)}
                        </div>
                        
                        {!notification.isRead && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: getNotificationColor(notification.type),
                            borderRadius: '50%',
                            flexShrink: 0
                          }} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.25rem',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}
                  className="notification-actions"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                  >
                    {notification.isRead ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsUnread(notification.id);
                        }}
                        style={{
                          backgroundColor: '#EEF2F7',
                          color: '#64748B',
                          border: 'none',
                          padding: '0.25rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                        title="Mark as unread"
                      >
                        â
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        style={{
                          backgroundColor: '#EEF2F7',
                          color: '#64748B',
                          border: 'none',
                          padding: '0.25rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                        title="Mark as read"
                      >
                        â
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      style={{
                        backgroundColor: '#EEF2F7',
                        color: '#EF4444',
                        border: 'none',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .notification-actions {
          opacity: 0;
        }
        
        div:hover .notification-actions {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
