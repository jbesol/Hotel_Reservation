package com.miportafolio.hotel_reservation.enums;

public enum EstadoReserva {
    PENDIENTE,      // reserva creada, esperando confirmación
    CONFIRMADA,     // reserva confirmada, habitación bloqueada
    CHECKED_IN,     // huésped ya está en el hotel
    CHECKED_OUT,    // huésped salió
    CANCELADA       // reserva cancelada
}