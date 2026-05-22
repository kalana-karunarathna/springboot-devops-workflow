package com.fms.bookings.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.fms.bookings.enums.BookingStatus;
import com.fms.bookings.model.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {

	List<Booking> findByRequestedByOrderByCreatedAtDesc(String requestedBy);

	List<Booking> findByRequestedByIgnoreCaseOrderByCreatedAtDesc(String requestedBy);

	@Query(value = "{ 'requestedBy': { $regex: ?0, $options: 'i' } }", sort = "{ 'createdAt': -1 }")
	List<Booking> findByRequestedByCaseInsensitive(String requestedByPattern);

	List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

	List<Booking> findByResourceIdOrderByStartDateTimeAsc(String resourceId);

	@Query("{ 'resourceId': ?0, 'status': { $in: ?1 }, 'startDateTime': { $lt: ?3 }, 'endDateTime': { $gt: ?2 } }")
	List<Booking> findConflictingBookings(String resourceId, List<BookingStatus> statuses, LocalDateTime requestedStart,
		LocalDateTime requestedEnd);

	@Query("{ 'resourceId': ?0, 'status': { $in: ?1 }, 'startDateTime': { $lt: ?3 }, 'endDateTime': { $gt: ?2 }, '_id': { $ne: ?4 } }")
	List<Booking> findConflictingBookingsExcludingId(String resourceId, List<BookingStatus> statuses,
		LocalDateTime requestedStart, LocalDateTime requestedEnd, String excludedId);
}
