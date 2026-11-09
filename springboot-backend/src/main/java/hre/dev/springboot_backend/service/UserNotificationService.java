package hre.dev.springboot_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hre.dev.springboot_backend.dto.UserNotificationResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.model.Notification;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.model.UserNotification;
import hre.dev.springboot_backend.model.UserNotificationId;
import hre.dev.springboot_backend.repository.UserNotificationRepository;
import hre.dev.springboot_backend.repository.UserRepository;

@Service
public class UserNotificationService {
    private final UserNotificationRepository repository;
    private final UserRepository userRepository;

    public UserNotificationService(
            UserNotificationRepository repository,
            UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserNotificationResponseDTO> getAllByUserId(Long userId) {
        return repository.findAllByUserId(userId)
                .stream()
                .map(UserNotificationResponseDTO::mapToDTO)
                .toList();
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        repository.markAllAsRead(userId, LocalDateTime.now());
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        UserNotification un = repository
                .findById(new UserNotificationId(userId, notificationId))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification %d not found for user %d".formatted(notificationId, userId)));
        un.markAsRead();
    }

    /**
     * Distributes a notification to all users whose active zones of interest
     * contain the location of the event associated with the notification.
     *
     * @param notification The newly created notification
     * @return List of persisted UserNotification entities
     */
    @Transactional
    public List<UserNotification> createNotificationsForNotification(Notification notification) {
        if (notification == null
                || notification.getEventHistory() == null
                || notification.getEventHistory().getEvent() == null
                || notification.getEventHistory().getEvent().getPoint() == null) {
            return Collections.emptyList();
        }

        Event event = notification.getEventHistory().getEvent();
        List<Long> targetUserIds = repository.findUserIdsWithActiveZonesContainingPoint(event.getPoint());

        if (targetUserIds == null || targetUserIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<UserNotification> toCreate = new ArrayList<>();
        for (Long userId : targetUserIds) {
            UserNotificationId id = new UserNotificationId(userId, notification.getId());
            if (!repository.existsById(id)) {
                User userRef = userRepository != null ? userRepository.getReferenceById(userId) : null;
                UserNotification userNotification = new UserNotification(userId, notification);
                if (userRef != null) {
                    userNotification.setUser(userRef);
                }
                toCreate.add(userNotification);
            }
        }

        if (toCreate.isEmpty()) {
            return Collections.emptyList();
        }

        return repository.saveAll(toCreate);
    }

    @Transactional
    public List<UserNotification> distributeNotification(Notification notification) {
        return createNotificationsForNotification(notification);
    }
}
