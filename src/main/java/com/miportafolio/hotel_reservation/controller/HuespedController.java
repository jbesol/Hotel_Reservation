package com.miportafolio.hotel_reservation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miportafolio.hotel_reservation.dto.HuespedDto;
import com.miportafolio.hotel_reservation.service.HuespedService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/huespedes")
public class HuespedController {

    private final HuespedService huespedService;

    public HuespedController(HuespedService huespedService) {
        this.huespedService = huespedService;
    }

    @PostMapping
    public ResponseEntity<HuespedDto.Response> crear(
            @Valid @RequestBody HuespedDto.Request request) {
        return ResponseEntity.status(201).body(huespedService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<HuespedDto.Response>> listarTodos() {
        return ResponseEntity.ok(huespedService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HuespedDto.Response> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(huespedService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HuespedDto.Response> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody HuespedDto.Request request) {
        return ResponseEntity.ok(huespedService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        huespedService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}