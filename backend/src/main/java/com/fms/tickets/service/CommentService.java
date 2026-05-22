package com.fms.tickets.service;

import com.fms.common.ApiResponse;
import com.fms.notifications.service.NotificationService;
import com.fms.tickets.model.Comment;
import com.fms.tickets.model.Ticket;
import com.fms.tickets.repository.CommentRepository;
import com.fms.tickets.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    public ApiResponse<Comment> createComment(String ticketId, String authorEmail, String authorName, String content, String authorRole) {
        try {
            // Verify ticket exists
            Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isEmpty()) {
                return ApiResponse.error("Ticket not found");
            }

            Ticket ticket = ticketOpt.get();

            // Create new comment
            String normalizedAuthorEmail = normalizeEmail(authorEmail);
            Comment comment = new Comment(ticketId, normalizedAuthorEmail, authorName, content, authorRole);
            Comment savedComment = commentRepository.save(comment);

            Set<String> recipientEmails = new LinkedHashSet<>();
            recipientEmails.add(normalizeEmail(ticket.getSubmittedBy()));
            if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().trim().isEmpty()) {
                recipientEmails.add(normalizeEmail(ticket.getAssignedTo()));
            }
            recipientEmails.remove(normalizedAuthorEmail);

            for (String recipientEmail : recipientEmails) {
                if (!recipientEmail.isEmpty()) {
                    notificationService.createTicketCommentNotification(
                        recipientEmail,
                        ticket.getId(),
                        ticket.getTitle(),
                        authorName
                    );
                }
            }

            return ApiResponse.success("Comment created successfully", savedComment);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create comment: " + e.getMessage());
        }
    }

    public ApiResponse<List<Comment>> getCommentsByTicketId(String ticketId) {
        try {
            // Verify ticket exists
            if (!ticketRepository.existsById(ticketId)) {
                return ApiResponse.error("Ticket not found");
            }

            List<Comment> comments = commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
            return ApiResponse.success("Comments retrieved successfully", comments);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve comments: " + e.getMessage());
        }
    }

    public ApiResponse<Comment> updateComment(String commentId, String userEmail, String userRole, String newContent) {
        try {
            Optional<Comment> commentOpt = commentRepository.findById(commentId);
            if (commentOpt.isPresent()) {
                Comment comment = commentOpt.get();

                // Check if user can edit this comment
                if (!comment.canEdit(userEmail, userRole)) {
                    return ApiResponse.error("You don't have permission to edit this comment");
                }

                // Update comment content
                comment.updateContent(newContent);
                Comment updatedComment = commentRepository.save(comment);

                return ApiResponse.success("Comment updated successfully", updatedComment);
            } else {
                return ApiResponse.error("Comment not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to update comment: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteComment(String commentId, String userEmail, String userRole) {
        try {
            Optional<Comment> commentOpt = commentRepository.findById(commentId);
            if (commentOpt.isPresent()) {
                Comment comment = commentOpt.get();

                // Check if user can delete this comment
                if (!comment.canDelete(userEmail, userRole)) {
                    return ApiResponse.error("You don't have permission to delete this comment");
                }

                commentRepository.deleteById(commentId);
                return ApiResponse.success("Comment deleted successfully");
            } else {
                return ApiResponse.error("Comment not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete comment: " + e.getMessage());
        }
    }

    public ApiResponse<Comment> getCommentById(String commentId) {
        try {
            Optional<Comment> comment = commentRepository.findById(commentId);
            if (comment.isPresent()) {
                return ApiResponse.success("Comment retrieved successfully", comment.get());
            } else {
                return ApiResponse.error("Comment not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve comment: " + e.getMessage());
        }
    }

    public void deleteCommentsByTicketId(String ticketId) {
        commentRepository.deleteByTicketId(ticketId);
    }

    public ApiResponse<List<Comment>> getCommentsByAuthor(String authorEmail) {
        try {
            List<Comment> comments = commentRepository.findByAuthorEmail(authorEmail);
            return ApiResponse.success("Author comments retrieved successfully", comments);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve author comments: " + e.getMessage());
        }
    }
}
