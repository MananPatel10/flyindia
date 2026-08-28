package com.airline.booking.repository;

import com.airline.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);
    Optional<Booking> findByBookingRef(String bookingRef);
    Optional<Booking> findByBookingRefAndUserId(String bookingRef, Long userId);
}
