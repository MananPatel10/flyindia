package com.airline.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seats", uniqueConstraints = @UniqueConstraint(columnNames = {"flight_id", "seatNumber"}))
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
    
    @Column(nullable = false)
    private String seatNumber;
    
    @Column(nullable = false)
    private String seatClass;
    
    @Column(nullable = false)
    private Boolean available = true;
    
    private Double price;

    public Seat() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Seat s = new Seat();
        public Builder flight(Flight v) { s.flight = v; return this; }
        public Builder seatNumber(String v) { s.seatNumber = v; return this; }
        public Builder seatClass(String v) { s.seatClass = v; return this; }
        public Builder available(Boolean v) { s.available = v; return this; }
        public Builder price(Double v) { s.price = v; return this; }
        public Seat build() { return s; }
    }
}
