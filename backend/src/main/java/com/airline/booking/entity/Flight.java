package com.airline.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String flightNumber;
    
    @Column(nullable = false)
    private String airline;
    
    @Column(nullable = false)
    private String origin;
    
    @Column(nullable = false)
    private String destination;
    
    private String originCode;
    private String destinationCode;
    
    @Column(nullable = false)
    private LocalDateTime departureTime;
    
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    @Column(nullable = false)
    private Integer totalSeats;
    
    @Column(nullable = false)
    private Integer availableSeats;
    
    @Column(nullable = false)
    private Double basePrice;
    
    private String aircraftType;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public Flight() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getOriginCode() { return originCode; }
    public void setOriginCode(String originCode) { this.originCode = originCode; }
    public String getDestinationCode() { return destinationCode; }
    public void setDestinationCode(String destinationCode) { this.destinationCode = destinationCode; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }
    public String getAircraftType() { return aircraftType; }
    public void setAircraftType(String aircraftType) { this.aircraftType = aircraftType; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Flight f = new Flight();
        public Builder flightNumber(String v) { f.flightNumber = v; return this; }
        public Builder airline(String v) { f.airline = v; return this; }
        public Builder origin(String v) { f.origin = v; return this; }
        public Builder destination(String v) { f.destination = v; return this; }
        public Builder originCode(String v) { f.originCode = v; return this; }
        public Builder destinationCode(String v) { f.destinationCode = v; return this; }
        public Builder departureTime(LocalDateTime v) { f.departureTime = v; return this; }
        public Builder arrivalTime(LocalDateTime v) { f.arrivalTime = v; return this; }
        public Builder totalSeats(Integer v) { f.totalSeats = v; return this; }
        public Builder availableSeats(Integer v) { f.availableSeats = v; return this; }
        public Builder basePrice(Double v) { f.basePrice = v; return this; }
        public Builder aircraftType(String v) { f.aircraftType = v; return this; }
        public Builder active(Boolean v) { f.active = v; return this; }
        public Flight build() { return f; }
    }
}
