package com.airline.booking.dto;

public class SeatDto {
    private Long id;
    private String seatNumber;
    private String seatClass;
    private Boolean available;
    private Double price;
    private int row;
    private char column;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public int getRow() { return row; }
    public void setRow(int row) { this.row = row; }
    public char getColumn() { return column; }
    public void setColumn(char column) { this.column = column; }

    public static SeatDto fromEntity(com.airline.booking.entity.Seat seat) {
        SeatDto dto = new SeatDto();
        dto.setId(seat.getId());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setSeatClass(seat.getSeatClass());
        dto.setAvailable(seat.getAvailable());
        dto.setPrice(seat.getPrice());
        String seatNum = seat.getSeatNumber();
        dto.setColumn(seatNum.charAt(0));
        dto.setRow(Integer.parseInt(seatNum.substring(1)));
        return dto;
    }
}
