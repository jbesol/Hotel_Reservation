package com.miportafolio.hotel_reservation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.miportafolio.hotel_reservation.dto.ReservaDto;
import com.miportafolio.hotel_reservation.enums.EstadoReserva;
import com.miportafolio.hotel_reservation.service.ReservaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<ReservaDto.Response> crear(
            @Valid @RequestBody ReservaDto.Request request) {
        return ResponseEntity.status(201).body(reservaService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<ReservaDto.ResumenResponse>> listarTodas() {
        return ResponseEntity.ok(reservaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDto.Response> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.obtenerPorId(id));
    }

    @GetMapping("/huesped/{huespedId}")
    public ResponseEntity<List<ReservaDto.ResumenResponse>> listarPorHuesped(
            @PathVariable Long huespedId) {
        return ResponseEntity.ok(reservaService.listarPorHuesped(huespedId));
    }

    // PATCH — cambia solo el estado, no toda la reserva
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ReservaDto.Response> cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoReserva nuevoEstado) {
        return ResponseEntity.ok(reservaService.cambiarEstado(id, nuevoEstado));
    }
}