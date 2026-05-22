import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Comments from '../../components/Comments';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock current user - in real app, this would come from auth context
  const currentUser = { email: 'user@example.com', name: 'Demo User' };
  const userRole = 'USER';

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/tickets/${id}`);
      if (response.data.success) {
        setTicket(response.data.data);
      } else {
        setError('Ticket not found');
      }
    } catch (err) {
      setError('Failed to load ticket');
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#D97706';
      case 'IN_PROGRESS': return '#2563EB';
      case 'RESOLVED': return '#059669';
      case 'CLOSED': return '#64748B';
      case 'REJECTED': return '#DC2626';
      default: return '#64748B';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return '#059669';
      case 'MEDIUM': return '#D97706';
      case 'HIGH': return '#DC2626';
      case 'URGENT': return '#7C3AED';
      default: return '#64748B';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#F5F7FA',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Manrope, sans-serif'
      }}>
        <div>Loading ticket...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#F5F7FA',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => navigate('/tickets/workflow')}
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
          >
            ← Back to Tickets
          </button>
          
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#DC2626', marginBottom: '1rem' }}>
              {error || 'Ticket not found'}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F5F7FA',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate('/tickets/workflow')}
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif'
            }}
          >
            ← Back to Tickets
          </button>
          
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <span style={{
              padding: '0.5rem 1rem',
              backgroundColor: getStatusColor(ticket.status),
              color: '#FFFFFF',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Manrope, sans-serif'
            }}>
              {ticket.status}
            </span>
            <span style={{
              padding: '0.5rem 1rem',
              backgroundColor: getPriorityColor(ticket.priority),
              color: '#FFFFFF',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Manrope, sans-serif'
            }}>
              {ticket.priority}
            </span>
          </div>
        </div>

        {/* Ticket Details */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#0F172A',
            marginBottom: '1rem'
          }}>
            {ticket.title}
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748B',
                marginBottom: '0.5rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Category
              </label>
              <div style={{
                fontSize: '1rem',
                color: '#0F172A',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {ticket.category}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748B',
                marginBottom: '0.5rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Submitted By
              </label>
              <div style={{
                fontSize: '1rem',
                color: '#0F172A',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {ticket.submittedBy}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748B',
                marginBottom: '0.5rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Contact Number
              </label>
              <div style={{
                fontSize: '1rem',
                color: '#0F172A',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {ticket.contactNumber}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748B',
                marginBottom: '0.5rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Location
              </label>
              <div style={{
                fontSize: '1rem',
                color: '#0F172A',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {ticket.location}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748B',
                marginBottom: '0.5rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Assigned To
              </label>
              <div style={{
                fontSize: '1rem',
                color: '#0F172A',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {ticket.assignedTo || 'Not assigned'}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#64748B',
                marginBottom: '0.5rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                Created
              </label>
              <div style={{
                fontSize: '1rem',
                color: '#0F172A',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {formatDate(ticket.createdAt)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '1rem'
            }}>
              Description
            </h3>
            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '1.5rem',
              borderRadius: '8px',
              color: '#334155',
              fontFamily: 'Manrope, sans-serif',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {ticket.description}
            </div>
          </div>

          {/* Resolution Notes */}
          {ticket.resolutionNotes && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '1rem'
              }}>
                Resolution Notes
              </h3>
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #059669',
                padding: '1.5rem',
                borderRadius: '8px',
                color: '#059669',
                fontFamily: 'Manrope, sans-serif',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {ticket.resolutionNotes}
              </div>
            </div>
          )}

          {/* Images */}
          {ticket.imageAttachments && ticket.imageAttachments.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '1rem'
              }}>
                Attached Images
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {ticket.imageAttachments.map((image, index) => (
                  <div key={index} style={{
                    border: '1px solid #E3E8EF',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={`http://localhost:8080${image}`}
                      alt={`Ticket image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGN0ZBIi8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWOTBIODBWNjBaIiBmaWxsPSIjNjQ3OEI4Ii8+CjxwYXRoIGQ9Ik04MCA5MEgxMjBWMTIwSDgwVjkwWiIgZmlsbD0iIzY0NzhiOCIvPgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <Comments 
          ticketId={id} 
          currentUser={currentUser} 
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default TicketDetail;
