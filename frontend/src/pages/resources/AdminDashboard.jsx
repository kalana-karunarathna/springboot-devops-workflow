import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  // Styles
  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Manrope, sans-serif',
      background: 'var(--page-radial), var(--bg-page)',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%)',
      color: 'white',
      borderRadius: '28px',
      boxShadow: 'var(--shadow-card)'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      margin: '0 0 0.5rem 0',
      color: 'white',
      fontFamily: 'Sora, sans-serif'
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.9)',
      margin: '0 0 1rem 0',
      fontFamily: 'Manrope, sans-serif'
    },
    section: {
      background: 'rgba(255, 255, 255, 0.92)',
      borderRadius: '24px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-soft)',
      border: '1px solid var(--border)'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: 'var(--text-heading)',
      fontFamily: 'Sora, sans-serif',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid rgba(29, 158, 117, 0.2)'
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1'
    },
    label: {
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: 'var(--text-body)',
      fontSize: '0.875rem',
      fontFamily: 'Manrope, sans-serif'
    },
    input: {
      padding: '0.75rem 1rem',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: 'var(--bg-soft)',
      fontFamily: 'Manrope, sans-serif'
    },
    inputFocus: {
      borderColor: 'rgba(29, 158, 117, 0.42)',
      boxShadow: '0 0 0 3px rgba(29, 158, 117, 0.12)',
      transform: 'translateY(-1px)'
    },
    textarea: {
      padding: '0.75rem 1rem',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical',
      backgroundColor: 'var(--bg-soft)',
      fontFamily: 'Manrope, sans-serif'
    },
    textareaFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      transform: 'translateY(-1px)'
    },
    button: {
      padding: '0.75rem 1.5rem',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Manrope, sans-serif'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, var(--blue), var(--pink))',
      color: '#FFFFFF',
      border: '1px solid transparent'
    },
    primaryButtonHover: {
      background: 'linear-gradient(135deg, var(--blue-hover), #2f8f65)',
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 24px rgba(29, 158, 117, 0.18)'
    },
    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.84)',
      color: 'var(--text-body)',
      border: '1px solid var(--border)'
    },
    secondaryButtonHover: {
      background: 'var(--bg-subtle)',
      borderColor: 'var(--border-hover)'
    },
    dangerButton: {
      background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(245, 101, 101, 0.3)'
    },
    dangerButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(245, 101, 101, 0.4)'
    },
    filterSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      alignItems: 'end'
    },
    resourceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    resourceCard: {
      background: 'rgba(255, 255, 255, 0.92)',
      borderRadius: '22px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-soft)',
      border: '1px solid var(--border)',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    resourceCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-card)',
      borderColor: 'var(--border-hover)'
    },
    resourceHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '1rem'
    },
    resourceTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--text-heading)',
      margin: '0',
      fontFamily: 'Sora, sans-serif'
    },
    resourceDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    resourceDetail: {
      fontSize: '0.875rem',
      color: 'var(--text-body)',
      fontFamily: 'Manrope, sans-serif'
    },
    statusActive: {
      color: '#177a5d',
      fontWeight: '600',
      background: 'rgba(29, 158, 117, 0.12)',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontFamily: 'Manrope, sans-serif'
    },
    statusOutOfService: {
      color: '#e53e3e',
      fontWeight: '500',
      background: '#fed7d7',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontFamily: 'Manrope, sans-serif'
    },
    resourceActions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000'
    },
    modalContent: {
      background: 'rgba(255,255,255,0.96)',
      borderRadius: '24px',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1rem',
      color: 'var(--text-muted)',
      fontFamily: 'Manrope, sans-serif'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: 'var(--text-muted)',
      fontSize: '1rem',
      fontFamily: 'Manrope, sans-serif'
    },
    error: {
      color: '#b42318',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
      padding: '0.5rem',
      borderRadius: '8px',
      background: '#fff4f4',
      fontFamily: 'Manrope, sans-serif'
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '2rem'
    },
    statItem: {
      textAlign: 'center',
      padding: '1rem',
      background: 'rgba(247, 252, 248, 0.9)',
      borderRadius: '18px',
      border: '1px solid var(--border)'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--blue)',
      marginBottom: '0.5rem',
      fontFamily: 'Sora, sans-serif'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: 'var(--text-muted)',
      fontFamily: 'Manrope, sans-serif'
    }
  };
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [capacitySortOrder, setCapacitySortOrder] = useState(''); // '', 'asc', 'desc'
  
  // Dropdown options
  const [types] = useState(['Lecture Hall', 'Lab', 'Meeting Room', 'Equipment']);
  const [capacities] = useState(['None', 10, 50, 100, 200]);
  const [locations] = useState(['Engineering Building', 'Business Management Building', 'New Building', 'Main Building']);
  const [statuses] = useState(['Active', 'Out Of Service']);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Lecture Hall',
    capacity: 'None',
    location: 'Engineering Building',
    status: 'Active',
    description: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm || filterType || filterCapacity || filterLocation || filterStatus) {
        handleSearch();
      } else {
        fetchResources();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filterType, filterCapacity, filterLocation, filterStatus, capacitySortOrder]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources');
      
      let sortedResources = response.data;
      
      // Apply capacity sorting if selected
      if (capacitySortOrder) {
        sortedResources = [...response.data].sort((a, b) => {
          // Handle null/None capacity values
          const capacityA = a.capacity === null || a.capacity === 'None' ? -1 : parseInt(a.capacity);
          const capacityB = b.capacity === null || b.capacity === 'None' ? -1 : parseInt(b.capacity);
          
          if (capacitySortOrder === 'asc') {
            return capacityA - capacityB;
          } else if (capacitySortOrder === 'desc') {
            return capacityB - capacityA;
          }
          return 0;
        });
      }
      
      setResources(sortedResources);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (filterType) params.append('type', filterType);
      if (filterCapacity) params.append('capacity', filterCapacity);
      if (filterLocation) params.append('location', filterLocation);
      if (filterStatus) params.append('status', filterStatus);
      
      const response = await api.get(`/resources/search?${params}`);
      
      let sortedResources = response.data;
      
      // Apply capacity sorting if selected
      if (capacitySortOrder) {
        sortedResources = [...response.data].sort((a, b) => {
          // Handle null/None capacity values
          const capacityA = a.capacity === null || a.capacity === 'None' ? -1 : parseInt(a.capacity);
          const capacityB = b.capacity === null || b.capacity === 'None' ? -1 : parseInt(b.capacity);
          
          if (capacitySortOrder === 'asc') {
            return capacityA - capacityB;
          } else if (capacitySortOrder === 'desc') {
            return capacityB - capacityA;
          }
          return 0;
        });
      }
      
      setResources(sortedResources);
      setLoading(false);
    } catch (error) {
      console.error('Error searching resources:', error);
      toast.error('Failed to search resources');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called - selectedResource:', selectedResource);
    console.log('handleSubmit called - formData:', formData);
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      // Convert "None" to null for backend
      const submissionData = {
        ...formData,
        capacity: formData.capacity === 'None' ? null : formData.capacity
      };
      
      if (selectedResource) {
        console.log('Updating existing resource with ID:', selectedResource.id);
        // Update existing resource
        await api.put(`/resources/${selectedResource.id}`, submissionData);
        toast.success('Resource updated successfully');
        setShowEditModal(false);
      } else {
        console.log('Creating new resource');
        // Create new resource
        await api.post('/resources', submissionData);
        toast.success('Resource are successfully uploaded');
        resetForm();
      }
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error(error.response?.data?.message || 'Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    console.log('handleEdit called with resource:', resource);
    setSelectedResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity === null ? 'None' : resource.capacity,
      location: resource.location,
      status: resource.status,
      description: resource.description || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/resources/${id}`);
        toast.success('Resource deleted successfully');
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        toast.error('Failed to delete resource');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Resource name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Resource name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Resource name must be less than 100 characters';
    }
    
    // Type validation
    if (!formData.type || formData.type === '') {
      errors.type = 'Resource type is required';
    }
    
    // Location validation
    if (!formData.location || formData.location === '') {
      errors.location = 'Location is required';
    }
    
    // Status validation
    if (!formData.status || formData.status === '') {
      errors.status = 'Status is required';
    }
    
    // Description validation (optional but if provided, should be reasonable)
    if (formData.description && formData.description.trim()) {
      const descLength = formData.description.trim().length;
      if (descLength < 5) {
        errors.description = 'Description must be at least 5 characters if provided';
      } else if (descLength > 500) {
        errors.description = 'Description must be less than 500 characters';
      } else if (!/^[a-zA-Z0-9\s.,!?()-]+$/.test(formData.description.trim())) {
        errors.description = 'Description contains invalid characters. Only letters, numbers, spaces, and .,!?-() are allowed';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    console.log('resetForm called - clearing selectedResource');
    setFormData({
      name: '',
      type: 'Lecture Hall',
      capacity: 'None',
      location: 'Engineering Building',
      status: 'Active',
      description: ''
    });
    setSelectedResource(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterCapacity('');
    setFilterLocation('');
    setFilterStatus('');
    setCapacitySortOrder('');
  };

  const closeModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard - Resource Management</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Manage and monitor all campus resources</p>
      </div>
      
      {/* Add Resource Form */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Add New Resource</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                ...styles.input,
                ...(formErrors.name ? styles.inputError : {})
              }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
            {formErrors.name && (
              <div style={styles.error}>{formErrors.name}</div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              style={{
                ...styles.input,
                ...(formErrors.type ? styles.inputError : {})
              }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {formErrors.type && (
              <div style={styles.error}>{formErrors.type}</div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Capacity *</label>
            <select
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              {capacities.map(capacity => (
                <option key={capacity} value={capacity}>{capacity === 'None' ? 'None' : `${capacity} persons`}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              style={{
                ...styles.input,
                ...(formErrors.location ? styles.inputError : {})
              }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            {formErrors.location && (
              <div style={styles.error}>{formErrors.location}</div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              style={{
                ...styles.input,
                ...(formErrors.status ? styles.inputError : {})
              }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {formErrors.status && (
              <div style={styles.error}>{formErrors.status}</div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Description <span style={{ color: '#64748B', fontWeight: '400' }}>(Optional)</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter resource description (5-500 characters, optional)"
              style={{
                ...styles.textarea,
                ...(formErrors.description ? styles.inputError : {})
              }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '0.25rem'
            }}>
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#64748B',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {formData.description.trim().length === 0 
                  ? 'Optional: Add a brief description of the resource'
                  : formData.description.trim().length < 5
                  ? 'Description must be at least 5 characters'
                  : `${formData.description.trim().length}/500 characters used`
                }
              </span>
              {formData.description.trim().length > 0 && (
                <span style={{
                  fontSize: '0.75rem',
                  color: formData.description.trim().length > 500 ? '#e53e3e' : 
                         formData.description.trim().length < 5 ? '#e53e3e' : '#38a169',
                  fontWeight: '500'
                }}>
                  {formData.description.trim().length > 500 ? 'Too long' :
                   formData.description.trim().length < 5 ? 'Too short' : 'Valid'}
                </span>
              )}
            </div>
            {formErrors.description && (
              <div style={styles.error}>{formErrors.description}</div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <button 
              type="submit" 
              style={{...styles.button, ...styles.primaryButton}}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.primaryButtonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.primaryButton)}
            >
              {selectedResource ? 'Update Resource' : 'Add Resource'}
            </button>
          </div>
          
          {selectedResource && (
            <div style={styles.formGroup}>
              <button 
                type="button" 
                onClick={resetForm}
                style={{...styles.button, ...styles.secondaryButton}}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.secondaryButtonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.secondaryButton)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Search and Filter */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Search and Filter Resources</h2>
        <div style={styles.filterSection}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Search</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Capacity</label>
            <select
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              <option value="">All Capacities</option>
              {capacities.map(capacity => (
                <option key={capacity} value={capacity}>{capacity === 'None' ? 'None' : `${capacity} persons`}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Sort by Capacity</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setCapacitySortOrder(capacitySortOrder === 'asc' ? '' : 'asc')}
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  ...(capacitySortOrder === 'asc' ? styles.primaryButton : {}),
                  fontSize: '0.75rem',
                  padding: '0.5rem 1rem'
                }}
                onMouseEnter={(e) => {
                  if (capacitySortOrder !== 'asc') {
                    Object.assign(e.target.style, styles.secondaryButtonHover);
                  } else {
                    Object.assign(e.target.style, styles.primaryButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (capacitySortOrder !== 'asc') {
                    Object.assign(e.target.style, styles.secondaryButton);
                  } else {
                    Object.assign(e.target.style, styles.primaryButton);
                  }
                }}
              >
                {capacitySortOrder === 'asc' ? 'Ascending' : 'Ascending'}
              </button>
              <button
                type="button"
                onClick={() => setCapacitySortOrder(capacitySortOrder === 'desc' ? '' : 'desc')}
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  ...(capacitySortOrder === 'desc' ? styles.primaryButton : {}),
                  fontSize: '0.75rem',
                  padding: '0.5rem 1rem'
                }}
                onMouseEnter={(e) => {
                  if (capacitySortOrder !== 'desc') {
                    Object.assign(e.target.style, styles.secondaryButtonHover);
                  } else {
                    Object.assign(e.target.style, styles.primaryButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (capacitySortOrder !== 'desc') {
                    Object.assign(e.target.style, styles.secondaryButton);
                  } else {
                    Object.assign(e.target.style, styles.primaryButton);
                  }
                }}
              >
                {capacitySortOrder === 'desc' ? 'Descending' : 'Descending'}
              </button>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <button 
              type="button" 
              onClick={clearFilters}
              style={{...styles.button, ...styles.secondaryButton}}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.secondaryButtonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.secondaryButton)}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Resources ({resources.length})</h2>
        {loading ? (
          <div style={styles.loading}>
            <div>Loading resources...</div>
          </div>
        ) : resources.length === 0 ? (
          <div style={styles.emptyState}>
            <div>No resources found</div>
          </div>
        ) : (
          <div style={styles.resourceGrid}>
            {resources.map(resource => (
              <div 
                key={resource.id} 
                style={styles.resourceCard}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.resourceCardHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.resourceCard)}
              >
                <div style={styles.resourceHeader}>
                  <h3 style={styles.resourceTitle}>{resource.name}</h3>
                  <span style={resource.status === 'Active' ? styles.statusActive : styles.statusOutOfService}>
                    {resource.status}
                  </span>
                </div>
                <div style={styles.resourceDetails}>
                  <div style={styles.resourceDetail}>
                    <strong>Type:</strong> {resource.type}
                  </div>
                  <div style={styles.resourceDetail}>
                    <strong>Capacity:</strong> {resource.capacity === null ? 'None' : `${resource.capacity} persons`}
                  </div>
                  <div style={styles.resourceDetail}>
                    <strong>Location:</strong> {resource.location}
                  </div>
                  <div style={styles.resourceDetail}>
                    <strong>Status:</strong> {resource.status}
                  </div>
                </div>
                {resource.description && (
                  <div style={{...styles.resourceDetail, marginBottom: '1rem'}}>
                    <strong>Description:</strong> {resource.description}
                  </div>
                )}
                <div style={styles.resourceActions}>
                  <button 
                    onClick={() => handleEdit(resource)}
                    style={{...styles.button, ...styles.primaryButton}}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.primaryButtonHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, styles.primaryButton)}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(resource.id)}
                    style={{...styles.button, ...styles.dangerButton}}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.dangerButtonHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, styles.dangerButton)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.sectionTitle}>Edit Resource</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Capacity *</label>
                <select
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                >
                  {capacities.map(capacity => (
                    <option key={capacity} value={capacity}>{capacity === 'None' ? 'None' : `${capacity} persons`}</option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
                />
              </div>
              
              <div style={styles.formGroup}>
                <button 
                  type="submit"
                  style={{...styles.button, ...styles.primaryButton}}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.primaryButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, styles.primaryButton)}
                >
                  Update Resource
                </button>
              </div>
              
              <div style={styles.formGroup}>
                <button 
                  type="button" 
                  onClick={closeModal}
                  style={{...styles.button, ...styles.secondaryButton}}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.secondaryButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, styles.secondaryButton)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
