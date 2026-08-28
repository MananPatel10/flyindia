package com.airline.booking.dto;

public class AuthDto {
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String role;
        private String message;

        public AuthResponse(String token, String email, String name, String role) {
            this.token = token;
            this.email = email;
            this.name = name;
            this.role = role;
        }

        public String getToken() { return token; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getRole() { return role; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
