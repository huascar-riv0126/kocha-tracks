package hre.dev.springboot_backend.repository;

import hre.dev.springboot_backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findAllByIsActiveTrue();

    Optional<Event> findByIdAndIsActiveTrue(Long id);
}