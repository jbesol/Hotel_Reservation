package com.miportafolio.hotel_reservation.exception;

// Se lanza cuando una regla de negocio se viola
// Por ejemplo: intentar reservar una habitación no disponible
public class BusinessException extends RuntimeException {

    public BusinessException(String mensaje) {
        super(mensaje);
    }
}