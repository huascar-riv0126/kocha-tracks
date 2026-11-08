package hre.dev.springboot_backend.repository;

import hre.dev.springboot_backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findAllByIsActiveTrue();

    Optional<Event> findByIdAndIsActiveTrue(Long id);
}