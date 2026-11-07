package hre.dev.springboot_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hre.dev.springboot_backend.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByEventHistory_Event_IdOrderByCreatedAtDesc(Long eventId);

}
