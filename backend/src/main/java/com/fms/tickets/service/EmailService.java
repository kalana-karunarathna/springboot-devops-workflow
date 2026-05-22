package com.fms.tickets.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// @Service - Temporarily disabled due to mail configuration issues
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendTicketResolutionEmail(String toEmail, String ticketTitle, String ticketId, String message, String resolvedBy) {
        try {
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            
            emailMessage.setFrom("Smart Campus System <noreply@smartcampus.com>");
            emailMessage.setTo(toEmail);
            emailMessage.setSubject("Your Ticket Has Been Resolved - " + ticketTitle);
            
            String emailBody = String.format(
                "Dear User,\n\n" +
                "Your ticket has been successfully resolved!\n\n" +
                "Ticket Details:\n" +
                "Title: %s\n" +
                "Ticket ID: %s\n" +
                "Resolved By: %s\n" +
                "Resolution Message: %s\n\n" +
                "Thank you for using the Smart Campus Facility Management System.\n" +
                "If you have any questions, please contact our support team.\n\n" +
                "Best regards,\n" +
                "Smart Campus Team",
                ticketTitle, ticketId, resolvedBy, message
            );
            
            emailMessage.setText(emailBody);
            
            mailSender.send(emailMessage);
            
            System.out.println("✅ EMAIL SENT SUCCESSFULLY");
            System.out.println("To: " + toEmail);
            System.out.println("Subject: " + emailMessage.getSubject());
            System.out.println("Message: " + message);
            
        } catch (Exception e) {
            System.err.println("❌ FAILED TO SEND EMAIL: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendTicketCreationEmail(String toEmail, String ticketTitle, String ticketId) {
        try {
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            
            emailMessage.setFrom("Smart Campus System <noreply@smartcampus.com>");
            emailMessage.setTo(toEmail);
            emailMessage.setSubject("Ticket Created Successfully - " + ticketTitle);
            
            String emailBody = String.format(
                "Dear User,\n\n" +
                "Your ticket has been successfully created and is now being processed.\n\n" +
                "Ticket Details:\n" +
                "Title: %s\n" +
                "Ticket ID: %s\n\n" +
                "We will review your ticket and take appropriate action.\n" +
                "You can track the status of your ticket through the system.\n\n" +
                "Thank you for using the Smart Campus Facility Management System.\n\n" +
                "Best regards,\n" +
                "Smart Campus Team",
                ticketTitle, ticketId
            );
            
            emailMessage.setText(emailBody);
            
            mailSender.send(emailMessage);
            
            System.out.println("✅ TICKET CREATION EMAIL SENT");
            System.out.println("To: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ FAILED TO SEND TICKET CREATION EMAIL: " + e.getMessage());
        }
    }

    public void sendTicketRejectionEmail(String toEmail, String ticketTitle, String ticketId, String reason) {
        try {
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            
            emailMessage.setFrom("Smart Campus System <noreply@smartcampus.com>");
            emailMessage.setTo(toEmail);
            emailMessage.setSubject("Ticket Status Update - " + ticketTitle);
            
            String emailBody = String.format(
                "Dear User,\n\n" +
                "Your ticket has been reviewed and unfortunately could not be processed at this time.\n\n" +
                "Ticket Details:\n" +
                "Title: %s\n" +
                "Ticket ID: %s\n" +
                "Reason: %s\n\n" +
                "If you believe this is an error or have questions, please contact our support team.\n\n" +
                "Thank you for using the Smart Campus Facility Management System.\n\n" +
                "Best regards,\n" +
                "Smart Campus Team",
                ticketTitle, ticketId, reason
            );
            
            emailMessage.setText(emailBody);
            
            mailSender.send(emailMessage);
            
            System.out.println("✅ TICKET REJECTION EMAIL SENT");
            System.out.println("To: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ FAILED TO SEND TICKET REJECTION EMAIL: " + e.getMessage());
        }
    }
}
