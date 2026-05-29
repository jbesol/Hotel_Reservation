package com.miportafolio.hotel_reservation.dto;

import com.miportafolio.hotel_reservation.enums.TipoHabitacion;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class HabitacionDto {

    // Request DTO — lo que recibe la API para crear/actualizar
    public record Request(
        @NotBlank(message = "El número de habitación es obligatorio")
        String numHabitacion,

        @NotNull(message = "El tipo es obligatorio")
        TipoHabitacion tipo,

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a cero")
        Double precioPorNoche,

        @NotNull(message = "La capacidad es obligatoria")
        @Min(value = 1, message = "La capacidad mínima es 1")
        Integer capacidad,

        String descripcion
    ) {}

    // Response DTO — lo que devuelve la API
    public record Response(
        Long id,
        String numHabitacion,
        TipoHabitacion tipo,
        Double precioPorNoche,
        Integer capacidad,
        String descripcion,
        Boolean disponible
    ) {}
}