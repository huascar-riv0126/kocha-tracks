package hre.dev.springboot_backend.repository;

import hre.dev.springboot_backend.model.Source;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SourceRepository extends JpaRepository<Source, Long> {
    List<Source> findAllByDeletedAtIsNull();

    Optional<Source> findByIdAndDeletedAtIsNull(Long id);
}
