package com.airline.booking.controller;

import com.airline.booking.dto.SeatDto;
import com.airline.booking.entity.Flight;
import com.airline.booking.entity.Seat;
import com.airline.booking.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired private FlightService flightService;

    @GetMapping("/search")
    public ResponseEntity<?> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String date) {
        List<Flight> flights = flightService.searchFlights(origin, destination, date);
        return ResponseEntity.ok(flights.stream().map(this::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFlight(@PathVariable Long id) {
        try {
            Flight flight = flightService.getFlightById(id);
            return ResponseEntity.ok(toDto(flight));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<?> getSeats(@PathVariable Long id,
                                      @RequestParam(required = false) String seatClass) {
        List<Seat> seats;
        if (seatClass != null && !seatClass.isEmpty()) {
            seats = flightService.getAvailableSeatsByClass(id, seatClass);
        } else {
            seats = flightService.getAvailableSeats(id);
        }
        return ResponseEntity.ok(seats.stream().map(SeatDto::fromEntity).toList());
    }

    @GetMapping("/airlines")
    public ResponseEntity<?> getAirlines() {
        return ResponseEntity.ok(List.of("IndiGo", "Air India", "Vistara", "SpiceJet", "AirAsia India", "GoFirst"));
    }

    @GetMapping("/airports")
    public ResponseEntity<?> getAirports() {
        return ResponseEntity.ok(List.of(
            Map.of("city", "Delhi", "code", "DEL"),
            Map.of("city", "Mumbai", "code", "BOM"),
            Map.of("city", "Bangalore", "code", "BLR"),
            Map.of("city", "Chennai", "code", "MAA"),
            Map.of("city", "Kolkata", "code", "CCU"),
            Map.of("city", "Hyderabad", "code", "HYD"),
            Map.of("city", "Ahmedabad", "code", "AMD"),
            Map.of("city", "Pune", "code", "PNQ"),
            Map.of("city", "Goa", "code", "GOI"),
            Map.of("city", "Jaipur", "code", "JAI"),
            Map.of("city", "Lucknow", "code", "LKO"),
            Map.of("city", "Chandigarh", "code", "IXC"),
            Map.of("city", "Kochi", "code", "COK"),
            Map.of("city", "Thiruvananthapuram", "code", "TRV"),
            Map.of("city", "Guwahati", "code", "GAU"),
            Map.of("city", "Patna", "code", "PAT"),
            Map.of("city", "Bhopal", "code", "BHO"),
            Map.of("city", "Indore", "code", "IDR"),
            Map.of("city", "Nagpur", "code", "NAG"),
            Map.of("city", "Coimbatore", "code", "CJB")
        ));
    }

    private Map<String, Object> toDto(Flight flight) {
        long minutes = Duration.between(flight.getDepartureTime(), flight.getArrivalTime()).toMinutes();
        String duration = String.format("%dh %dm", minutes / 60, minutes % 60);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", flight.getId());
        dto.put("flightNumber", flight.getFlightNumber());
        dto.put("airline", flight.getAirline());
        dto.put("origin", flight.getOrigin());
        dto.put("destination", flight.getDestination());
        dto.put("originCode", flight.getOriginCode());
        dto.put("destinationCode", flight.getDestinationCode());
        dto.put("departureTime", flight.getDepartureTime().format(fmt));
        dto.put("arrivalTime", flight.getArrivalTime().format(fmt));
        dto.put("availableSeats", flight.getAvailableSeats());
        dto.put("totalSeats", flight.getTotalSeats());
        dto.put("basePrice", flight.getBasePrice());
        dto.put("aircraftType", flight.getAircraftType());
        dto.put("duration", duration);
        return dto;
    }
}
