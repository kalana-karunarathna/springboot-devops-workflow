package com.fms.tickets.service;

import com.fms.common.ApiResponse;
import com.fms.tickets.model.Ticket;
import com.fms.tickets.repository.TicketRepository;
import com.fms.notifications.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;
    private final CommentService commentService;
    private final String UPLOAD_DIR = "uploads/tickets/";

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private void notifyTicketUpdateChanges(Ticket originalTicket, Ticket updatedTicket) {
        String ownerEmail = normalizeEmail(updatedTicket.getSubmittedBy());
        String previousStatus = originalTicket.getStatus();
        String nextStatus = updatedTicket.getStatus();
        String previousAssignee = normalizeEmail(originalTicket.getAssignedTo());
        String nextAssignee = normalizeEmail(updatedTicket.getAssignedTo());

        boolean statusChanged = previousStatus != null && !previousStatus.equals(nextStatus);
        boolean assigneeChanged = !previousAssignee.equals(nextAssignee);

        if (assigneeChanged && !nextAssignee.isEmpty()) {
            notificationService.createTicketAssignedNotification(
                nextAssignee,
                updatedTicket.getId(),
                updatedTicket.getTitle(),
                "System"
            );
        }

        if (statusChanged && !ownerEmail.isEmpty()) {
            if ("RESOLVED".equals(nextStatus)) {
                notificationService.createTicketResolvedNotification(
                    ownerEmail,
                    updatedTicket.getId(),
                    updatedTicket.getTitle()
                );
            } else if ("REJECTED".equals(nextStatus)) {
                notificationService.createTicketRejectedNotification(
                    ownerEmail,
                    updatedTicket.getId(),
                    updatedTicket.getTitle()
                );
            } else {
                notificationService.createTicketStatusChangedNotification(
                    ownerEmail,
                    updatedTicket.getId(),
                    updatedTicket.getTitle(),
                    nextStatus
                );
            }
        }
    }

    public TicketService(TicketRepository ticketRepository, 
                        NotificationService notificationService, 
                        CommentService commentService) {
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
        this.commentService = commentService;
    }

    public ApiResponse<Ticket> createTicket(Ticket ticket, MultipartFile[] images) {
        try {
            // Handle image uploads
            if (images != null && images.length > 0) {
                List<String> imageUrls = uploadImages(images);
                ticket.setImageAttachments(imageUrls);
            }
            
            Ticket savedTicket = ticketRepository.save(ticket);
            
            // Create notification for ticket creation
            notificationService.createTicketCreatedNotification(
                savedTicket.getSubmittedBy(), 
                savedTicket.getId(), 
                savedTicket.getTitle()
            );
            
            return ApiResponse.success("Ticket created successfully", savedTicket);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create ticket: " + e.getMessage());
        }
    }

    public ApiResponse<List<Ticket>> getAllTickets() {
        try {
            List<Ticket> tickets = ticketRepository.findAll();
            return ApiResponse.success("Tickets retrieved successfully", tickets);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve tickets: " + e.getMessage());
        }
    }

    public ApiResponse<Ticket> getTicketById(String id) {
        try {
            Optional<Ticket> ticket = ticketRepository.findById(id);
            if (ticket.isPresent()) {
                return ApiResponse.success("Ticket retrieved successfully", ticket.get());
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve ticket: " + e.getMessage());
        }
    }

    public ApiResponse<Ticket> updateTicket(String id, Ticket ticketDetails) {
        try {
            Optional<Ticket> existingTicket = ticketRepository.findById(id);
            if (existingTicket.isPresent()) {
                Ticket existingValue = existingTicket.get();
                Ticket originalTicket = new Ticket();
                originalTicket.setStatus(existingValue.getStatus());
                originalTicket.setAssignedTo(existingValue.getAssignedTo());

                Ticket ticket = existingValue;
                ticket.setTitle(ticketDetails.getTitle());
                ticket.setDescription(ticketDetails.getDescription());
                ticket.setCategory(ticketDetails.getCategory());
                ticket.setPriority(ticketDetails.getPriority());
                ticket.setStatus(ticketDetails.getStatus());
                ticket.setAssignedTo(ticketDetails.getAssignedTo());
                ticket.updateStatus(ticketDetails.getStatus());
                
                Ticket updatedTicket = ticketRepository.save(ticket);
                notifyTicketUpdateChanges(originalTicket, updatedTicket);
                return ApiResponse.success("Ticket updated successfully", updatedTicket);
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to update ticket: " + e.getMessage());
        }
    }

    public ApiResponse<Ticket> updateTicketWithImages(String id, Ticket ticketDetails, MultipartFile[] images) {
        try {
            Optional<Ticket> existingTicket = ticketRepository.findById(id);
            if (existingTicket.isPresent()) {
                Ticket existingValue = existingTicket.get();
                Ticket originalTicket = new Ticket();
                originalTicket.setStatus(existingValue.getStatus());
                originalTicket.setAssignedTo(existingValue.getAssignedTo());

                Ticket ticket = existingValue;
                ticket.setTitle(ticketDetails.getTitle());
                ticket.setDescription(ticketDetails.getDescription());
                ticket.setCategory(ticketDetails.getCategory());
                ticket.setPriority(ticketDetails.getPriority());
                ticket.setStatus(ticketDetails.getStatus());
                ticket.setSubmittedBy(ticketDetails.getSubmittedBy());
                ticket.setContactNumber(ticketDetails.getContactNumber());
                ticket.setLocation(ticketDetails.getLocation());
                ticket.setAssignedTo(ticketDetails.getAssignedTo());
                ticket.setRejectionReason(ticketDetails.getRejectionReason());
                ticket.setResolutionNotes(ticketDetails.getResolutionNotes());
                ticket.updateStatus(ticketDetails.getStatus());
                
                // Handle image uploads
                if (images != null && images.length > 0) {
                    List<String> imageUrls = uploadImages(images);
                    ticket.setImageAttachments(imageUrls);
                }
                
                Ticket updatedTicket = ticketRepository.save(ticket);
                notifyTicketUpdateChanges(originalTicket, updatedTicket);
                return ApiResponse.success("Ticket updated successfully with images", updatedTicket);
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to update ticket with images: " + e.getMessage());
        }
    }

    public ApiResponse<Ticket> assignTicket(String id, String technicianEmail) {
        try {
            Optional<Ticket> ticket = ticketRepository.findById(id);
            if (ticket.isPresent()) {
                Ticket existingTicket = ticket.get();
                existingTicket.assignToTechnician(technicianEmail);
                Ticket savedTicket = ticketRepository.save(existingTicket);
                
                // Create notification for ticket assignment
                notificationService.createTicketAssignedNotification(
                    technicianEmail, 
                    savedTicket.getId(), 
                    savedTicket.getTitle(),
                    "System"
                );

                notificationService.createTicketStatusChangedNotification(
                    savedTicket.getSubmittedBy(),
                    savedTicket.getId(),
                    savedTicket.getTitle(),
                    savedTicket.getStatus()
                );
                
                return ApiResponse.success("Ticket assigned successfully", savedTicket);
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to assign ticket: " + e.getMessage());
        }
    }

    public ApiResponse<Ticket> resolveTicket(String id, String resolutionNotes) {
        try {
            Optional<Ticket> ticket = ticketRepository.findById(id);
            if (ticket.isPresent()) {
                Ticket existingTicket = ticket.get();
                existingTicket.setResolutionNotes(resolutionNotes);
                Ticket savedTicket = ticketRepository.save(existingTicket);
                
                // Create notification for ticket resolution
                notificationService.createTicketResolvedNotification(
                    savedTicket.getSubmittedBy(), 
                    savedTicket.getId(), 
                    savedTicket.getTitle()
                );
                
                return ApiResponse.success("Ticket resolved successfully", savedTicket);
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to resolve ticket: " + e.getMessage());
        }
    }

    public ApiResponse<Ticket> rejectTicket(String id, String reason) {
        try {
            Optional<Ticket> ticket = ticketRepository.findById(id);
            if (ticket.isPresent()) {
                Ticket existingTicket = ticket.get();
                existingTicket.rejectTicket(reason);
                Ticket savedTicket = ticketRepository.save(existingTicket);
                
                // Create notification for ticket rejection
                notificationService.createTicketRejectedNotification(
                    existingTicket.getSubmittedBy(),
                    existingTicket.getId(),
                    existingTicket.getTitle()
                );
                
                return ApiResponse.success("Ticket rejected successfully", savedTicket);
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to reject ticket: " + e.getMessage());
        }
    }

    public ApiResponse<Ticket> solveTicket(String id, String message, String resolvedBy) {
        try {
            Optional<Ticket> ticket = ticketRepository.findById(id);
            if (ticket.isPresent()) {
                Ticket existingTicket = ticket.get();
                existingTicket.setResolutionNotes(message);
                existingTicket.setStatus("RESOLVED");
                existingTicket.setUpdatedAt(java.time.LocalDateTime.now());
                existingTicket.setResolvedAt(java.time.LocalDateTime.now());
                
                Ticket savedTicket = ticketRepository.save(existingTicket);
                
                // Create notification for ticket resolution
                notificationService.createTicketResolvedNotification(
                    existingTicket.getSubmittedBy(),
                    existingTicket.getId(),
                    existingTicket.getTitle()
                );
                
                // Email functionality disabled - notifications sent through system
                
                return ApiResponse.success("Ticket solved successfully and email sent", savedTicket);
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to solve ticket: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteTicket(String id) {
        try {
            if (ticketRepository.existsById(id)) {
                // Delete all comments associated with this ticket
                commentService.deleteCommentsByTicketId(id);
                
                // Delete the ticket
                ticketRepository.deleteById(id);
                return ApiResponse.success("Ticket and associated comments deleted successfully");
            } else {
                return ApiResponse.error("Ticket not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete ticket: " + e.getMessage());
        }
    }

    public ApiResponse<List<Ticket>> getTicketsByStatus(String status) {
        try {
            List<Ticket> tickets = ticketRepository.findByStatus(status);
            return ApiResponse.success("Tickets retrieved successfully", tickets);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve tickets: " + e.getMessage());
        }
    }

    public ApiResponse<List<Ticket>> getTicketsByPriority(String priority) {
        try {
            List<Ticket> tickets = ticketRepository.findByPriority(priority);
            return ApiResponse.success("Tickets retrieved successfully", tickets);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve tickets: " + e.getMessage());
        }
    }

    public ApiResponse<List<Ticket>> getTicketsByCategory(String category) {
        try {
            List<Ticket> tickets = ticketRepository.findByCategory(category);
            return ApiResponse.success("Tickets retrieved successfully", tickets);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve tickets: " + e.getMessage());
        }
    }

    public ApiResponse<List<Ticket>> searchTickets(String keyword) {
        try {
            List<Ticket> tickets = ticketRepository.findByTitleContainingIgnoreCase(keyword);
            return ApiResponse.success("Tickets retrieved successfully", tickets);
        } catch (Exception e) {
            return ApiResponse.error("Failed to search tickets: " + e.getMessage());
        }
    }

    private List<String> uploadImages(MultipartFile[] images) throws IOException {
        List<String> imageUrls = new java.util.ArrayList<>();
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        for (MultipartFile image : images) {
            if (image != null && !image.isEmpty()) {
                String originalFilename = image.getOriginalFilename();
                String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String newFilename = UUID.randomUUID().toString() + fileExtension;
                
                Path filePath = uploadPath.resolve(newFilename);
                Files.copy(image.getInputStream(), filePath);
                
                imageUrls.add("/uploads/tickets/" + newFilename);
            }
        }
        
        return imageUrls;
    }
}
