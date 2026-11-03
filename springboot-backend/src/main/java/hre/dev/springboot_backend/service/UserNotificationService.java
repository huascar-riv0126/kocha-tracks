package hre.dev.springboot_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hre.dev.springboot_backend.dto.UserNotificationResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.UserNotification;
import hre.dev.springboot_backend.model.UserNotificationId;
import hre.dev.springboot_backend.repository.UserNotificationRepository;

@Service
public class UserNotificationService {
    private final UserNotificationRepository repository;

    public UserNotificationService(UserNotificationRepository repository) {
        this.repository = repository;
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
}