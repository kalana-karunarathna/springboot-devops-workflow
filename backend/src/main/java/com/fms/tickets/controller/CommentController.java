package com.fms.tickets.controller;

import com.fms.common.ApiResponse;
import com.fms.tickets.model.Comment;
import com.fms.tickets.service.CommentService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<Comment>> createComment(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> commentRequest,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        String authorEmail = userEmail != null ? userEmail : commentRequest.get("authorEmail");
        String authorName = userName != null ? userName : commentRequest.get("authorName");
        String content = commentRequest.get("content");
        String authorRole = userRole != null ? userRole : commentRequest.getOrDefault("authorRole", "USER");

        ApiResponse<Comment> response = commentService.createComment(ticketId, authorEmail, authorName, content, authorRole);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Comment>>> getCommentsByTicketId(@PathVariable String ticketId) {
        ApiResponse<List<Comment>> response = commentService.getCommentsByTicketId(ticketId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Comment>> updateComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestBody Map<String, String> commentRequest,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        String newContent = commentRequest.get("content");
        String authorEmail = userEmail != null ? userEmail : commentRequest.get("userEmail");
        String authorRole = userRole != null ? userRole : commentRequest.getOrDefault("userRole", "USER");

        ApiResponse<Comment> response = commentService.updateComment(commentId, authorEmail, authorRole, newContent);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        String authorEmail = userEmail != null ? userEmail : "unknown";
        String authorRole = userRole != null ? userRole : "USER";

        ApiResponse<Void> response = commentService.deleteComment(commentId, authorEmail, authorRole);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Comment>> getCommentById(
            @PathVariable String ticketId,
            @PathVariable String commentId) {
        ApiResponse<Comment> response = commentService.getCommentById(commentId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
