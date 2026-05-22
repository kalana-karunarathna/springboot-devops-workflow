package com.fms.notifications.repository;

import com.fms.notifications.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    List<Notification> findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(String recipientEmail);
    List<Notification> findByTypeOrderByCreatedAtDesc(String type);
    List<Notification> findByRelatedEntityIdAndRecipientEmailOrderByCreatedAtDesc(String relatedEntityId, String recipientEmail);
    long countByIsReadFalse();
    long countByRecipientEmailAndIsReadFalse(String recipientEmail);
    void deleteByRecipientEmailAndIsReadTrue(String recipientEmail);
}
