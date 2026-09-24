package hre.dev.springboot_backend.repository;

import hre.dev.springboot_backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Devuelve solo los eventos que no han sido eliminados lógicamente
    List<Event> findByIsActiveTrue();
    
    // Busca un evento específico solo si está activo
    Optional<Event> findByIdAndIsActiveTrue(Long id);
}