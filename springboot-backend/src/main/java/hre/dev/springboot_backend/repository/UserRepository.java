package hre.dev.springboot_backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import hre.dev.springboot_backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByIsActiveTrue();
    Optional<User> findByIdAndIsActiveTrue(Long id);
}