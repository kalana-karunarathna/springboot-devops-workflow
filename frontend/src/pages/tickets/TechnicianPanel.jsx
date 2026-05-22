import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const TechnicianPanel = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    resolutionNotes: ''
  });

  // Mock current technician - in real app, this would come from auth context
  const currentTechnician = { email: 'tech@example.com', name: 'John Technician' };

  const categories = ['Maintenance', 'IT Support', 'Cleaning', 'Security', 'Facilities', 'Other'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  useEffect(() => {
    fetchTechnicianTickets();
  }, []);

  useEffect(() => {
    fetchTechnicianTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority) {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(ticket => ticket.category === filterCategory);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, filterStatus, filterPriority, filterCategory]);

  const fetchTechnicianTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tickets');
      if (response.data.success) {
        // Filter tickets assigned to current technician
        const technicianTickets = response.data.data.filter(
          ticket => ticket.assignedTo === currentTechnician.email
        );
        setTickets(technicianTickets);
      }
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateData({
      status: ticket.status,
      resolutionNotes: ticket.resolutionNotes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = async () => {
    try {
      const response = await axios.put(`/tickets/${selectedTicket.id}`, updateData);
      if (response.data.success) {
        fetchTechnicianTickets();
        setShowUpdateModal(false);
        setSelectedTicket(null);
      }
    } catch (err) {
      setError('Failed to update ticket');
      console.error('Error updating ticket:', err);
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
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--page-radial), var(--bg-page)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Manrope, sans-serif'
      }}>
        <div>Loading technician dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--page-radial), var(--bg-page)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-heading)',
            marginBottom: '0.5rem'
          }}>
            👨‍🔧 Technician Dashboard
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '1rem'
          }}>
            Welcome back, {currentTechnician.name}! Manage your assigned tickets.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '1.5rem',
            borderRadius: '22px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--blue)',
              fontFamily: 'Sora, sans-serif'
            }}>
              {tickets.length}
            </div>
            <div style={{
              color: 'var(--text-muted)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem'
            }}>
              Total Assigned
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '1.5rem',
            borderRadius: '22px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#b45309',
              fontFamily: 'Sora, sans-serif'
            }}>
              {tickets.filter(t => t.status === 'IN_PROGRESS').length}
            </div>
            <div style={{
              color: 'var(--text-muted)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem'
            }}>
              In Progress
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '1.5rem',
            borderRadius: '22px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--blue)',
              fontFamily: 'Sora, sans-serif'
            }}>
              {tickets.filter(t => t.status === 'RESOLVED').length}
            </div>
            <div style={{
              color: 'var(--text-muted)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem'
            }}>
              Resolved
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '1.5rem',
            borderRadius: '22px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--danger)',
              fontFamily: 'Sora, sans-serif'
            }}>
              {tickets.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH').length}
            </div>
            <div style={{
              color: 'var(--text-muted)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem'
            }}>
              High Priority
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          padding: '1.5rem',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '0.875rem',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '0.875rem',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none'
                }}
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '0.875rem',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none'
                }}
              >
                <option value="">All Priority</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '0.875rem',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              fontFamily: 'Manrope, sans-serif',
              textAlign: 'right'
            }}>
              Showing {filteredTickets.length} of {tickets.length} tickets
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-soft)'
        }}>
          {error && (
            <div style={{
              backgroundColor: '#fff4f4',
              color: '#b42318',
              padding: '1rem',
              fontFamily: 'Manrope, sans-serif'
            }}>
              {error}
            </div>
          )}

          {filteredTickets.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontFamily: 'Manrope, sans-serif'
            }}>
              {filterStatus ? 'No tickets found with this status.' : 'No tickets assigned to you yet.'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'rgba(247, 252, 248, 0.94)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Title</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Category</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Priority</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Submitted By</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Location</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Images</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Created</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600', fontFamily: 'Sora, sans-serif', fontSize: '0.875rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{
                          fontWeight: '600',
                          color: 'var(--text-heading)',
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '0.875rem'
                        }}>
                          {ticket.title}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'Manrope, sans-serif',
                          marginTop: '0.25rem'
                        }}>
                          {ticket.submittedBy}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: `${getPriorityColor(ticket.priority)}22`,
                          color: getPriorityColor(ticket.priority),
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: `${getStatusColor(ticket.status)}22`,
                          color: getStatusColor(ticket.status),
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {ticket.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-body)' }}>{ticket.submittedBy}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-body)' }}>{ticket.location}</td>
                      <td style={{ padding: '1rem' }}>
                        {ticket.imageAttachments && ticket.imageAttachments.length > 0 ? (
                          <span style={{ color: '#059669', fontWeight: '600' }}>
                            📎 {ticket.imageAttachments.length}
                          </span>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-body)' }}>{formatDate(ticket.createdAt)}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                            style={{
                              background: 'linear-gradient(135deg, var(--blue), var(--pink))',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleUpdateTicket(ticket)}
                            style={{
                              background: 'linear-gradient(135deg, var(--purple), var(--blue))',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Modal */}
        {showUpdateModal && selectedTicket && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '2rem',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0F172A',
                marginBottom: '1rem'
              }}>
                Update Ticket
              </h2>
              
              <div style={{
                backgroundColor: '#EEF2F7',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  marginBottom: '0.5rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  Title: {selectedTicket.title}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  Location: {selectedTicket.location}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#0F172A',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  fontFamily: 'Sora, sans-serif'
                }}>
                  Status:
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E3E8EF',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Manrope, sans-serif'
                  }}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#0F172A',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  fontFamily: 'Sora, sans-serif'
                }}>
                  Resolution Notes:
                </label>
                <textarea
                  value={updateData.resolutionNotes}
                  onChange={(e) => setUpdateData({...updateData, resolutionNotes: e.target.value})}
                  rows="4"
                  placeholder="Add resolution notes..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E3E8EF',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Manrope, sans-serif',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  style={{
                    backgroundColor: '#64748B',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    fontFamily: 'Manrope, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    fontFamily: 'Manrope, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Save Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianPanel;
