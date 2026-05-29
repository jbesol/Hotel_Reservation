package com.miportafolio.hotel_reservation.entity;

import com.miportafolio.hotel_reservation.enums.TipoHabitacion;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "habitaciones")
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @NotBlank valida que el campo no sea null ni vacío
    @NotBlank(message = "El número de habitación es obligatorio")
    @Column(name = "num_habitacion", nullable = false, unique = true)
    private String num_habitacion;

    @Enumerated(EnumType.STRING) // guarda el nombre del enum como string en la DB
    @Column(nullable = false)
    private TipoHabitacion tipo;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a cero")
    @Column(nullable = false)
    private Double precioPorNoche;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Boolean disponible = true;

    public Habitacion() {}

    public Habitacion(String num_habitacion, TipoHabitacion tipo, Double precioPorNoche, Integer capacidad) {
        this.num_habitacion = num_habitacion;
        this.tipo = tipo;
        this.precioPorNoche = precioPorNoche;
        this.capacidad = capacidad;
        this.disponible = true;
    }

    // Getters y setters
    public Long getId() { return id; }

    public String getNumHabitacion() { return num_habitacion; }
    public void setNumHabitacion(String num_habitacion) { this.num_habitacion = num_habitacion; }

    public TipoHabitacion getTipo() { return tipo; }
    public void setTipo(TipoHabitacion tipo) { this.tipo = tipo; }

    public Double getPrecioPorNoche() { return precioPorNoche; }
    public void setPrecioPorNoche(Double precioPorNoche) { this.precioPorNoche = precioPorNoche; }

    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
}