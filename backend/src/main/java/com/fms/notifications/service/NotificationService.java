package com.fms.notifications.service;

import com.fms.common.ApiResponse;
import com.fms.notifications.model.Notification;
import com.fms.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    public ApiResponse<Notification> createNotification(Notification notification) {
        try {
            notification.setRecipientEmail(normalizeEmail(notification.getRecipientEmail()));
            Notification savedNotification = notificationRepository.save(notification);
            return ApiResponse.success("Notification created successfully", savedNotification);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create notification: " + e.getMessage());
        }
    }

    public ApiResponse<List<Notification>> getUserNotifications(String userEmail) {
        try {
            List<Notification> notifications = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(normalizeEmail(userEmail));
            return ApiResponse.success("Notifications retrieved successfully", notifications);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve notifications: " + e.getMessage());
        }
    }

    public ApiResponse<List<Notification>> getAllNotifications() {
        try {
            List<Notification> notifications = notificationRepository.findAllByOrderByCreatedAtDesc();
            return ApiResponse.success("Notifications retrieved successfully", notifications);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve notifications: " + e.getMessage());
        }
    }

    public ApiResponse<List<Notification>> getUnreadNotifications(String userEmail) {
        try {
            List<Notification> notifications = notificationRepository.findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(normalizeEmail(userEmail));
            return ApiResponse.success("Unread notifications retrieved successfully", notifications);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve unread notifications: " + e.getMessage());
        }
    }

    public ApiResponse<Notification> markNotificationAsRead(String notificationId) {
        try {
            Optional<Notification> notification = notificationRepository.findById(notificationId);
            if (notification.isPresent()) {
                Notification existingNotification = notification.get();
                existingNotification.markAsRead();
                Notification updatedNotification = notificationRepository.save(existingNotification);
                return ApiResponse.success("Notification marked as read", updatedNotification);
            } else {
                return ApiResponse.error("Notification not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to mark notification as read: " + e.getMessage());
        }
    }

    public ApiResponse<Notification> markNotificationAsUnread(String notificationId) {
        try {
            Optional<Notification> notification = notificationRepository.findById(notificationId);
            if (notification.isPresent()) {
                Notification existingNotification = notification.get();
                existingNotification.markAsUnread();
                Notification updatedNotification = notificationRepository.save(existingNotification);
                return ApiResponse.success("Notification marked as unread", updatedNotification);
            } else {
                return ApiResponse.error("Notification not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to mark notification as unread: " + e.getMessage());
        }
    }

    public ApiResponse<Long> getUnreadCount(String userEmail) {
        try {
            long count = notificationRepository.countByRecipientEmailAndIsReadFalse(normalizeEmail(userEmail));
            return ApiResponse.success("Unread count retrieved successfully", count);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get unread count: " + e.getMessage());
        }
    }

    public ApiResponse<Long> getUnreadCountAll() {
        try {
            long count = notificationRepository.countByIsReadFalse();
            return ApiResponse.success("Unread count retrieved successfully", count);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get unread count: " + e.getMessage());
        }
    }

    public ApiResponse<Void> markAllAsRead(String userEmail) {
        try {
            List<Notification> unreadNotifications = notificationRepository.findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(normalizeEmail(userEmail));
            unreadNotifications.forEach(Notification::markAsRead);
            notificationRepository.saveAll(unreadNotifications);
            return ApiResponse.success("All notifications marked as read");
        } catch (Exception e) {
            return ApiResponse.error("Failed to mark all notifications as read: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteNotification(String notificationId) {
        try {
            if (notificationRepository.existsById(notificationId)) {
                notificationRepository.deleteById(notificationId);
                return ApiResponse.success("Notification deleted successfully");
            } else {
                return ApiResponse.error("Notification not found");
            }
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete notification: " + e.getMessage());
        }
    }

    public ApiResponse<Void> deleteReadNotifications(String userEmail) {
        try {
            notificationRepository.deleteByRecipientEmailAndIsReadTrue(normalizeEmail(userEmail));
            return ApiResponse.success("Read notifications deleted successfully");
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete read notifications: " + e.getMessage());
        }
    }

    // Helper methods to create different types of notifications
    public void createTicketCreatedNotification(String userEmail, String ticketId, String ticketTitle) {
        Notification notification = new Notification(
            "New Ticket Created",
            "Your ticket '" + ticketTitle + "' has been created successfully.",
            "TICKET_CREATED",
            userEmail,
            ticketId,
            "TICKET"
        );
        createNotification(notification);
    }

    public void createTicketStatusChangedNotification(String userEmail, String ticketId, String ticketTitle, String status) {
        String statusLabel = status == null ? "updated" : status.replace('_', ' ').toLowerCase(Locale.ROOT);
        Notification notification = new Notification(
            "Ticket Status Updated",
            "Your ticket '" + ticketTitle + "' is now " + statusLabel + ".",
            "TICKET_STATUS_CHANGED",
            userEmail,
            ticketId,
            "TICKET"
        );
        createNotification(notification);
    }

    public void createTicketAssignedNotification(String userEmail, String ticketId, String ticketTitle, String assignedBy) {
        Notification notification = new Notification(
            "Ticket Assigned",
            "Ticket '" + ticketTitle + "' has been assigned to you.",
            "TICKET_ASSIGNED",
            userEmail,
            ticketId,
            "TICKET"
        );
        createNotification(notification);
    }

    public void createTicketResolvedNotification(String userEmail, String ticketId, String ticketTitle) {
        Notification notification = new Notification(
            "Ticket Resolved",
            "Your ticket '" + ticketTitle + "' has been resolved.",
            "TICKET_RESOLVED",
            userEmail,
            ticketId,
            "TICKET"
        );
        createNotification(notification);
    }

    public void createTicketRejectedNotification(String userEmail, String ticketId, String ticketTitle) {
        Notification notification = new Notification(
            "Ticket Rejected",
            "Your ticket '" + ticketTitle + "' has been rejected.",
            "TICKET_REJECTED",
            userEmail,
            ticketId,
            "TICKET"
        );
        createNotification(notification);
    }

    public void createTicketCommentNotification(String userEmail, String ticketId, String ticketTitle, String commentAuthorName) {
        String authorName = (commentAuthorName == null || commentAuthorName.trim().isEmpty())
            ? "Someone"
            : commentAuthorName.trim();

        Notification notification = new Notification(
            "New Ticket Comment",
            authorName + " added a new comment on ticket '" + ticketTitle + "'.",
            "TICKET_COMMENT",
            userEmail,
            ticketId,
            "TICKET"
        );
        createNotification(notification);
    }

    public void createBookingApprovedNotification(String userEmail, String bookingId, String resourceType) {
        Notification notification = new Notification(
            "Booking Approved",
            "Your " + resourceType + " booking has been approved.",
            "BOOKING_APPROVED",
            userEmail,
            bookingId,
            "BOOKING"
        );
        createNotification(notification);
    }

    public void createBookingRejectedNotification(String userEmail, String bookingId, String resourceType) {
        Notification notification = new Notification(
            "Booking Rejected",
            "Your " + resourceType + " booking has been rejected.",
            "BOOKING_REJECTED",
            userEmail,
            bookingId,
            "BOOKING"
        );
        createNotification(notification);
    }

    public void notifyBookingDecision(String bookingId, String userEmail, com.fms.bookings.enums.BookingStatus status, String reason) {
        String title = status == com.fms.bookings.enums.BookingStatus.APPROVED ? "Booking Approved" : "Booking Rejected";
        String message = String.format("Your booking %s has been %s.", bookingId, 
            status == com.fms.bookings.enums.BookingStatus.APPROVED ? "approved" : "rejected");
        
        if (reason != null && !reason.trim().isEmpty()) {
            message += " Reason: " + reason;
        }

        Notification notification = new Notification(
            title,
            message,
            "BOOKING_DECISION",
            userEmail,
            bookingId,
            "BOOKING"
        );
        createNotification(notification);
    }
}
