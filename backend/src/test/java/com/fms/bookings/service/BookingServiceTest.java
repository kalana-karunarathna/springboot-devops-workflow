package com.fms.bookings.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import com.fms.bookings.dto.BookingCreateRequest;
import com.fms.bookings.dto.BookingResponse;
import com.fms.bookings.enums.BookingStatus;
import com.fms.bookings.event.BookingDecisionEvent;
import com.fms.bookings.exception.BookingConflictException;
import com.fms.bookings.exception.InvalidBookingStateException;
import com.fms.bookings.model.Booking;
import com.fms.bookings.repository.BookingRepository;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

	@Mock
	private BookingRepository bookingRepository;

	@Mock
	private ApplicationEventPublisher eventPublisher;

	private BookingService bookingService;

	@BeforeEach
	void setUp() {
		bookingService = new BookingService(bookingRepository, eventPublisher);
	}

	@Test
	void createBooking_shouldSavePendingBookingWhenNoConflict() {
		BookingCreateRequest request = createRequest();

		when(bookingRepository.findConflictingBookings(anyString(), anyList(), any(), any())).thenReturn(List.of());
		when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

		BookingResponse response = bookingService.createBooking(request);

		assertEquals(BookingStatus.PENDING, response.getStatus());
		assertEquals("LAB-101", response.getResourceId());
		verify(bookingRepository).save(any(Booking.class));
	}

	@Test
	void createBooking_shouldNormalizeRequesterEmailBeforeSaving() {
		BookingCreateRequest request = createRequest();
		request.setRequestedBy("  Student1@Example.COM  ");

		when(bookingRepository.findConflictingBookings(anyString(), anyList(), any(), any())).thenReturn(List.of());
		when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

		BookingResponse response = bookingService.createBooking(request);

		assertEquals("student1@example.com", response.getRequestedBy());
	}

	@Test
	void createBooking_shouldThrowWhenEndDateIsBeforeStartDate() {
		BookingCreateRequest request = createRequest();
		request.setEndDateTime(LocalDateTime.of(2026, 4, 18, 9, 0));

		assertThrows(IllegalArgumentException.class, () -> bookingService.createBooking(request));
		verify(bookingRepository, never()).findConflictingBookings(anyString(), anyList(), any(), any());
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	void createBooking_shouldThrowConflictWhenOverlapExists() {
		BookingCreateRequest request = createRequest();

		when(bookingRepository.findConflictingBookings(anyString(), anyList(), any(), any()))
			.thenReturn(List.of(existingBooking()));

		assertThrows(BookingConflictException.class, () -> bookingService.createBooking(request));
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	void approveBooking_shouldApprovePendingBookingAndPublishEvent() {
		Booking booking = pendingBooking();

		when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));
		when(bookingRepository.findConflictingBookingsExcludingId(anyString(), anyList(), any(), any(), anyString()))
			.thenReturn(List.of());
		when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

		BookingResponse response = bookingService.approveBooking("b1", "admin1");

		assertEquals(BookingStatus.APPROVED, response.getStatus());
		assertEquals("admin1", response.getApprovedBy());
		ArgumentCaptor<Object> eventCaptor = ArgumentCaptor.forClass(Object.class);
		verify(eventPublisher).publishEvent(eventCaptor.capture());
		BookingDecisionEvent event = (BookingDecisionEvent) eventCaptor.getValue();
		assertEquals("b1", event.bookingId());
		assertEquals(BookingStatus.APPROVED, event.status());
		}

	@Test
	void approveBooking_shouldThrowConflictWhenAnotherBookingOverlaps() {
		Booking booking = pendingBooking();

		when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));
		when(bookingRepository.findConflictingBookingsExcludingId(anyString(), anyList(), any(), any(), anyString()))
			.thenReturn(List.of(existingBooking()));

		assertThrows(BookingConflictException.class, () -> bookingService.approveBooking("b1", "admin1"));
		verify(bookingRepository, never()).save(any(Booking.class));
		verify(eventPublisher, never()).publishEvent(any());
	}

	@Test
	void rejectBooking_shouldRejectPendingBookingAndPublishEvent() {
		Booking booking = pendingBooking();
		when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));
		when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

		BookingResponse response = bookingService.rejectBooking("b1", "Not available");

		assertEquals(BookingStatus.REJECTED, response.getStatus());
		assertEquals("Not available", response.getRejectionReason());
		ArgumentCaptor<Object> eventCaptor = ArgumentCaptor.forClass(Object.class);
		verify(eventPublisher).publishEvent(eventCaptor.capture());
		BookingDecisionEvent event = (BookingDecisionEvent) eventCaptor.getValue();
		assertEquals("b1", event.bookingId());
		assertEquals(BookingStatus.REJECTED, event.status());
	}

	@Test
	void rejectBooking_shouldThrowInvalidStateWhenAlreadyApproved() {
		Booking booking = pendingBooking();
		booking.setStatus(BookingStatus.APPROVED);
		when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));

		assertThrows(InvalidBookingStateException.class, () -> bookingService.rejectBooking("b1", "No"));
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	void cancelBooking_shouldCancelApprovedBooking() {
		Booking booking = pendingBooking();
		booking.setStatus(BookingStatus.APPROVED);
		when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));
		when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

		BookingResponse response = bookingService.cancelBooking("b1");

		assertEquals(BookingStatus.CANCELLED, response.getStatus());
		verify(bookingRepository).save(booking);
	}

	private BookingCreateRequest createRequest() {
		BookingCreateRequest request = new BookingCreateRequest();
		request.setResourceId("LAB-101");
		request.setResourceName("Computer Lab 101");
		request.setRequestedBy("student1");
		request.setPurpose("Project meeting");
		request.setStartDateTime(LocalDateTime.of(2026, 4, 18, 10, 0));
		request.setEndDateTime(LocalDateTime.of(2026, 4, 18, 11, 0));
		return request;
	}

	private Booking pendingBooking() {
		return Booking.builder()
			.id("b1")
			.resourceId("LAB-101")
			.resourceName("Computer Lab 101")
			.requestedBy("student1")
			.purpose("Project meeting")
			.startDateTime(LocalDateTime.of(2026, 4, 18, 10, 0))
			.endDateTime(LocalDateTime.of(2026, 4, 18, 11, 0))
			.status(BookingStatus.PENDING)
			.build();
	}

	private Booking existingBooking() {
		return Booking.builder()
			.id("existing")
			.resourceId("LAB-101")
			.startDateTime(LocalDateTime.of(2026, 4, 18, 10, 30))
			.endDateTime(LocalDateTime.of(2026, 4, 18, 11, 30))
			.status(BookingStatus.APPROVED)
			.build();
	}
}
