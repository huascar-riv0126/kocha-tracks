package hre.dev.springboot_backend.dto;

import java.time.LocalDateTime;

import hre.dev.springboot_backend.model.EventHistory;
import hre.dev.springboot_backend.model.Notification;
import hre.dev.springboot_backend.model.UserNotification;

public record UserNotificationResponseDTO(
        Long notificationId,
        String change,
        String content,
        boolean read,
        LocalDateTime readAt,
        LocalDateTime createdAt) {

    public static UserNotificationResponseDTO mapToDTO(UserNotification un) {
        Notification n = un.getNotification();
        EventHistory eh = n.getEventHistory();
        return new UserNotificationResponseDTO(
                n.getId(),
                eh.getChange(),
                eh.getContent(),
                un.isRead(),
                un.getReadAt(),
                eh.getCreatedAt());
    }
}