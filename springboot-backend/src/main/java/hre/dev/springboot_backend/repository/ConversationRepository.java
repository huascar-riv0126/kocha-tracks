package hre.dev.springboot_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hre.dev.springboot_backend.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findAllByIsActiveTrue();

    List<Conversation> findAllByCreator_IdAndIsActiveTrue(Long creatorId);

    List<Conversation> findByNameContainingIgnoreCase(String name);

    Optional<Conversation> findByIdAndIsActiveTrue(Long id);
}
