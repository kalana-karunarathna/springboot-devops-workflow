import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function TicketAdmin() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSolveModal, setShowSolveModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [solveMessage, setSolveMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    submittedBy: '',
    contactNumber: '',
    location: '',
    status: '',
    assignedTo: '',
    rejectionReason: '',
    resolutionNotes: ''
  });

  const categories = ['Maintenance', 'IT Support', 'Cleaning', 'Security', 'Facilities', 'Other'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }
    if (filterPriority) {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }
    if (filterCategory) {
      filtered = filtered.filter(ticket => ticket.category === filterCategory);
    }
    setTickets(filtered);
  }, [tickets, searchTerm, filterStatus, filterPriority, filterCategory]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      submittedBy: ticket.submittedBy,
      contactNumber: ticket.contactNumber,
      location: ticket.location,
      status: ticket.status,
      assignedTo: ticket.assignedTo || '',
      rejectionReason: ticket.rejectionReason || '',
      resolutionNotes: ticket.resolutionNotes || ''
    });
    setEditImages([]);
    setShowEditModal(true);
  };

  const handleDelete = (ticket) => {
    setSelectedTicket(ticket);
    setShowDeleteModal(true);
  };

  const handleSolve = (ticket) => {
    setSelectedTicket(ticket);
    setSolveMessage(`Your ticket "${ticket.title}" has been resolved. The issue has been fixed and the problem is now solved.`);
    setShowSolveModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('submittedBy', formData.submittedBy);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('assignedTo', formData.assignedTo);
      formDataToSend.append('rejectionReason', formData.rejectionReason);
      formDataToSend.append('resolutionNotes', formData.resolutionNotes);
      
      // Append images
      editImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await axios.put(`/tickets/${selectedTicket.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        fetchTickets();
        setShowEditModal(false);
        setSelectedTicket(null);
        setEditImages([]);
      }
    } catch (err) {
      setError('Failed to update ticket');
      console.error('Error updating ticket:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`/tickets/${selectedTicket.id}`);
      if (response.data.success) {
        fetchTickets();
        setShowDeleteModal(false);
        setSelectedTicket(null);
      }
    } catch (err) {
      setError('Failed to delete ticket');
      console.error('Error deleting ticket:', err);
    }
  };

  const handleSolveConfirm = async () => {
    try {
      const response = await axios.put(`/tickets/${selectedTicket.id}/solve`, {
        message: solveMessage,
        resolvedBy: 'Admin'
      });
      
      if (response.data.success) {
        fetchTickets();
        setShowSolveModal(false);
        setSelectedTicket(null);
        setSolveMessage('');
      }
    } catch (err) {
      setError('Failed to solve ticket');
      console.error('Error solving ticket:', err);
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

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Manrope, sans-serif',
        background: 'var(--page-radial), var(--bg-page)',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-soft)',
          border: '1px solid var(--border)',
          padding: '2rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-heading)',
              margin: 0
            }}>
              Ticket Admin Dashboard
            </h1>
          </div>

          {/* Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '1rem',
                fontFamily: 'Manrope, sans-serif',
                backgroundColor: 'var(--bg-soft)'
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '1rem',
                fontFamily: 'Manrope, sans-serif',
                backgroundColor: 'var(--bg-soft)'
              }}
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '1rem',
                fontFamily: 'Manrope, sans-serif',
                backgroundColor: 'var(--bg-soft)'
              }}
            >
              <option value="">All Priority</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '1rem',
                fontFamily: 'Manrope, sans-serif',
                backgroundColor: 'var(--bg-soft)'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fff4f4',
            color: '#b42318',
            padding: '1rem',
            borderRadius: '14px',
            marginBottom: '1rem',
            border: '1px solid #f4c5c5'
          }}>
            {error}
          </div>
        )}

        {/* Tickets Table */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-soft)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                backgroundColor: 'rgba(247, 252, 248, 0.94)',
                borderBottom: '1px solid var(--border)'
              }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Title</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Priority</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Submitted By</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Images</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-body)', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} style={{
                    borderBottom: '1px solid var(--border)',
                    '&:hover': {
                      backgroundColor: 'rgba(237, 247, 241, 0.72)'
                    }
                  }}>
                    <td style={{ padding: '1rem', color: 'var(--text-body)' }}>{ticket.id.substring(0, 8)}...</td>
                    <td style={{ padding: '1rem', color: 'var(--text-heading)', fontWeight: '500' }}>{ticket.title}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-body)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {ticket.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: `${getPriorityColor(ticket.priority)}20`,
                        color: getPriorityColor(ticket.priority),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: `${getStatusColor(ticket.status)}20`,
                        color: getStatusColor(ticket.status),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-body)' }}>{ticket.submittedBy}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-body)' }}>{ticket.location}</td>
                    <td style={{ padding: '1rem' }}>
                      {ticket.imageAttachments && ticket.imageAttachments.length > 0 ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-body)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {ticket.imageAttachments.length} images
                          </span>
                          <button
                            onClick={() => {
                              setSelectedImages(ticket.imageAttachments);
                              setShowImageModal(true);
                            }}
                            style={{
                              background: 'linear-gradient(135deg, var(--purple), var(--blue))',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                        </div>
                      ) : (
                        <span style={{
                          color: '#94A3B8',
                          fontSize: '0.875rem'
                        }}>
                          No images
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                                                <button
                          onClick={() => handleSolve(ticket)}
                          style={{
                            background: 'linear-gradient(135deg, var(--blue), var(--pink))',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Solve
                        </button>
                        <button
                          onClick={() => handleDelete(ticket)}
                          style={{
                            backgroundColor: 'var(--danger)',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedTicket && (
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
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0F172A',
                marginBottom: '1.5rem'
              }}>
                Edit Ticket
              </h2>
              <form onSubmit={handleUpdate}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  >
                    <option value="">Select Priority</option>
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  >
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.submittedBy}
                    onChange={(e) => setFormData({...formData, submittedBy: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif',
                      gridColumn: '1 / -1'
                    }}
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif',
                      gridColumn: '1 / -1',
                      resize: 'vertical'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Assigned To"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif',
                      gridColumn: '1 / -1'
                    }}
                  />
                  {formData.status === 'REJECTED' && (
                    <textarea
                      placeholder="Rejection Reason"
                      value={formData.rejectionReason}
                      onChange={(e) => setFormData({...formData, rejectionReason: e.target.value})}
                      rows="3"
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #E3E8EF',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'Manrope, sans-serif',
                        gridColumn: '1 / -1',
                        resize: 'vertical'
                      }}
                    />
                  )}
                  {formData.status === 'RESOLVED' && (
                    <textarea
                      placeholder="Resolution Notes"
                      value={formData.resolutionNotes}
                      onChange={(e) => setFormData({...formData, resolutionNotes: e.target.value})}
                      rows="3"
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #E3E8EF',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'Manrope, sans-serif',
                        gridColumn: '1 / -1',
                        resize: 'vertical'
                      }}
                    />
                  )}
                  
                  {/* Image Upload Section */}
                  <div style={{
                    gridColumn: '1 / -1'
                  }}>
                    <label style={{
                      display: 'block',
                      color: '#0F172A',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      fontFamily: 'Sora, sans-serif'
                    }}>
                      Upload Images (Optional)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setEditImages(files);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E3E8EF',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'Manrope, sans-serif'
                      }}
                    />
                    {editImages.length > 0 && (
                      <div style={{
                        marginTop: '0.5rem',
                        color: '#64748B',
                        fontSize: '0.875rem'
                      }}>
                        {editImages.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
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
                    type="submit"
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
                    Update Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedTicket && (
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
              maxWidth: '400px'
            }}>
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0F172A',
                marginBottom: '1rem'
              }}>
                Delete Ticket
              </h2>
              <p style={{
                color: '#475569',
                marginBottom: '1.5rem'
              }}>
                Are you sure you want to delete this ticket? This action cannot be undone.
              </p>
              <p style={{
                backgroundColor: '#EEF2F7',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                color: '#0F172A',
                fontWeight: '500'
              }}>
                {selectedTicket.title}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
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
                  onClick={handleDeleteConfirm}
                  style={{
                    backgroundColor: '#DC2626',
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
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Solve Modal */}
        {showSolveModal && selectedTicket && (
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
                Solve Ticket
              </h2>
              <p style={{
                color: '#475569',
                marginBottom: '1.5rem'
              }}>
                This will mark the ticket as resolved and send an email notification to the ticket submitter.
              </p>
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
                  Ticket: {selectedTicket.title}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  marginBottom: '0.5rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  Submitted by: {selectedTicket.submittedBy}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  Location: {selectedTicket.location}
                </div>
              </div>
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <label style={{
                  display: 'block',
                  color: '#0F172A',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  fontFamily: 'Sora, sans-serif'
                }}>
                  Email Message:
                </label>
                <textarea
                  value={solveMessage}
                  onChange={(e) => setSolveMessage(e.target.value)}
                  rows="4"
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
                  onClick={() => setShowSolveModal(false)}
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
                  onClick={handleSolveConfirm}
                  style={{
                    backgroundColor: '#059669',
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
                  Send Email & Solve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image View Modal */}
        {showImageModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1rem',
              width: '95%',
              maxWidth: '1200px',
              maxHeight: '95vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0 0.5rem'
              }}>
                <h2 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#0F172A',
                  margin: 0
                }}>
                  Ticket Images ({selectedImages.length})
                </h2>
                <button
                  onClick={() => setShowImageModal(false)}
                  style={{
                    backgroundColor: '#64748B',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
              
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 0.5rem'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {selectedImages.map((image, index) => (
                    <div key={index} style={{
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF'
                    }}>
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '250px',
                        backgroundColor: '#F8FAFC',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <img
                          src={`http://localhost:8080${image}`}
                          alt={`Ticket image ${index + 1}`}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                          }}
                          onClick={(e) => {
                            e.target.style.transform = e.target.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';
                          }}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGN0ZBIi8+CjxwYXRoIGQ9Ik04MCA4MEgxMjBWMTIwSDgwVjgwWiIgZmlsbD0iIzY0NzhiOCIvPgo8cGF0aCBkPSJNODAgMTAwSDEyMFYxMjBIODBWMTAwWiIgZmlsbD0iIzY0NzhiOCIvPgo8L3N2Zz4K';
                          }}
                        />
                      </div>
                      <div style={{
                        padding: '1rem',
                        backgroundColor: '#F8FAFC',
                        textAlign: 'center',
                        borderTop: '1px solid #E3E8EF'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#0F172A',
                          fontWeight: '600',
                          fontFamily: 'Sora, sans-serif',
                          marginBottom: '0.25rem'
                        }}>
                          Image {index + 1}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#64748B',
                          fontFamily: 'Manrope, sans-serif'
                        }}>
                          Click to zoom
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
