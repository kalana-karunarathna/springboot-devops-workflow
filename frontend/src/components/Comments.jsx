import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Comments = ({ ticketId, currentUser, userRole }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/tickets/${ticketId}/comments`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/tickets/${ticketId}/comments`, {
        content: newComment,
        authorEmail: currentUser?.email || 'user@example.com',
        authorName: currentUser?.name || 'Anonymous User',
        authorRole: userRole || 'USER'
      });

      if (response.data.success) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await axios.put(`/tickets/${ticketId}/comments/${commentId}`, {
        content: editContent,
        userEmail: currentUser?.email || 'user@example.com',
        userRole: userRole || 'USER'
      });

      if (response.data.success) {
        setEditingComment(null);
        setEditContent('');
        fetchComments();
      }
    } catch (err) {
      setError('Failed to update comment');
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await axios.delete(`/tickets/${ticketId}/comments/${commentId}`, {
        headers: {
          'X-User-Email': currentUser?.email || 'user@example.com',
          'X-User-Role': userRole || 'USER'
        }
      });

      if (response.data.success) {
        fetchComments();
      }
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const canEditComment = (comment) => {
    return comment.authorEmail === currentUser?.email || 
           userRole === 'ADMIN' || 
           (userRole === 'TECHNICIAN' && comment.authorRole !== 'USER');
  };

  const canDeleteComment = (comment) => {
    return comment.authorEmail === currentUser?.email || 
           userRole === 'ADMIN' || 
           (userRole === 'TECHNICIAN' && comment.authorRole !== 'USER');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <div>Loading comments...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      border: '1px solid #E3E8EF', 
      borderRadius: '12px', 
      padding: '1.5rem',
      backgroundColor: '#FFFFFF',
      marginTop: '2rem'
    }}>
      <h3 style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span>💬</span> Comments ({comments.length})
      </h3>

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#F8FAFC',
        borderRadius: '8px'
      }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #E3E8EF',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'Manrope, sans-serif',
            resize: 'vertical',
            marginBottom: '0.75rem'
          }}
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          style={{
            backgroundColor: newComment.trim() ? '#2563EB' : '#94A3B8',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            fontFamily: 'Manrope, sans-serif',
            cursor: newComment.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Add Comment
        </button>
      </form>

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {comments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#64748B',
            fontSize: '0.875rem',
            fontFamily: 'Manrope, sans-serif'
          }}>
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{
              padding: '1rem',
              border: '1px solid #E3E8EF',
              borderRadius: '8px',
              backgroundColor: '#FAFBFC'
            }}>
              {/* Comment Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#0F172A',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '0.875rem'
                  }}>
                    {comment.authorName}
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#E3E8EF',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#64748B'
                    }}>
                      {comment.authorRole}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748B',
                    fontFamily: 'Manrope, sans-serif',
                    marginTop: '0.25rem'
                  }}>
                    {formatDate(comment.createdAt)}
                    {comment.isEdited && (
                      <span style={{ marginLeft: '0.5rem', fontStyle: 'italic' }}>
                        (edited)
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {canEditComment(comment) && (
                    <button
                      onClick={() => handleEditComment(comment)}
                      style={{
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              {editingComment === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #2563EB',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'Manrope, sans-serif',
                      resize: 'vertical',
                      marginBottom: '0.75rem'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      style={{
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
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
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  color: '#334155',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {comment.content}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
