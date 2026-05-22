import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ResourceCatalogue = () => {
  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
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
    filterSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      alignItems: 'end',
      marginBottom: '2rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: 'var(--text-body)',
      fontSize: '0.9rem'
    },
    input: {
      padding: '0.75rem',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      background: 'var(--bg-soft)',
      color: 'var(--text-heading)'
    },
    inputFocus: {
      borderColor: 'rgba(29, 158, 117, 0.42)',
      boxShadow: '0 0 0 3px rgba(29, 158, 117, 0.12)',
      transform: 'translateY(-1px)'
    },
    button: {
      padding: '0.75rem 1.5rem',
      border: '1px solid transparent',
      borderRadius: '14px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'Manrope, sans-serif'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, var(--blue), var(--pink))',
      color: '#FFFFFF',
      boxShadow: '0 12px 24px rgba(29, 158, 117, 0.18)'
    },
    primaryButtonHover: {
      background: 'linear-gradient(135deg, var(--blue-hover), #2f8f65)',
      transform: 'translateY(-2px)',
      boxShadow: '0 16px 28px rgba(29, 158, 117, 0.22)'
    },
    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.82)',
      color: 'var(--text-body)',
      border: '1px solid var(--border)'
    },
    secondaryButtonHover: {
      background: 'var(--bg-subtle)',
      borderColor: 'var(--border-hover)'
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
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    resourceCardHover: {
      transform: 'translateY(-5px)',
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
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: 'var(--text-heading)',
      margin: '0',
      fontFamily: 'Sora, sans-serif'
    },
    resourceDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    resourceDetail: {
      fontSize: '0.9rem',
      color: 'var(--text-body)',
      lineHeight: 1.6
    },
    statusActive: {
      color: '#177a5d',
      fontWeight: 'bold',
      background: 'rgba(29, 158, 117, 0.12)',
      padding: '0.25rem 0.5rem',
      borderRadius: '20px',
      fontSize: '0.8rem'
    },
    statusOutOfService: {
      color: '#e53e3e',
      fontWeight: 'bold',
      background: '#fed7d7',
      padding: '0.25rem 0.5rem',
      borderRadius: '20px',
      fontSize: '0.8rem'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1.2rem',
      color: 'var(--text-muted)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: 'var(--text-muted)',
      fontSize: '1.1rem'
    },
  };
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [capacitySortOrder, setCapacitySortOrder] = useState(''); // '', 'asc', 'desc'
  
  // Dropdown options
  const [types] = useState(['Lecture Hall', 'Lab', 'Meeting Room', 'Equipment']);
  const [capacities] = useState(['None', 10, 50, 100, 200]);
  const [locations] = useState(['Engineering Building', 'Business Management Building', 'New Building', 'Main Building']);
  const [statuses] = useState(['Active', 'Out Of Service']);

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

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterCapacity('');
    setFilterLocation('');
    setFilterStatus('');
    setCapacitySortOrder('');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Resource Catalogue</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, fontFamily: 'Manrope, sans-serif' }}>Browse and search available campus resources</p>
      </div>
      
      {/* Search and Filter */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Search Resources</h2>
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
        <h2 style={styles.sectionTitle}>Available Resources ({resources.length})</h2>
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
              </div>
            ))}
          </div>
        )}
      </div>

          </div>
  );
};

export default ResourceCatalogue;
