package com.fms.bookings.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fms.bookings.dto.BookingCreateRequest;
import com.fms.bookings.dto.BookingDecisionRequest;
import com.fms.bookings.dto.BookingResponse;
import com.fms.bookings.enums.BookingStatus;
import com.fms.bookings.exception.BookingExceptionHandler;
import com.fms.bookings.service.BookingService;

@ExtendWith(MockitoExtension.class)
class BookingControllerIntegrationTest {

	@Mock
	private BookingService bookingService;

	private MockMvc mockMvc;
	private ObjectMapper objectMapper;

	@BeforeEach
	void setUp() {
		LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
		validator.afterPropertiesSet();

		mockMvc = MockMvcBuilders
			.standaloneSetup(new BookingController(bookingService))
			.setControllerAdvice(new BookingExceptionHandler())
			.setValidator(validator)
			.build();

		objectMapper = new ObjectMapper()
			.findAndRegisterModules()
			.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
	}

	@Test
	void createBooking_shouldReturnCreatedApiEnvelope() throws Exception {
		BookingCreateRequest request = createRequest();
		when(bookingService.createBooking(any(BookingCreateRequest.class))).thenReturn(response(BookingStatus.PENDING));

		mockMvc.perform(post("/api/bookings")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.message").value("Booking created successfully."))
			.andExpect(jsonPath("$.data.id").value("b1"))
			.andExpect(jsonPath("$.data.status").value("PENDING"));

		ArgumentCaptor<BookingCreateRequest> requestCaptor = ArgumentCaptor.forClass(BookingCreateRequest.class);
		verify(bookingService).createBooking(requestCaptor.capture());
	}

	@Test
	void createBooking_shouldReturnBadRequestWhenRequiredFieldsAreMissing() throws Exception {
		mockMvc.perform(post("/api/bookings")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.success").value(false))
			.andExpect(jsonPath("$.message", containsString("required")));

		verify(bookingService, never()).createBooking(any(BookingCreateRequest.class));
	}

	@Test
	void approveBooking_shouldPassApproverAndReturnUpdatedBooking() throws Exception {
		when(bookingService.approveBooking("b1", "admin@example.com")).thenReturn(response(BookingStatus.APPROVED));

		mockMvc.perform(patch("/api/bookings/b1/approve")
				.param("approvedBy", "admin@example.com"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.message").value("Booking approved successfully."))
			.andExpect(jsonPath("$.data.status").value("APPROVED"));

		verify(bookingService).approveBooking("b1", "admin@example.com");
	}

	@Test
	void rejectBooking_shouldValidateReasonLength() throws Exception {
		BookingDecisionRequest request = new BookingDecisionRequest();
		request.setReason("x".repeat(256));

		mockMvc.perform(patch("/api/bookings/b1/reject")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.success").value(false))
			.andExpect(jsonPath("$.message").value("reason: Reason must be 255 characters or less"));

		verify(bookingService, never()).rejectBooking(any(), any());
	}

	private BookingCreateRequest createRequest() {
		BookingCreateRequest request = new BookingCreateRequest();
		request.setResourceId("LAB-101");
		request.setResourceName("Computer Lab 101");
		request.setCapacity(40);
		request.setRequestedBy("student@example.com");
		request.setPurpose("Project meeting");
		request.setStartDateTime(LocalDateTime.of(2026, 4, 18, 10, 0));
		request.setEndDateTime(LocalDateTime.of(2026, 4, 18, 11, 0));
		return request;
	}

	private BookingResponse response(BookingStatus status) {
		return BookingResponse.builder()
			.id("b1")
			.resourceId("LAB-101")
			.resourceName("Computer Lab 101")
			.capacity(40)
			.requestedBy("student@example.com")
			.purpose("Project meeting")
			.status(status)
			.build();
	}
}
