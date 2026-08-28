package com.airline.booking.config;

import com.airline.booking.entity.*;
import com.airline.booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private FlightRepository flightRepository;
    @Autowired private SeatRepository seatRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private static final List<Map<String, String>> INDIAN_AIRPORTS = Arrays.asList(
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
    );

    @Override
    public void run(String... args) {
        // Create admin
        userRepository.save(User.builder()
            .name("Admin").email("admin@airline.com")
            .password(passwordEncoder.encode("admin123"))
            .phone("9999999999").role("ADMIN").build());

        // Create demo user
        userRepository.save(User.builder()
            .name("Rahul Sharma").email("rahul@example.com")
            .password(passwordEncoder.encode("password"))
            .phone("9876543210").role("USER").build());

        // Indian airlines
        String[] airlines = {"IndiGo", "Air India", "Vistara", "SpiceJet", "AirAsia India", "GoFirst"};
        String[] aircraft = {"Airbus A320neo", "Boeing 787 Dreamliner", "Airbus A321neo", "Boeing 737 MAX 8", "ATR 72-600", "Airbus A320ceo"};

        Random random = new Random(42);
        int flightCount = 0;

        for (int dayOffset = 0; dayOffset < 3; dayOffset++) {
            LocalDateTime date = LocalDateTime.now().plusDays(dayOffset + 1).withHour(0).withMinute(0).withSecond(0);
            
            for (Map<String, String> origin : INDIAN_AIRPORTS) {
                for (Map<String, String> dest : INDIAN_AIRPORTS) {
                    if (origin.get("city").equals(dest.get("city"))) continue;
                    if (random.nextInt(3) > 0) continue; // Only ~33% random routes

                    String airline = airlines[random.nextInt(airlines.length)];
                    String aircraftType = aircraft[random.nextInt(aircraft.length)];
                    
                    int hour = 5 + random.nextInt(16);
                    int minute = random.nextInt(4) * 15;
                    LocalDateTime departure = date.withHour(hour).withMinute(minute);
                    
                    int durationHours = 1 + random.nextInt(3);
                    int durationMinutes = random.nextInt(4) * 15;
                    LocalDateTime arrival = departure.plusHours(durationHours).plusMinutes(durationMinutes);
                    
                    double basePrice = 2500 + random.nextInt(8000);
                    
                    String flightCode = airline.substring(0, 2).toUpperCase() 
                        + String.format("%04d", 1000 + flightCount % 9000);

                    Flight flight = Flight.builder()
                        .flightNumber(flightCode)
                        .airline(airline)
                        .origin(origin.get("city"))
                        .destination(dest.get("city"))
                        .originCode(origin.get("code"))
                        .destinationCode(dest.get("code"))
                        .departureTime(departure)
                        .arrivalTime(arrival)
                        .totalSeats(180)
                        .availableSeats(150 + random.nextInt(30))
                        .basePrice(basePrice)
                        .aircraftType(aircraftType)
                        .active(true)
                        .build();

                    flight = flightRepository.save(flight);
                    createSeats(flight, basePrice);
                    flightCount++;
                }
            }
        }
        // Seed popular routes with multiple flights per day
        String[][] popularRoutes = {
            {"Delhi", "DEL", "Mumbai", "BOM"},
            {"Mumbai", "BOM", "Delhi", "DEL"},
            {"Delhi", "DEL", "Bangalore", "BLR"},
            {"Bangalore", "BLR", "Delhi", "DEL"},
            {"Mumbai", "BOM", "Bangalore", "BLR"},
            {"Bangalore", "BLR", "Mumbai", "BOM"},
            {"Delhi", "DEL", "Goa", "GOI"},
            {"Mumbai", "BOM", "Chennai", "MAA"},
            {"Delhi", "DEL", "Kolkata", "CCU"},
            {"Chennai", "MAA", "Delhi", "DEL"},
            {"Hyderabad", "HYD", "Delhi", "DEL"},
            {"Delhi", "DEL", "Jaipur", "JAI"},
        };
        
        String[] times = {"06:00", "08:30", "10:15", "13:00", "15:45", "18:30", "20:00", "22:15"};
        
        for (int dayOffset = 0; dayOffset < 7; dayOffset++) {
            LocalDateTime date = LocalDateTime.now().plusDays(dayOffset + 1).withHour(0).withMinute(0).withSecond(0);
            for (String[] route : popularRoutes) {
                for (int t = 0; t < 3; t++) {
                    String[] timeParts = times[(dayOffset * 3 + t) % times.length].split(":");
                    int hour = Integer.parseInt(timeParts[0]);
                    int minute = Integer.parseInt(timeParts[1]);
                    LocalDateTime departure = date.withHour(hour).withMinute(minute);
                    LocalDateTime arrival = departure.plusHours(1 + random.nextInt(3)).plusMinutes(random.nextInt(4) * 15);
                    
                    String airline = airlines[random.nextInt(airlines.length)];
                    double basePrice = 2800 + random.nextInt(6000);
                    String flightCode = airline.substring(0, 2).toUpperCase() + String.format("%04d", 5000 + flightCount % 5000);
                    
                    Flight flight = Flight.builder()
                        .flightNumber(flightCode).airline(airline)
                        .origin(route[0]).destination(route[2])
                        .originCode(route[1]).destinationCode(route[3])
                        .departureTime(departure).arrivalTime(arrival)
                        .totalSeats(180).availableSeats(150 + random.nextInt(30))
                        .basePrice(basePrice).aircraftType(aircraft[random.nextInt(aircraft.length)])
                        .active(true).build();
                    
                    flight = flightRepository.save(flight);
                    createSeats(flight, basePrice);
                    flightCount++;
                }
            }
        }
        
        System.out.println("✅ Database seeded with " + flightCount + " flights across " + INDIAN_AIRPORTS.size() + " Indian airports");
    }

    private void createSeats(Flight flight, double basePrice) {
        List<Seat> seats = new ArrayList<>();
        char[] rows = "ABCDEF".toCharArray();

        // Business class (rows 1-3)
        for (int row = 1; row <= 3; row++) {
            for (char col : new char[]{'A', 'D'}) {
                seats.add(Seat.builder()
                    .flight(flight).seatNumber(col + String.valueOf(row))
                    .seatClass("BUSINESS").available(true)
                    .price(basePrice * 2.5).build());
            }
        }

        // Premium Economy (rows 4-7)
        for (int row = 4; row <= 7; row++) {
            for (char col : rows) {
                seats.add(Seat.builder()
                    .flight(flight).seatNumber(col + String.valueOf(row))
                    .seatClass("PREMIUM_ECONOMY").available(true)
                    .price(basePrice * 1.5).build());
            }
        }

        // Economy (rows 8-30)
        for (int row = 8; row <= 30; row++) {
            for (char col : rows) {
                seats.add(Seat.builder()
                    .flight(flight).seatNumber(col + String.valueOf(row))
                    .seatClass("ECONOMY").available(true)
                    .price(basePrice + (row > 20 ? 200 : 0)).build());
            }
        }

        seatRepository.saveAll(seats);
    }
}
