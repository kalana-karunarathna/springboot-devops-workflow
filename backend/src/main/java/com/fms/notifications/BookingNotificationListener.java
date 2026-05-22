package com.fms.notifications;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.fms.bookings.enums.BookingStatus;
import com.fms.bookings.event.BookingDecisionEvent;
import com.fms.notifications.service.NotificationService;

@Component
public class BookingNotificationListener {

	private final NotificationService notificationService;

	public BookingNotificationListener(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@EventListener
	public void handleBookingDecision(BookingDecisionEvent event) {
		if (event.status() == BookingStatus.APPROVED || event.status() == BookingStatus.REJECTED) {
			notificationService.notifyBookingDecision(event.bookingId(), event.requestedBy(), event.status(), event.reason());
		}
	}
}
