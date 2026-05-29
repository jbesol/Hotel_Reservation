package com.miportafolio.hotel_reservation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miportafolio.hotel_reservation.entity.Huesped;

@Repository
public interface HuespedRepository extends JpaRepository<Huesped, Long> {

    Optional<Huesped> findByEmail(String email);

    Optional<Huesped> findByDocumento(String documento);

    boolean existsByEmail(String email);

    boolean existsByDocumento(String documento);
}