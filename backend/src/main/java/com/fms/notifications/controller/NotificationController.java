package com.fms.notifications.controller;

import com.fms.common.ApiResponse;
import com.fms.notifications.model.Notification;
import com.fms.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> createNotification(@Valid @RequestBody Notification notification) {
        ApiResponse<Notification> response = notificationService.createNotification(notification);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAllNotifications() {
        ApiResponse<List<Notification>> response = notificationService.getAllNotifications();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count-unread")
    public ResponseEntity<ApiResponse<Long>> getUnreadCountAll() {
        ApiResponse<Long> response = notificationService.getUnreadCountAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<ApiResponse<List<Notification>>> getUserNotifications(@PathVariable String userEmail) {
        ApiResponse<List<Notification>> response = notificationService.getUserNotifications(userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userEmail}/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications(@PathVariable String userEmail) {
        ApiResponse<List<Notification>> response = notificationService.getUnreadNotifications(userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userEmail}/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@PathVariable String userEmail) {
        ApiResponse<Long> response = notificationService.getUnreadCount(userEmail);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable String id) {
        ApiResponse<Notification> response = notificationService.markNotificationAsRead(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}/unread")
    public ResponseEntity<ApiResponse<Notification>> markAsUnread(@PathVariable String id) {
        ApiResponse<Notification> response = notificationService.markNotificationAsUnread(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/user/{userEmail}/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@PathVariable String userEmail) {
        ApiResponse<Void> response = notificationService.markAllAsRead(userEmail);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable String id) {
        ApiResponse<Void> response = notificationService.deleteNotification(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/user/{userEmail}/read")
    public ResponseEntity<ApiResponse<Void>> deleteReadNotifications(@PathVariable String userEmail) {
        ApiResponse<Void> response = notificationService.deleteReadNotifications(userEmail);
        return ResponseEntity.ok(response);
    }
}
