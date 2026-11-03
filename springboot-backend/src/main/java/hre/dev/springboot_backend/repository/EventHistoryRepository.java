package hre.dev.springboot_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hre.dev.springboot_backend.model.EventHistory;

public interface EventHistoryRepository extends JpaRepository<EventHistory, Long> {
    List<EventHistory> findAllByEventIdOrderByCreatedAtDesc(Long eventId);
}
