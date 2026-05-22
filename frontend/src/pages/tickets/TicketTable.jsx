import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

export default function TicketTable() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter((ticket) =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((ticket) => ticket.status === filterStatus);
    }

    if (filterPriority) {
      filtered = filtered.filter((ticket) => ticket.priority === filterPriority);
    }

    if (filterCategory) {
      filtered = filtered.filter((ticket) => ticket.category === filterCategory);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, filterStatus, filterPriority, filterCategory]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      if (response.data.success) {
        setTickets(response.data.data);
        setFilteredTickets(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return '#DC2626';
      case 'HIGH':
        return '#D97706';
      case 'MEDIUM':
        return '#2563EB';
      case 'LOW':
        return '#64748B';
      default:
        return '#64748B';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return '#DC2626';
      case 'IN_PROGRESS':
        return '#D97706';
      case 'RESOLVED':
        return '#10B981';
      case 'CLOSED':
        return '#64748B';
      case 'REJECTED':
        return '#7C3AED';
      default:
        return '#64748B';
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Manrope, sans-serif',
        background: 'var(--page-radial), var(--bg-page)',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading tickets...</div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      background: 'var(--page-radial), var(--bg-page)',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--text-heading)',
                margin: '0 0 0.5rem 0',
              }}>
                Support Tickets
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1rem',
                margin: '0 0 1rem 0',
              }}>
                Total: {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} | Showing: {filteredTickets.length}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}>
              <button
                onClick={() => navigate('/tickets/createticket')}
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  fontFamily: 'Manrope, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Create New Ticket
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '1rem',
              alignItems: 'end',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '600',
                  color: 'var(--text-heading)',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}>
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tickets..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontFamily: 'Manrope, sans-serif',
                    backgroundColor: 'var(--bg-soft)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '600',
                  color: 'var(--text-heading)',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}>
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontFamily: 'Manrope, sans-serif',
                    backgroundColor: 'var(--bg-soft)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '600',
                  color: 'var(--text-heading)',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}>
                  Priority
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontFamily: 'Manrope, sans-serif',
                    backgroundColor: 'var(--bg-soft)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">All Priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '600',
                  color: 'var(--text-heading)',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}>
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontFamily: 'Manrope, sans-serif',
                    backgroundColor: 'var(--bg-soft)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Security">Security</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('');
                    setFilterPriority('');
                    setFilterCategory('');
                  }}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-body)',
                    border: '1px solid var(--border)',
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    fontFamily: 'Manrope, sans-serif',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fff4f4',
            color: '#b42318',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #f4c5c5',
          }}>
            {error}
          </div>
        )}

        {filteredTickets.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-soft)',
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              color: 'var(--text-heading)',
              margin: '0 0 0.5rem 0',
            }}>
              No tickets found
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Create your first support ticket to get started.
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-soft)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              backgroundColor: 'rgba(247, 252, 248, 0.94)',
              padding: '1rem 1.5rem',
              borderBottom: '2px solid var(--border)',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              color: 'var(--text-heading)',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                gap: '1rem',
                alignItems: 'center',
              }}>
                <div>Title</div>
                <div>Category</div>
                <div>Priority</div>
                <div>Status</div>
                <div>Submitted By</div>
                <div>Location</div>
              </div>
            </div>

            <div>
              {filteredTickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  style={{
                    padding: '1rem 1.5rem',
                    borderBottom: index === filteredTickets.length - 1 ? 'none' : '1px solid var(--border)',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(237, 247, 241, 0.72)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                    gap: '1rem',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: '600',
                        color: 'var(--text-heading)',
                        marginBottom: '0.25rem',
                        fontSize: '0.95rem',
                      }}>
                        {ticket.title}
                      </div>
                      <div style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontFamily: 'Manrope, sans-serif',
                      }}>
                        {formatDate(ticket.createdAt)}
                      </div>
                    </div>

                    <div style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>
                      {ticket.category}
                    </div>

                    <div>
                      <span style={{
                        backgroundColor: `${getPriorityColor(ticket.priority)}22`,
                        color: getPriorityColor(ticket.priority),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        fontFamily: 'Sora, sans-serif',
                        display: 'inline-block',
                      }}>
                        {ticket.priority}
                      </span>
                    </div>

                    <div>
                      <span style={{
                        backgroundColor: `${getStatusColor(ticket.status)}22`,
                        color: getStatusColor(ticket.status),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        fontFamily: 'Sora, sans-serif',
                        display: 'inline-block',
                      }}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>
                      {ticket.submittedBy}
                    </div>

                    <div style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>
                      {ticket.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
