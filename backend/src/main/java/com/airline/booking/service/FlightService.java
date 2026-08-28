package com.airline.booking.service;

import com.airline.booking.entity.Flight;
import com.airline.booking.entity.Seat;
import com.airline.booking.repository.FlightRepository;
import com.airline.booking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private SeatRepository seatRepository;

    public List<Flight> searchFlights(String origin, String destination, String dateStr) {
        LocalDateTime date = LocalDateTime.parse(dateStr + "T00:00:00");
        LocalDateTime dateEnd = date.plusDays(1);
        return flightRepository.searchFlights(origin, destination, date, dateEnd);
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
    }

    public List<Flight> getAllActiveFlights() {
        return flightRepository.findByActiveTrue();
    }

    public List<Seat> getAvailableSeats(Long flightId) {
        return seatRepository.findByFlightIdAndAvailableTrue(flightId);
    }

    public List<Seat> getAvailableSeatsByClass(Long flightId, String seatClass) {
        return seatRepository.findByFlightIdAndSeatClassAndAvailableTrue(flightId, seatClass);
    }

    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    public Flight updateFlight(Long id, Flight updatedFlight) {
        Flight flight = getFlightById(id);
        flight.setAirline(updatedFlight.getAirline());
        flight.setFlightNumber(updatedFlight.getFlightNumber());
        flight.setOrigin(updatedFlight.getOrigin());
        flight.setDestination(updatedFlight.getDestination());
        flight.setOriginCode(updatedFlight.getOriginCode());
        flight.setDestinationCode(updatedFlight.getDestinationCode());
        flight.setDepartureTime(updatedFlight.getDepartureTime());
        flight.setArrivalTime(updatedFlight.getArrivalTime());
        flight.setBasePrice(updatedFlight.getBasePrice());
        flight.setAircraftType(updatedFlight.getAircraftType());
        flight.setTotalSeats(updatedFlight.getTotalSeats());
        flight.setAvailableSeats(updatedFlight.getAvailableSeats());
        return flightRepository.save(flight);
    }

    public void deactivateFlight(Long id) {
        Flight flight = getFlightById(id);
        flight.setActive(false);
        flightRepository.save(flight);
    }
}
