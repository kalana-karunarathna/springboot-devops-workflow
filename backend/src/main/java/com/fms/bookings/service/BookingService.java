package com.fms.bookings.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fms.bookings.dto.BookingCreateRequest;
import com.fms.bookings.dto.BookingDecisionRequest;
import com.fms.bookings.dto.BookingResponse;
import com.fms.bookings.dto.BookingUpdateRequest;
import com.fms.bookings.enums.BookingStatus;
import com.fms.bookings.event.BookingDecisionEvent;
import com.fms.bookings.exception.BookingConflictException;
import com.fms.bookings.exception.BookingNotFoundException;
import com.fms.bookings.exception.InvalidBookingStateException;
import com.fms.bookings.model.Booking;
import com.fms.bookings.repository.BookingRepository;

@Service
public class BookingService {

	private static final List<BookingStatus> CONFLICT_STATUSES = List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

	private final BookingRepository bookingRepository;
	private final ApplicationEventPublisher eventPublisher;

	public BookingService(BookingRepository bookingRepository, ApplicationEventPublisher eventPublisher) {
		this.bookingRepository = bookingRepository;
		this.eventPublisher = eventPublisher;
	}

	private String normalizeEmail(String value) {
		return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
	}

	public BookingResponse createBooking(BookingCreateRequest request) {
		validateDateRange(request.getStartDateTime(), request.getEndDateTime());
		checkConflict(request.getResourceId(), request.getStartDateTime(), request.getEndDateTime(), null);

		Booking booking = Booking.builder()
			.resourceId(request.getResourceId())
			.resourceName(request.getResourceName())
			.capacity(request.getCapacity())
			.requestedBy(normalizeEmail(request.getRequestedBy()))
			.purpose(request.getPurpose())
			.startDateTime(request.getStartDateTime())
			.endDateTime(request.getEndDateTime())
			.status(BookingStatus.PENDING)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();

		return toResponse(bookingRepository.save(booking));
	}

	public BookingResponse updateBooking(String bookingId, BookingUpdateRequest request) {
		validateDateRange(request.getStartDateTime(), request.getEndDateTime());

		Booking booking = getBookingEntityOrThrow(bookingId);
		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new InvalidBookingStateException("Only pending bookings can be updated.");
		}

		checkConflict(request.getResourceId(), request.getStartDateTime(), request.getEndDateTime(), bookingId);

		booking.setResourceId(request.getResourceId());
		booking.setResourceName(request.getResourceName());
		booking.setCapacity(request.getCapacity());
		booking.setPurpose(request.getPurpose());
		booking.setStartDateTime(request.getStartDateTime());
		booking.setEndDateTime(request.getEndDateTime());
		booking.setUpdatedAt(LocalDateTime.now());

		return toResponse(bookingRepository.save(booking));
	}

	public BookingResponse cancelBooking(String bookingId) {
		Booking booking = getBookingEntityOrThrow(bookingId);

		if (booking.getStatus() == BookingStatus.CANCELLED) {
			throw new InvalidBookingStateException("Booking is already cancelled.");
		}
		if (booking.getStatus() == BookingStatus.REJECTED) {
			throw new InvalidBookingStateException("Rejected bookings cannot be cancelled.");
		}

		booking.setStatus(BookingStatus.CANCELLED);
		booking.setUpdatedAt(LocalDateTime.now());
		return toResponse(bookingRepository.save(booking));
	}

	public BookingResponse approveBooking(String bookingId, String approvedBy) {
		Booking booking = getBookingEntityOrThrow(bookingId);

		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new InvalidBookingStateException("Only pending bookings can be approved.");
		}

		checkConflict(booking.getResourceId(), booking.getStartDateTime(), booking.getEndDateTime(), bookingId);

		booking.setStatus(BookingStatus.APPROVED);
		booking.setApprovedBy(approvedBy);
		booking.setRejectionReason(null);
		booking.setUpdatedAt(LocalDateTime.now());

		Booking saved = bookingRepository.save(booking);
		eventPublisher.publishEvent(new BookingDecisionEvent(saved.getId(), saved.getRequestedBy(), saved.getStatus(), null));
		return toResponse(saved);
	}

	public BookingResponse rejectBooking(String bookingId, String reason) {
		Booking booking = getBookingEntityOrThrow(bookingId);

		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new InvalidBookingStateException("Only pending bookings can be rejected.");
		}

		booking.setStatus(BookingStatus.REJECTED);
		booking.setRejectionReason(StringUtils.hasText(reason) ? reason : "Rejected by admin.");
		booking.setUpdatedAt(LocalDateTime.now());

		Booking saved = bookingRepository.save(booking);
		eventPublisher.publishEvent(new BookingDecisionEvent(saved.getId(), saved.getRequestedBy(), saved.getStatus(),
			saved.getRejectionReason()));
		return toResponse(saved);
	}

	public BookingResponse getBookingById(String bookingId) {
		return toResponse(getBookingEntityOrThrow(bookingId));
	}

	public void deleteBooking(String bookingId) {
		Booking booking = getBookingEntityOrThrow(bookingId);
		bookingRepository.delete(booking);
	}

	public List<BookingResponse> getAllBookings() {
		return bookingRepository.findAll().stream().map(this::toResponse).toList();
	}

	public List<BookingResponse> getBookingsByRequester(String requestedBy) {
		String normalizedEmail = normalizeEmail(requestedBy);
		String exactEmailPattern = "^" + Pattern.quote(normalizedEmail) + "$";
		return bookingRepository.findByRequestedByCaseInsensitive(exactEmailPattern)
			.stream()
			.map(this::toResponse)
			.toList();
	}

	public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
		return bookingRepository.findByStatusOrderByCreatedAtDesc(status).stream().map(this::toResponse).toList();
	}

	private Booking getBookingEntityOrThrow(String bookingId) {
		return bookingRepository.findById(bookingId)
			.orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
	}

	private void checkConflict(String resourceId, LocalDateTime startDateTime, LocalDateTime endDateTime, String excludeId) {
		List<Booking> conflicts = (excludeId == null)
			? bookingRepository.findConflictingBookings(resourceId, CONFLICT_STATUSES, startDateTime, endDateTime)
			: bookingRepository.findConflictingBookingsExcludingId(resourceId, CONFLICT_STATUSES, startDateTime, endDateTime,
				excludeId);

		if (!conflicts.isEmpty()) {
			throw new BookingConflictException("This resource is already booked for the selected time range.");
		}
	}

	private void validateDateRange(LocalDateTime startDateTime, LocalDateTime endDateTime) {
		if (startDateTime == null || endDateTime == null) {
			throw new IllegalArgumentException("Start and end date/time are required.");
		}
		if (!endDateTime.isAfter(startDateTime)) {
			throw new IllegalArgumentException("End date/time must be after start date/time.");
		}
	}

	private BookingResponse toResponse(Booking booking) {
		return BookingResponse.builder()
			.id(booking.getId())
			.resourceId(booking.getResourceId())
			.resourceName(booking.getResourceName())
			.capacity(booking.getCapacity())
			.requestedBy(booking.getRequestedBy())
			.purpose(booking.getPurpose())
			.startDateTime(booking.getStartDateTime())
			.endDateTime(booking.getEndDateTime())
			.status(booking.getStatus())
			.approvedBy(booking.getApprovedBy())
			.rejectionReason(booking.getRejectionReason())
			.createdAt(booking.getCreatedAt())
			.updatedAt(booking.getUpdatedAt())
			.build();
	}
}
