package com.fms.bookings.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookingDecisionRequest {

	@Size(max = 255, message = "Reason must be 255 characters or less")
	private String reason;
}
