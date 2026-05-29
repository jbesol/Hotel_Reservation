package com.miportafolio.hotel_reservation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.miportafolio.hotel_reservation.dto.HuespedDto;
import com.miportafolio.hotel_reservation.entity.Huesped;
import com.miportafolio.hotel_reservation.exception.BusinessException;
import com.miportafolio.hotel_reservation.exception.ResourceNotFoundException;
import com.miportafolio.hotel_reservation.repository.HuespedRepository;

@Service
public class HuespedService {

    private final HuespedRepository huespedRepository;

    public HuespedService(HuespedRepository huespedRepository) {
        this.huespedRepository = huespedRepository;
    }

    public HuespedDto.Response crear(HuespedDto.Request request) {
        // Verificar email único
        if (huespedRepository.existsByEmail(request.email())) {
            throw new BusinessException("Ya existe un huésped con el email " + request.email());
        }

        // Verificar documento único
        if (huespedRepository.existsByDocumento(request.documento())) {
            throw new BusinessException("Ya existe un huésped con el documento " + request.documento());
        }

        Huesped huesped = new Huesped();
        huesped.setNombre(request.nombre());
        huesped.setApellido(request.apellido());
        huesped.setEmail(request.email());
        huesped.setTelefono(request.telefono());
        huesped.setDocumento(request.documento());

        return toResponse(huespedRepository.save(huesped));
    }

    public List<HuespedDto.Response> listarTodos() {
        return huespedRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public HuespedDto.Response obtenerPorId(Long id) {
        return toResponse(buscarPorId(id));
    }

    public HuespedDto.Response actualizar(Long id, HuespedDto.Request request) {
        Huesped huesped = buscarPorId(id);
        huesped.setNombre(request.nombre());
        huesped.setApellido(request.apellido());
        huesped.setEmail(request.email());
        huesped.setTelefono(request.telefono());
        huesped.setDocumento(request.documento());
        return toResponse(huespedRepository.save(huesped));
    }

    public void eliminar(Long id) {
        Huesped huesped = buscarPorId(id);
        huespedRepository.delete(huesped);
    }

    public Huesped buscarPorId(Long id) {
        return huespedRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Huesped", id));
    }

    private HuespedDto.Response toResponse(Huesped h) {
        return new HuespedDto.Response(
            h.getId(),
            h.getNombre(),
            h.getApellido(),
            h.getEmail(),
            h.getTelefono(),
            h.getDocumento()
        );
    }
}