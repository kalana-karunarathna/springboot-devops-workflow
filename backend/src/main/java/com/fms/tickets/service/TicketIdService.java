package com.fms.tickets.service;

import com.fms.tickets.model.Ticket;
import com.fms.tickets.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketIdService {

    private final TicketRepository ticketRepository;

    /**
     * Generate next sequential ticket ID
     * Format: 1001, 1002, 1003, etc.
     */
    public synchronized String generateNextTicketId() {
        try {
            // Get all numeric ticket IDs
            List<Ticket> numericTickets = ticketRepository.findNumericTicketIds();
            
            if (numericTickets.isEmpty()) {
                return "1001";
            }
            
            // Find the maximum numeric ticket ID
            Long maxId = numericTickets.stream()
                .map(ticket -> {
                    try {
                        return Long.parseLong(ticket.getTicketId());
                    } catch (NumberFormatException e) {
                        return 0L;
                    }
                })
                .max(Comparator.naturalOrder())
                .orElse(0L);
            
            // If max ID is less than 1000, start from 1001
            if (maxId < 1000) {
                return "1001";
            }
            
            // Increment by 1
            return String.valueOf(maxId + 1);
            
        } catch (Exception e) {
            // If there's any error, default to 1001
            return "1001";
        }
    }
}
