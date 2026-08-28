package com.airline.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String bookingRef;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
    
    private String seatNumber;
    private String seatClass;
    
    @Column(nullable = false)
    private String passengerName;
    
    private String passengerEmail;
    private String passengerPhone;
    
    @Column(nullable = false)
    private Double totalPrice;
    
    @Column(nullable = false)
    private String status = "CONFIRMED";
    
    private String paymentMethod;
    
    private LocalDateTime bookedAt = LocalDateTime.now();
    private LocalDateTime travelDate;

    public Booking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
    public LocalDateTime getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDateTime travelDate) { this.travelDate = travelDate; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Booking b = new Booking();
        public Builder bookingRef(String v) { b.bookingRef = v; return this; }
        public Builder user(User v) { b.user = v; return this; }
        public Builder flight(Flight v) { b.flight = v; return this; }
        public Builder seatNumber(String v) { b.seatNumber = v; return this; }
        public Builder seatClass(String v) { b.seatClass = v; return this; }
        public Builder passengerName(String v) { b.passengerName = v; return this; }
        public Builder passengerEmail(String v) { b.passengerEmail = v; return this; }
        public Builder passengerPhone(String v) { b.passengerPhone = v; return this; }
        public Builder totalPrice(Double v) { b.totalPrice = v; return this; }
        public Builder status(String v) { b.status = v; return this; }
        public Builder paymentMethod(String v) { b.paymentMethod = v; return this; }
        public Builder travelDate(LocalDateTime v) { b.travelDate = v; return this; }
        public Booking build() { return b; }
    }
}
