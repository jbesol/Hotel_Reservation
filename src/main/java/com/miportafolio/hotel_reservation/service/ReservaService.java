package com.miportafolio.hotel_reservation.service;

import com.miportafolio.hotel_reservation.dto.HabitacionDto;
import com.miportafolio.hotel_reservation.dto.HuespedDto;
import com.miportafolio.hotel_reservation.dto.ReservaDto;
import com.miportafolio.hotel_reservation.entity.Habitacion;
import com.miportafolio.hotel_reservation.entity.Huesped;
import com.miportafolio.hotel_reservation.entity.Reserva;
import com.miportafolio.hotel_reservation.enums.EstadoReserva;
import com.miportafolio.hotel_reservation.exception.BusinessException;
import com.miportafolio.hotel_reservation.exception.ResourceNotFoundException;
import com.miportafolio.hotel_reservation.repository.ReservaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final HabitacionService habitacionService;
    private final HuespedService huespedService;

    public ReservaService(
            ReservaRepository reservaRepository,
            HabitacionService habitacionService,
            HuespedService huespedService) {
        this.reservaRepository = reservaRepository;
        this.habitacionService = habitacionService;
        this.huespedService = huespedService;
    }

    // @Transactional garantiza que todo el método se ejecuta en una sola transacción
    // Si algo falla a mitad, todo se revierte automáticamente
    @Transactional
    public ReservaDto.Response crear(ReservaDto.Request request) {
        // Validar fechas
        if (!request.checkOut().isAfter(request.checkIn())) {
            throw new BusinessException("El check-out debe ser posterior al check-in");
        }

        // Obtener huésped y habitación
        Huesped huesped = huespedService.buscarPorId(request.huespedId());
        Habitacion habitacion = habitacionService.buscarPorId(request.habitacionId());

        // Verificar que la habitación está disponible
        if (!habitacion.getDisponible()) {
            throw new BusinessException("La habitación no está disponible");
        }

        // Verificar conflicto de fechas — previene double booking
        if (reservaRepository.existeConflictoFechas(
                habitacion.getId(), request.checkIn(), request.checkOut())) {
            throw new BusinessException(
                "La habitación ya tiene una reserva confirmada para esas fechas");
        }

        // Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setHuesped(huesped);
        reserva.setHabitacion(habitacion);
        reserva.setCheckIn(request.checkIn());
        reserva.setCheckOut(request.checkOut());
        reserva.setObservaciones(request.observaciones());
        reserva.calcularTotal();

        return toResponse(reservaRepository.save(reserva));
    }

    public List<ReservaDto.ResumenResponse> listarTodas() {
        return reservaRepository.findAll()
            .stream()
            .map(this::toResumen)
            .toList();
    }

    public ReservaDto.Response obtenerPorId(Long id) {
        return toResponse(buscarPorId(id));
    }

    public List<ReservaDto.ResumenResponse> listarPorHuesped(Long huespedId) {
        return reservaRepository.findByHuespedId(huespedId)
            .stream()
            .map(this::toResumen)
            .toList();
    }

    // Cambio de estado — contiene las reglas de negocio de transiciones
    @Transactional
    public ReservaDto.Response cambiarEstado(Long id, EstadoReserva nuevoEstado) {
        Reserva reserva = buscarPorId(id);

        validarTransicion(reserva.getEstado(), nuevoEstado);

        // Si se cancela, liberamos la habitación
        if (nuevoEstado == EstadoReserva.CANCELADA) {
            reserva.getHabitacion().setDisponible(true);
        }

        // Si hace check-in, marcamos la habitación como ocupada
        if (nuevoEstado == EstadoReserva.CHECKED_IN) {
            reserva.getHabitacion().setDisponible(false);
        }

        // Si hace check-out, liberamos la habitación
        if (nuevoEstado == EstadoReserva.CHECKED_OUT) {
            reserva.getHabitacion().setDisponible(true);
        }

        reserva.setEstado(nuevoEstado);
        return toResponse(reservaRepository.save(reserva));
    }

    // Valida que la transición de estado sea válida
    private void validarTransicion(EstadoReserva actual, EstadoReserva nuevo) {
        boolean valida = switch (actual) {
            case PENDIENTE -> nuevo == EstadoReserva.CONFIRMADA || nuevo == EstadoReserva.CANCELADA;
            case CONFIRMADA -> nuevo == EstadoReserva.CHECKED_IN || nuevo == EstadoReserva.CANCELADA;
            case CHECKED_IN -> nuevo == EstadoReserva.CHECKED_OUT;
            case CHECKED_OUT, CANCELADA -> false;
        };

        if (!valida) {
            throw new BusinessException(
                "No se puede cambiar de " + actual + " a " + nuevo);
        }
    }

    private Reserva buscarPorId(Long id) {
        return reservaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));
    }

    private ReservaDto.Response toResponse(Reserva r) {
        HuespedDto.Response huesped = new HuespedDto.Response(
            r.getHuesped().getId(),
            r.getHuesped().getNombre(),
            r.getHuesped().getApellido(),
            r.getHuesped().getEmail(),
            r.getHuesped().getTelefono(),
            r.getHuesped().getDocumento()
        );

        HabitacionDto.Response habitacion = new HabitacionDto.Response(
            r.getHabitacion().getId(),
            r.getHabitacion().getNumHabitacion(),
            r.getHabitacion().getTipo(),
            r.getHabitacion().getPrecioPorNoche(),
            r.getHabitacion().getCapacidad(),
            r.getHabitacion().getDescripcion(),
            r.getHabitacion().getDisponible()
        );

        return new ReservaDto.Response(
            r.getId(),
            huesped,
            habitacion,
            r.getCheckIn(),
            r.getCheckOut(),
            r.getEstado(),
            r.getTotalPagar(),
            r.getObservaciones()
        );
    }

    private ReservaDto.ResumenResponse toResumen(Reserva r) {
        return new ReservaDto.ResumenResponse(
            r.getId(),
            r.getHuesped().getNombre() + " " + r.getHuesped().getApellido(),
            r.getHabitacion().getNumHabitacion(),
            r.getCheckIn(),
            r.getCheckOut(),
            r.getEstado(),
            r.getTotalPagar()
        );
    }
}