package com.fms.tickets.repository;

import com.fms.tickets.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    
    // Find all comments for a specific ticket, ordered by creation date
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);
    
    // Find comments by author email
    List<Comment> findByAuthorEmail(String authorEmail);
    
    // Count comments for a specific ticket
    @Query(value = "{ 'ticket_id': ?0 }", count = true)
    long countByTicketId(String ticketId);
    
    // Delete all comments for a ticket (when ticket is deleted)
    void deleteByTicketId(String ticketId);
    
    // Find comments by author role
    List<Comment> findByAuthorRole(String authorRole);
}
