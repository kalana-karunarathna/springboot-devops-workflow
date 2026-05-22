import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    status: '',
    submittedBy: '',
    contactNumber: '',
    location: '',
    assignedTo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    'Maintenance',
    'IT Support', 
    'Cleaning',
    'Security',
    'Facilities',
    'Other'
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`/tickets/${id}`);
      if (response.data.success) {
        const ticket = response.data.data;
        setFormData({
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          submittedBy: ticket.submittedBy,
          contactNumber: ticket.contactNumber,
          location: ticket.location,
          assignedTo: ticket.assignedTo || ''
        });
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setErrors({ fetch: 'Failed to fetch ticket details' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.submittedBy.trim()) {
      newErrors.submittedBy = 'Email is required';
    } else if (!emailRegex.test(formData.submittedBy)) {
      newErrors.submittedBy = 'Invalid email format';
    }

    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!phoneRegex.test(formData.contactNumber.replace(/[\s-]/g, ''))) {
      newErrors.contactNumber = 'Contact number must be 10-15 digits';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(`/tickets/${id}`, formData);
      if (response.data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/tickets/workflow');
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Failed to update ticket. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Manrope, sans-serif',
        backgroundColor: '#F5F7FA',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ color: '#64748B' }}>Loading ticket details...</div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        padding: '2rem'
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
            Edit Support Ticket
          </h1>
          <p style={{
            color: '#64748B',
            fontSize: '1rem',
            margin: '0'
          }}>
            Update ticket information and status
          </p>
        </div>

        {/* Error Message */}
        {errors.fetch && (
          <div style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {errors.fetch}
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div style={{
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Ticket updated successfully!
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Title */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.title ? '2px solid #EF4444' : '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  {errors.title}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.category ? '2px solid #EF4444' : '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  {errors.category}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.description ? '2px solid #EF4444' : '1px solid #E3E8EF',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'Manrope, sans-serif',
                backgroundColor: '#FFFFFF',
                resize: 'vertical',
                minHeight: '100px',
                outline: 'none'
              }}
              placeholder="Detailed description of the issue..."
            />
            <div style={{
              color: '#64748B',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              fontFamily: 'Manrope, sans-serif'
            }}>
              {formData.description.length}/1000 characters
            </div>
            {errors.description && (
              <div style={{
                color: '#EF4444',
                fontSize: '0.875rem',
                marginTop: '0.25rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Priority */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.priority ? '2px solid #EF4444' : '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Select priority</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              {errors.priority && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  {errors.priority}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.status ? '2px solid #EF4444' : '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Select status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
              {errors.status && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  {errors.status}
                </div>
              )}
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Location */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.location ? '2px solid #EF4444' : '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                placeholder="Building, room, or area"
              />
              {errors.location && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  {errors.location}
                </div>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Assigned To
              </label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                placeholder="Assign to staff member"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="submittedBy"
                value={formData.submittedBy}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.submittedBy ? '2px solid #EF4444' : '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                placeholder="your.email@example.com"
              />
              {errors.submittedBy && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  {errors.submittedBy}
                </div>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.contactNumber ? '2px solid #EF4444' : '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                placeholder="+1234567890"
              />
              {errors.contactNumber && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  {errors.contactNumber}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/tickets/workflow')}
              style={{
                backgroundColor: '#EEF2F7',
                color: '#64748B',
                border: '1px solid #E3E8EF',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                fontFamily: 'Manrope, sans-serif',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                minWidth: '150px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#94A3B8' : '#D97706',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                fontFamily: 'Manrope, sans-serif',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                minWidth: '150px'
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
