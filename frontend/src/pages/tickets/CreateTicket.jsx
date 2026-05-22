import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    submittedBy: '',
    contactNumber: '',
    location: ''
  });

  const [ticketId, setTicketId] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch next ticket ID from backend
  const fetchNextTicketId = async () => {
    try {
      const response = await axios.get('/tickets/next-id');
      if (response.data.success) {
        setTicketId(response.data.ticketId);
      }
    } catch (err) {
      console.error('Error fetching next ticket ID:', err);
      // Fallback to simple sequential ID
      setTicketId('1001');
    }
  };

  // Fetch ticket ID on component mount
  useEffect(() => {
    fetchNextTicketId();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      submittedBy: user?.email?.trim?.().toLowerCase?.() || ''
    }));
  }, [user]);

  const categories = [
    'Maintenance',
    'IT Support', 
    'Cleaning',
    'Security',
    'Facilities',
    'Other'
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Priority validation
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    // Email is pre-filled and read-only, no validation needed

    // Contact number validation
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!phoneRegex.test(formData.contactNumber.replace(/[\s-]/g, ''))) {
      newErrors.contactNumber = 'Contact number must be 10-15 digits';
    }

    // Location validation
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

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 3 images allowed'
      }));
      return;
    }

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          images: 'Only JPEG, PNG, and GIF images are allowed'
        }));
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          images: 'Image size must be less than 5MB'
        }));
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // Clear image errors
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Append individual form fields
      formDataToSend.append('ticketId', ticketId);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('submittedBy', formData.submittedBy);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('location', formData.location);
      
      // Append images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await axios.post('/tickets', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/tickets/workflow');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Failed to create ticket. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '900px',
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
            Create Support Ticket
          </h1>
          <p style={{
            color: '#64748B',
            fontSize: '1rem',
            margin: '0'
          }}>
            Submit a ticket for maintenance, IT support, or other facility issues
          </p>
        </div>

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
            Ticket created successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
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
          {/* Ticket ID Input Field */}
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '2px solid #059669',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <label style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              color: '#059669',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              🎫 Ticket ID (Auto-Generated)
            </label>
            <input
                type="text"
                value={ticketId}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #059669',
                  borderRadius: '8px',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  fontFamily: 'Sora, sans-serif',
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                  letterSpacing: '0.05em',
                  outline: 'none'
                }}
              />
          </div>

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

          {/* Image Upload Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Attach Images (Max 3, Max 5MB each)
            </label>
            <div style={{
              border: '2px dashed #E3E8EF',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: 'none'
                }}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={{
                cursor: 'pointer',
                display: 'block'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  color: '#94A3B8'
                }}>
                  ð
                </div>
                <div style={{
                  color: '#475569',
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  Click to upload images or drag and drop
                </div>
                <div style={{
                  color: '#94A3B8',
                  fontSize: '0.875rem',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  PNG, JPG, GIF up to 5MB each
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #E3E8EF'
                  }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.images && (
              <div style={{
                color: '#EF4444',
                fontSize: '0.875rem',
                marginTop: '0.25rem',
                fontFamily: 'Manrope, sans-serif'
              }}>
                {errors.images}
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
                fontFamily: 'Manrope, sans-serif',
                fontWeight: '600',
                color: '#0F172A',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Email (Auto-filled)
              </label>
              <input
                type="email"
                name="submittedBy"
                value={formData.submittedBy}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E3E8EF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'Manrope, sans-serif',
                  backgroundColor: '#F8FAFC',
                  outline: 'none'
                }}
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

          {/* Submit Button */}
          <div style={{ textAlign: 'center' }}>
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
                minWidth: '200px'
              }}
            >
              {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
