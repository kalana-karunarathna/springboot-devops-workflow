package com.fms.bookings.exception;

public class InvalidBookingStateException extends RuntimeException {

	public InvalidBookingStateException(String message) {
		super(message);
	}
}
