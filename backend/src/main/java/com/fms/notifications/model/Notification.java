package com.fms.notifications.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Message is required")
    @Size(min = 5, max = 500, message = "Message must be between 5 and 500 characters")
    private String message;

    @NotBlank(message = "Type is required")
    @Pattern(
        regexp = "^(TICKET_CREATED|TICKET_ASSIGNED|TICKET_RESOLVED|TICKET_REJECTED|TICKET_STATUS_CHANGED|TICKET_COMMENT|BOOKING_APPROVED|BOOKING_REJECTED|BOOKING_DECISION|SYSTEM)$",
        message = "Type must be one of: TICKET_CREATED, TICKET_ASSIGNED, TICKET_RESOLVED, TICKET_REJECTED, TICKET_STATUS_CHANGED, TICKET_COMMENT, BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_DECISION, SYSTEM"
    )
    private String type;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Invalid email format")
    private String recipientEmail;

    private String relatedEntityId; // Ticket ID, Booking ID, etc.
    private String relatedEntityType; // TICKET, BOOKING, etc.
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    public Notification(String title, String message, String type, String recipientEmail, 
                       String relatedEntityId, String relatedEntityType) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.recipientEmail = recipientEmail;
        this.relatedEntityId = relatedEntityId;
        this.relatedEntityType = relatedEntityType;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }

    public void markAsUnread() {
        this.isRead = false;
        this.readAt = null;
    }
}
