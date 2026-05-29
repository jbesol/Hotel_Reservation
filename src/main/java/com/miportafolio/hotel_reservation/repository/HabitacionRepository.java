package com.miportafolio.hotel_reservation.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.miportafolio.hotel_reservation.entity.Habitacion;
import com.miportafolio.hotel_reservation.enums.TipoHabitacion;

@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {

    List<Habitacion> findByDisponible(Boolean disponible);

    List<Habitacion> findByTipo(TipoHabitacion tipo);

    List<Habitacion> findByTipoAndDisponible(TipoHabitacion tipo, Boolean disponible);

    // Query personalizada — busca habitaciones disponibles en un rango de fechas
    // Una habitación está disponible si NO tiene reservas confirmadas que se
    // solapen con las fechas solicitadas
    @Query("""
        SELECT h FROM Habitacion h
        WHERE h.disponible = true
        AND h.id NOT IN (
            SELECT r.habitacion.id FROM Reserva r
            WHERE r.estado IN ('CONFIRMADA', 'CHECKED_IN')
            AND r.checkIn < :checkOut
            AND r.checkOut > :checkIn
        )
    """)
    List<Habitacion> findHabitacionesDisponiblesEnFechas(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}