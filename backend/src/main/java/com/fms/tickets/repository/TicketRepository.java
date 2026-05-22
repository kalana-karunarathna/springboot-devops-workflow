package com.fms.tickets.repository;

import com.fms.tickets.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByStatus(String status);
    List<Ticket> findByPriority(String priority);
    List<Ticket> findByCategory(String category);
    List<Ticket> findBySubmittedBy(String submittedBy);
    List<Ticket> findByAssignedTo(String assignedTo);
    List<Ticket> findByLocationContainingIgnoreCase(String location);
    List<Ticket> findByTitleContainingIgnoreCase(String title);
    
    // Find maximum numeric ticket ID
    @Query(value = "{}", fields = "{ 'ticketId' : 1 }")
    List<Ticket> findAllTicketIds();
    
    // Custom query to find max numeric ticket ID
    @Query(value = "{ 'ticketId' : { '$regex' : '^\\d+$' } }", fields = "{ 'ticketId' : 1 }")
    List<Ticket> findNumericTicketIds();
}
