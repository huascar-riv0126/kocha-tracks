package hre.dev.springboot_backend.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public record UserNotificationId(
        @Column(name = "user_id") Long userId,
        @Column(name = "notification_id") Long notificationId) implements Serializable {
}
