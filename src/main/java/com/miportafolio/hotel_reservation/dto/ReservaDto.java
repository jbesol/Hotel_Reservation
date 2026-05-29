package com.miportafolio.hotel_reservation.dto;

import java.time.LocalDate;

import com.miportafolio.hotel_reservation.enums.EstadoReserva;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

public class ReservaDto {

    public record Request(
        @NotNull(message = "El id del huésped es obligatorio")
        Long huespedId,

        @NotNull(message = "El id de la habitación es obligatorio")
        Long habitacionId,

        @NotNull(message = "La fecha de check-in es obligatoria")
        @FutureOrPresent(message = "El check-in no puede ser en el pasado")
        LocalDate checkIn,

        @NotNull(message = "La fecha de check-out es obligatoria")
        @Future(message = "El check-out debe ser en el futuro")
        LocalDate checkOut,

        String observaciones
    ) {}

    public record Response(
        Long id,
        HuespedDto.Response huesped,
        HabitacionDto.Response habitacion,
        LocalDate checkIn,
        LocalDate checkOut,
        EstadoReserva estado,
        Double totalPagar,
        String observaciones
    ) {}

    // DTO simplificado para listar reservas sin toda la info
    public record ResumenResponse(
        Long id,
        String nombreHuesped,
        String numHabitacion,
        LocalDate checkIn,
        LocalDate checkOut,
        EstadoReserva estado,
        Double totalPagar
    ) {}
}