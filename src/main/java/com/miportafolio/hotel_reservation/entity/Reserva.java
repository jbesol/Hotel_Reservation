package com.miportafolio.hotel_reservation.entity;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import com.miportafolio.hotel_reservation.enums.EstadoReserva;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación muchos a uno — muchas reservas pertenecen a un huésped
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "huesped_id", nullable = false)
    private Huesped huesped;

    // Relación muchos a uno — muchas reservas pueden ser para una habitación
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;

    @NotNull(message = "La fecha de check-in es obligatoria")
    @Column(nullable = false)
    private LocalDate checkIn;

    @NotNull(message = "La fecha de check-out es obligatoria")
    @Column(nullable = false)
    private LocalDate checkOut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado = EstadoReserva.PENDIENTE;

    @Column(nullable = false)
    private Double totalPagar;

    @Column(length = 500)
    private String observaciones;

    public Reserva() {}

    // Calcula el total automáticamente basado en las noches
    public void calcularTotal() {
        if (checkIn != null && checkOut != null && habitacion != null) {
            long noches = ChronoUnit.DAYS.between(checkIn, checkOut);
            this.totalPagar = noches * habitacion.getPrecioPorNoche();
        }
    }

    // Getters y setters
    public Long getId() { return id; }

    public Huesped getHuesped() { return huesped; }
    public void setHuesped(Huesped huesped) { this.huesped = huesped; }

    public Habitacion getHabitacion() { return habitacion; }
    public void setHabitacion(Habitacion habitacion) { this.habitacion = habitacion; }

    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }

    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }

    public EstadoReserva getEstado() { return estado; }
    public void setEstado(EstadoReserva estado) { this.estado = estado; }

    public Double getTotalPagar() { return totalPagar; }
    public void setTotalPagar(Double totalPagar) { this.totalPagar = totalPagar; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}