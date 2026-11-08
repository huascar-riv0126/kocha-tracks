package hre.dev.springboot_backend.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.model.EventHistory;
import hre.dev.springboot_backend.model.Notification;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.model.UserNotification;

class UserNotificationResponseDTOTest {

    @Test
    @DisplayName("mapToDTO() correctly maps Notification, EventHistory, and UserNotification fields")
    void testMapToDTO() {
        LocalDateTime ehCreatedAt = LocalDateTime.of(2026, 5, 10, 14, 30);
        LocalDateTime readAt = LocalDateTime.of(2026, 5, 10, 15, 0);

        Event event = new Event();
        event.setId(100L);

        EventHistory eh = new EventHistory(event, "SEVERITY_UPDATE", "Nivel de alerta elevado a ALTO");
        ReflectionTestUtils.setField(eh, "createdAt", ehCreatedAt);

        Notification notification = new Notification(eh);
        ReflectionTestUtils.setField(notification, "id", 50L);

        User user = new User("alice", "pass123", "USER");
        user.setId(1L);

        UserNotification userNotification = new UserNotification(user, notification);
        userNotification.markAsRead();
        userNotification.setReadAt(readAt);

        UserNotificationResponseDTO dto = UserNotificationResponseDTO.mapToDTO(userNotification);

        assertThat(dto.notificationId()).isEqualTo(50L);
        assertThat(dto.change()).isEqualTo("SEVERITY_UPDATE");
        assertThat(dto.content()).isEqualTo("Nivel de alerta elevado a ALTO");
        assertThat(dto.read()).isTrue();
        assertThat(dto.readAt()).isEqualTo(readAt);
        assertThat(dto.createdAt()).isEqualTo(ehCreatedAt);
    }

    @Test
    @DisplayName("mapToDTO() preserves unread status and null readAt")
    void testMapToDTO_unread() {
        LocalDateTime ehCreatedAt = LocalDateTime.of(2026, 6, 1, 9, 0);

        Event event = new Event();
        event.setId(101L);

        EventHistory eh = new EventHistory(event, "NEW_EVENT", "Incendio reportado");
        ReflectionTestUtils.setField(eh, "createdAt", ehCreatedAt);

        Notification notification = new Notification(eh);
        ReflectionTestUtils.setField(notification, "id", 51L);

        UserNotification userNotification = new UserNotification(2L, notification);

        UserNotificationResponseDTO dto = UserNotificationResponseDTO.mapToDTO(userNotification);

        assertThat(dto.notificationId()).isEqualTo(51L);
        assertThat(dto.change()).isEqualTo("NEW_EVENT");
        assertThat(dto.content()).isEqualTo("Incendio reportado");
        assertThat(dto.read()).isFalse();
        assertThat(dto.readAt()).isNull();
        assertThat(dto.createdAt()).isEqualTo(ehCreatedAt);
    }
}

