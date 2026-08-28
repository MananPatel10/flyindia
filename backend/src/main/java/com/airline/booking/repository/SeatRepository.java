package com.airline.booking.repository;

import com.airline.booking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByFlightIdAndAvailableTrue(Long flightId);
    Optional<Seat> findByFlightIdAndSeatNumber(Long flightId, String seatNumber);
    List<Seat> findByFlightIdAndSeatClassAndAvailableTrue(Long flightId, String seatClass);
    boolean existsByFlightIdAndSeatNumberAndAvailableTrue(Long flightId, String seatNumber);
}
