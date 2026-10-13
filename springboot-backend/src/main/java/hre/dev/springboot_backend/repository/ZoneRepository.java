package hre.dev.springboot_backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import hre.dev.springboot_backend.model.Zone;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByIsActiveTrue();
    Optional<Zone> findByIdAndIsActiveTrue(Long id);
}