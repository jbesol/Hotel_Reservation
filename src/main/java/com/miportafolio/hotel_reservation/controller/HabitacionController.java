package com.miportafolio.hotel_reservation.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.miportafolio.hotel_reservation.dto.HabitacionDto;
import com.miportafolio.hotel_reservation.enums.TipoHabitacion;
import com.miportafolio.hotel_reservation.service.HabitacionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/habitaciones")
public class HabitacionController {

    private final HabitacionService habitacionService;

    public HabitacionController(HabitacionService habitacionService) {
        this.habitacionService = habitacionService;
    }

    // @Valid activa las validaciones del DTO — @NotBlank, @Email, etc
    @PostMapping
    public ResponseEntity<HabitacionDto.Response> crear(
            @Valid @RequestBody HabitacionDto.Request request) {
        return ResponseEntity.status(201).body(habitacionService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<HabitacionDto.Response>> listarTodas() {
        return ResponseEntity.ok(habitacionService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitacionDto.Response> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(habitacionService.obtenerPorId(id));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<HabitacionDto.Response>> listarDisponibles() {
        return ResponseEntity.ok(habitacionService.listarDisponibles());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<HabitacionDto.Response>> listarPorTipo(
            @PathVariable TipoHabitacion tipo) {
        return ResponseEntity.ok(habitacionService.listarPorTipo(tipo));
    }

    // Busca habitaciones disponibles en un rango de fechas
    // GET /habitaciones/disponibles/fechas?checkIn=2026-06-01&checkOut=2026-06-05
    @GetMapping("/disponibles/fechas")
    public ResponseEntity<List<HabitacionDto.Response>> buscarDisponiblesEnFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ResponseEntity.ok(habitacionService.buscarDisponiblesEnFechas(checkIn, checkOut));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitacionDto.Response> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody HabitacionDto.Request request) {
        return ResponseEntity.ok(habitacionService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        habitacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}