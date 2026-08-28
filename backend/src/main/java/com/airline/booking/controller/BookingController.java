package com.airline.booking.controller;

import com.airline.booking.dto.BookingDto;
import com.airline.booking.entity.Booking;
import com.airline.booking.entity.User;
import com.airline.booking.repository.UserRepository;
import com.airline.booking.service.BookingService;
import com.airline.booking.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingService bookingService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDto dto,
                                           @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow();
            Booking booking = bookingService.createBooking(
                user.getId(), dto.getFlightId(), dto.getSeatNumber(),
                dto.getSeatClass(), dto.getPassengerName(),
                dto.getPassengerEmail(), dto.getPassengerPhone(), dto.getPaymentMethod());
            return ResponseEntity.ok(toDto(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserBookings(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow();
            List<Booking> bookings = bookingService.getUserBookings(user.getId());
            return ResponseEntity.ok(bookings.stream().map(this::toDto).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{ref}")
    public ResponseEntity<?> getBooking(@PathVariable String ref,
                                        @RequestHeader("Authorization") String authHeader) {
        try {
            Booking booking = bookingService.getBookingByRef(ref);
            return ResponseEntity.ok(toDto(booking));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{ref}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String ref,
                                           @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader.substring(7));
            User user = userRepository.findByEmail(email).orElseThrow();
            Booking booking = bookingService.cancelBooking(ref, user.getId());
            return ResponseEntity.ok(toDto(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private Map<String, Object> toDto(Booking booking) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", booking.getId());
        dto.put("bookingRef", booking.getBookingRef());
        dto.put("passengerName", booking.getPassengerName());
        dto.put("passengerEmail", booking.getPassengerEmail());
        dto.put("passengerPhone", booking.getPassengerPhone());
        dto.put("seatNumber", booking.getSeatNumber());
        dto.put("seatClass", booking.getSeatClass());
        dto.put("totalPrice", booking.getTotalPrice());
        dto.put("status", booking.getStatus());
        dto.put("paymentMethod", booking.getPaymentMethod());
        dto.put("travelDate", booking.getTravelDate() != null ? booking.getTravelDate().format(fmt) : null);
        dto.put("bookedAt", booking.getBookedAt().format(fmt));

        if (booking.getFlight() != null) {
            Map<String, Object> flight = new LinkedHashMap<>();
            flight.put("flightNumber", booking.getFlight().getFlightNumber());
            flight.put("airline", booking.getFlight().getAirline());
            flight.put("origin", booking.getFlight().getOrigin());
            flight.put("destination", booking.getFlight().getDestination());
            flight.put("originCode", booking.getFlight().getOriginCode());
            flight.put("destinationCode", booking.getFlight().getDestinationCode());
            flight.put("departureTime", booking.getFlight().getDepartureTime().format(fmt));
            flight.put("arrivalTime", booking.getFlight().getArrivalTime().format(fmt));
            flight.put("aircraftType", booking.getFlight().getAircraftType());
            dto.put("flight", flight);
        }

        return dto;
    }
}
