package com.airline.booking.service;

import com.airline.booking.entity.*;
import com.airline.booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Booking createBooking(Long userId, Long flightId, String seatNumber,
                                  String seatClass, String passengerName,
                                  String passengerEmail, String passengerPhone,
                                  String paymentMethod) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (flight.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available on this flight");
        }

        Seat seat = seatRepository.findByFlightIdAndSeatNumber(flightId, seatNumber)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (!seat.getAvailable()) {
            throw new RuntimeException("Seat " + seatNumber + " is already booked");
        }

        Double price = seat.getPrice() != null ? seat.getPrice() : flight.getBasePrice();
        String bookingRef = "IND" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .bookingRef(bookingRef)
                .user(user)
                .flight(flight)
                .seatNumber(seatNumber)
                .seatClass(seatClass)
                .passengerName(passengerName)
                .passengerEmail(passengerEmail)
                .passengerPhone(passengerPhone)
                .totalPrice(price)
                .status("CONFIRMED")
                .paymentMethod(paymentMethod)
                .travelDate(flight.getDepartureTime())
                .build();

        seat.setAvailable(false);
        seatRepository.save(seat);

        flight.setAvailableSeats(flight.getAvailableSeats() - 1);
        flightRepository.save(flight);

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByBookedAtDesc(userId);
    }

    public Booking getBookingByRef(String bookingRef) {
        return bookingRepository.findByBookingRef(bookingRef)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Transactional
    public Booking cancelBooking(String bookingRef, Long userId) {
        Booking booking = bookingRepository.findByBookingRef(bookingRef)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getUser().getId() != userId) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus("CANCELLED");
        
        Seat seat = seatRepository.findByFlightIdAndSeatNumber(
                booking.getFlight().getId(), booking.getSeatNumber()).orElse(null);
        if (seat != null) {
            seat.setAvailable(true);
            seatRepository.save(seat);
        }

        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + 1);
        flightRepository.save(flight);

        return bookingRepository.save(booking);
    }
}
