package com.miportafolio.hotel_reservation.repository;

import com.miportafolio.hotel_reservation.entity.Reserva;
import com.miportafolio.hotel_reservation.enums.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByHuespedId(Long huespedId);

    List<Reserva> findByEstado(EstadoReserva estado);

    List<Reserva> findByHabitacionId(Long habitacionId);

    // Verifica si hay conflicto de fechas para una habitación
    // Se usa antes de crear una reserva para evitar doble booking
    @Query("""
        SELECT COUNT(r) > 0 FROM Reserva r
        WHERE r.habitacion.id = :habitacionId
        AND r.estado IN ('CONFIRMADA', 'CHECKED_IN')
        AND r.checkIn < :checkOut
        AND r.checkOut > :checkIn
    """)
    boolean existeConflictoFechas(
        @Param("habitacionId") Long habitacionId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}