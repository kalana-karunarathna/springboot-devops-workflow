package com.fms.bookings.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fms.bookings.dto.BookingCreateRequest;
import com.fms.bookings.dto.BookingDecisionRequest;
import com.fms.bookings.dto.BookingResponse;
import com.fms.bookings.dto.BookingUpdateRequest;
import com.fms.bookings.service.BookingService;
import com.fms.common.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
@Validated
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@PostMapping
	public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingCreateRequest request) {
		BookingResponse response = bookingService.createBooking(request);
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(ApiResponse.success("Booking created successfully.", response));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable String id) {
		return ResponseEntity.ok(ApiResponse.success("Booking fetched successfully.", bookingService.getBookingById(id)));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<java.util.List<BookingResponse>>> getAllBookings() {
		return ResponseEntity.ok(ApiResponse.success("Bookings fetched successfully.", bookingService.getAllBookings()));
	}

	@GetMapping("/user/{email}")
	public ResponseEntity<ApiResponse<java.util.List<BookingResponse>>> getBookingsByRequester(@PathVariable String email) {
		return ResponseEntity.ok(ApiResponse.success("User bookings fetched successfully.", bookingService.getBookingsByRequester(email)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable String id,
		@Valid @RequestBody BookingUpdateRequest request) {
		BookingResponse response = bookingService.updateBooking(id, request);
		return ResponseEntity.ok(ApiResponse.success("Booking updated successfully.", response));
	}

	@PatchMapping("/{id}/cancel")
	public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable String id) {
		BookingResponse response = bookingService.cancelBooking(id);
		return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully.", response));
	}

	@PatchMapping("/{id}/approve")
	public ResponseEntity<ApiResponse<BookingResponse>> approveBooking(@PathVariable String id,
		@RequestParam String approvedBy) {
		BookingResponse response = bookingService.approveBooking(id, approvedBy);
		return ResponseEntity.ok(ApiResponse.success("Booking approved successfully.", response));
	}

	@PatchMapping("/{id}/reject")
	public ResponseEntity<ApiResponse<BookingResponse>> rejectBooking(@PathVariable String id,
		@Valid @RequestBody BookingDecisionRequest request) {
		BookingResponse response = bookingService.rejectBooking(id, request.getReason());
		return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully.", response));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable String id) {
		bookingService.deleteBooking(id);
		return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully."));
	}
}
