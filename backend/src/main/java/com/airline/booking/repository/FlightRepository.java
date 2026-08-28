package com.airline.booking.repository;

import com.airline.booking.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    
    @Query("SELECT f FROM Flight f WHERE f.origin = :origin AND f.destination = :destination " +
           "AND f.departureTime >= :date AND f.departureTime < :dateEnd " +
           "AND f.availableSeats > 0 AND f.active = true " +
           "ORDER BY f.departureTime")
    List<Flight> searchFlights(@Param("origin") String origin,
                               @Param("destination") String destination,
                               @Param("date") LocalDateTime date,
                               @Param("dateEnd") LocalDateTime dateEnd);
    
    List<Flight> findByActiveTrue();
    
    List<Flight> findByAirlineAndActiveTrue(String airline);
    
    @Query("SELECT f FROM Flight f WHERE f.flightNumber = :flightNumber AND f.active = true")
    Flight findByFlightNumber(@Param("flightNumber") String flightNumber);
}
