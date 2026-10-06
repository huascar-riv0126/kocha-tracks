package hre.dev.springboot_backend.repository;

import hre.dev.springboot_backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
<<<<<<< HEAD
import java.util.List;
import java.util.Optional;
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Devuelve solo los eventos que no han sido eliminados lógicamente
    List<Event> findByIsActiveTrue();
    
    // Busca un evento específico solo si está activo
=======

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findAllByIsActiveTrue();

>>>>>>> feat/hu-14-events-crud
    Optional<Event> findByIdAndIsActiveTrue(Long id);
}