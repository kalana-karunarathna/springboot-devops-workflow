package com.fms.bookings.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookingCreateRequest {

	@NotBlank(message = "Resource ID is required")
	private String resourceId;

	@Size(max = 100, message = "Resource name must be 100 characters or less")
	private String resourceName;

	private Integer capacity;

	@NotBlank(message = "Requested by is required")
	private String requestedBy;

	@NotBlank(message = "Purpose is required")
	@Size(max = 255, message = "Purpose must be 255 characters or less")
	private String purpose;

	@NotNull(message = "Start date and time is required")
	private LocalDateTime startDateTime;

	@NotNull(message = "End date and time is required")
	private LocalDateTime endDateTime;
}
