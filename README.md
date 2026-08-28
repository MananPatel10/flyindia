# ✈️ FlyIndia — Indian Flight Booking System

A full-stack end-to-end flight booking system for Indian airlines built with **Java Spring Boot** backend and **React + TypeScript + Tailwind CSS** frontend.

## Features

- 🔍 **Flight Search** — Search across 20+ Indian cities with 6 airlines
- 💺 **Seat Selection** — Interactive seat map with Business, Premium Economy & Economy classes
- 📋 **Booking System** — Complete booking flow with PNR generation
- 🔐 **JWT Authentication** — Register/Login with role-based access (User & Admin)
- 🎫 **My Trips** — View and cancel bookings
- 👨‍💼 **Admin Dashboard** — Manage flights and view stats
- 💳 **Payment Simulation** — UPI, Cards, Net Banking, Wallets

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Java 21+, Spring Boot 3.4, Spring Security, JPA, H2 DB |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4              |
| Auth     | JWT (jjwt), BCrypt password hashing                     |
| Database | H2 In-Memory (seeded with Indian airports & flights)    |

## Supported Airlines

IndiGo · Air India · Vistara · SpiceJet · AirAsia India · GoFirst

## Supported Airports (20 cities)

Delhi (DEL) · Mumbai (BOM) · Bangalore (BLR) · Chennai (MAA) · Kolkata (CCU) · Hyderabad (HYD) · Ahmedabad (AMD) · Pune (PNQ) · Goa (GOI) · Jaipur (JAI) · Lucknow (LKO) · Chandigarh (IXC) · Kochi (COK) · Thiruvananthapuram (TRV) · Guwahati (GAU) · Patna (PAT) · Bhopal (BHO) · Indore (IDR) · Nagpur (NAG) · Coimbatore (CJB)

## Getting Started

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 18+ & npm

### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (proxies API to :8080)
```

### Demo Credentials

| Role  | Email                | Password  |
| ----- | -------------------- | --------- |
| User  | rahul@example.com    | password  |
| Admin | admin@airline.com    | admin123  |

## API Endpoints

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | `/api/auth/register`     | Register new user    |
| POST   | `/api/auth/login`        | Login & get JWT      |
| GET    | `/api/flights/airports`  | List all airports    |
| GET    | `/api/flights/search`    | Search flights       |
| GET    | `/api/flights/{id}`      | Get flight details   |
| GET    | `/api/flights/{id}/seats`| Get available seats  |
| POST   | `/api/bookings`          | Create booking       |
| GET    | `/api/bookings`          | My bookings          |
| PUT    | `/api/bookings/{ref}/cancel` | Cancel booking  |
