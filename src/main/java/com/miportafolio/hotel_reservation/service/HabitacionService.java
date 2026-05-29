package com.miportafolio.hotel_reservation.service;

import com.miportafolio.hotel_reservation.dto.HabitacionDto;
import com.miportafolio.hotel_reservation.entity.Habitacion;
import com.miportafolio.hotel_reservation.enums.TipoHabitacion;
import com.miportafolio.hotel_reservation.exception.BusinessException;
import com.miportafolio.hotel_reservation.exception.ResourceNotFoundException;
import com.miportafolio.hotel_reservation.repository.HabitacionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class HabitacionService {

    private final HabitacionRepository habitacionRepository;

    public HabitacionService(HabitacionRepository habitacionRepository) {
        this.habitacionRepository = habitacionRepository;
    }

    public HabitacionDto.Response crear(HabitacionDto.Request request) {
        // Verificar que no exista una habitación con el mismo número
        habitacionRepository.findAll().stream()
            .filter(h -> h.getNumHabitacion().equals(request.numHabitacion()))
            .findFirst()
            .ifPresent(h -> {
                throw new BusinessException("Ya existe una habitación con el número " + request.numHabitacion());
            });

        Habitacion habitacion = new Habitacion(
            request.numHabitacion(),
            request.tipo(),
            request.precioPorNoche(),
            request.capacidad()
        );
        habitacion.setDescripcion(request.descripcion());

        return toResponse(habitacionRepository.save(habitacion));
    }

    public List<HabitacionDto.Response> listarTodas() {
        return habitacionRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public HabitacionDto.Response obtenerPorId(Long id) {
        return toResponse(buscarPorId(id));
    }

    public List<HabitacionDto.Response> listarDisponibles() {
        return habitacionRepository.findByDisponible(true)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<HabitacionDto.Response> listarPorTipo(TipoHabitacion tipo) {
        return habitacionRepository.findByTipo(tipo)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<HabitacionDto.Response> buscarDisponiblesEnFechas(
            LocalDate checkIn, LocalDate checkOut) {

        if (checkIn.isAfter(checkOut) || checkIn.isEqual(checkOut)) {
            throw new BusinessException("El check-in debe ser antes del check-out");
        }

        return habitacionRepository
            .findHabitacionesDisponiblesEnFechas(checkIn, checkOut)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public HabitacionDto.Response actualizar(Long id, HabitacionDto.Request request) {
        Habitacion habitacion = buscarPorId(id);
        habitacion.setNumHabitacion(request.numHabitacion());
        habitacion.setTipo(request.tipo());
        habitacion.setPrecioPorNoche(request.precioPorNoche());
        habitacion.setCapacidad(request.capacidad());
        habitacion.setDescripcion(request.descripcion());
        return toResponse(habitacionRepository.save(habitacion));
    }

    public void eliminar(Long id) {
        Habitacion habitacion = buscarPorId(id);
        habitacionRepository.delete(habitacion);
    }

    // Método interno reutilizable — busca la entidad o lanza excepción
    public Habitacion buscarPorId(Long id) {
        return habitacionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Habitacion", id));
    }

    // Convierte entidad a DTO de respuesta
    private HabitacionDto.Response toResponse(Habitacion h) {
        return new HabitacionDto.Response(
            h.getId(),
            h.getNumHabitacion(),
            h.getTipo(),
            h.getPrecioPorNoche(),
            h.getCapacidad(),
            h.getDescripcion(),
            h.getDisponible()
        );
    }
}