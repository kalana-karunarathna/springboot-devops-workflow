package com.fms.bookings.dto;

import java.time.LocalDateTime;

import com.fms.bookings.enums.BookingStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {

	private String id;
	private String resourceId;
	private String resourceName;
	private Integer capacity;
	private String requestedBy;
	private String purpose;
	private LocalDateTime startDateTime;
	private LocalDateTime endDateTime;
	private BookingStatus status;
	private String approvedBy;
	private String rejectionReason;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
