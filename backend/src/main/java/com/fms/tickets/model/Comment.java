package com.fms.tickets.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    
    @Id
    private String id;
    
    @Field("ticket_id")
    private String ticketId;
    
    @Field("author_email")
    private String authorEmail;
    
    @Field("author_name")
    private String authorName;
    
    @Field("content")
    private String content;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("is_edited")
    private Boolean isEdited;
    
    @Field("author_role")
    private String authorRole; // USER, TECHNICIAN, ADMIN
    
    // Default constructor
    public Comment(String ticketId, String authorEmail, String authorName, String content, String authorRole) {
        this.ticketId = ticketId;
        this.authorEmail = authorEmail;
        this.authorName = authorName;
        this.content = content;
        this.authorRole = authorRole;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isEdited = false;
    }
    
    // Update comment content
    public void updateContent(String newContent) {
        this.content = newContent;
        this.updatedAt = LocalDateTime.now();
        this.isEdited = true;
    }
    
    // Check if user can edit this comment
    public boolean canEdit(String userEmail, String userRole) {
        return this.authorEmail.equals(userEmail) || 
               "ADMIN".equals(userRole) || 
               ("TECHNICIAN".equals(userRole) && !("USER".equals(this.authorRole)));
    }
    
    // Check if user can delete this comment
    public boolean canDelete(String userEmail, String userRole) {
        return this.authorEmail.equals(userEmail) || 
               "ADMIN".equals(userRole) || 
               ("TECHNICIAN".equals(userRole) && !("USER".equals(this.authorRole)));
    }
}
