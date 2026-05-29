package com.miportafolio.hotel_reservation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class HuespedDto {

    public record Request(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        @Email(message = "El email debe tener formato válido")
        @NotBlank(message = "El email es obligatorio")
        String email,

        @NotBlank(message = "El teléfono es obligatorio")
        String telefono,

        @NotBlank(message = "El documento es obligatorio")
        String documento
    ) {}

    public record Response(
        Long id,
        String nombre,
        String apellido,
        String email,
        String telefono,
        String documento
    ) {}
}