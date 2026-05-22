package com.fms.tickets.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "Ticket ID is required")
    private String ticketId;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|URGENT)$", message = "Priority must be LOW, MEDIUM, HIGH, or URGENT")
    private String priority;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(OPEN|IN_PROGRESS|RESOLVED|CLOSED|REJECTED)$", message = "Status must be OPEN, IN_PROGRESS, RESOLVED, CLOSED, or REJECTED")
    private String status;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String submittedBy;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Contact number must be 10-15 digits")
    private String contactNumber;

    @NotNull(message = "Location is required")
    private String location;

    private String assignedTo;
    private String rejectionReason;
    private String resolutionNotes;
    private List<String> imageAttachments; // Store image URLs
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public Ticket(String title, String description, String category, String priority, 
                String submittedBy, String contactNumber, String location) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = "OPEN";
        this.submittedBy = submittedBy;
        this.contactNumber = contactNumber;
        this.location = location;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.imageAttachments = List.of(); // Initialize empty list
    }

    public void updateStatus(String newStatus) {
        this.status = newStatus;
        this.updatedAt = LocalDateTime.now();
        if ("RESOLVED".equals(newStatus) || "CLOSED".equals(newStatus)) {
            this.resolvedAt = LocalDateTime.now();
        }
    }

    public void assignToTechnician(String technicianEmail) {
        this.assignedTo = technicianEmail;
        this.status = "IN_PROGRESS";
        this.updatedAt = LocalDateTime.now();
    }

    public void addImageAttachment(String imageUrl) {
        if (this.imageAttachments == null) {
            this.imageAttachments = List.of();
        }
        if (this.imageAttachments.size() < 3) {
            this.imageAttachments = List.of(imageUrl);
        }
    }

    public void setResolutionNotes(String notes) {
        this.resolutionNotes = notes;
        this.status = "RESOLVED";
        this.updatedAt = LocalDateTime.now();
        this.resolvedAt = LocalDateTime.now();
    }

    public void rejectTicket(String reason) {
        this.status = "REJECTED";
        this.rejectionReason = reason;
        this.updatedAt = LocalDateTime.now();
    }
}
