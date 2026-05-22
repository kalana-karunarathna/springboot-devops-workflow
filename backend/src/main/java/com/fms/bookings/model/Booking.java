package com.fms.bookings.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fms.bookings.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

	@Id
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
