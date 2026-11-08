package hre.dev.springboot_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hre.dev.springboot_backend.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllByIsActiveTrue();

    List<Message> findAllByAuthor_IdAndIsActiveTrue(Long authorId);

    List<Message> findAllByConversation_IdAndIsActiveTrue(Long conversationId);

    Optional<Message> findByIdAndIsActiveTrue(Long id);
}
