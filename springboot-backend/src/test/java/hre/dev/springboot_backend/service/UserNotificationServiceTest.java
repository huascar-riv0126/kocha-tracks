package hre.dev.springboot_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.dto.UserNotificationResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.model.EventHistory;
import hre.dev.springboot_backend.model.Notification;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.model.UserNotification;
import hre.dev.springboot_backend.model.UserNotificationId;
import hre.dev.springboot_backend.repository.UserNotificationRepository;
import hre.dev.springboot_backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserNotificationServiceTest {

    @Mock
    private UserNotificationRepository repository;

    @Mock
    private UserRepository userRepository;

    private UserNotificationService service;

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private Point cochabambaCenter;
    private Notification notification;
    private Event event;
    private EventHistory eventHistory;

    @BeforeEach
    void setUp() {
        service = new UserNotificationService(repository, userRepository);
        cochabambaCenter = geometryFactory.createPoint(new Coordinate(-66.1568, -17.3895));

        event = new Event();
        ReflectionTestUtils.setField(event, "id", 10L);
        event.setName("Bloqueo Puente Quillacollo");
        event.setPoint(cochabambaCenter);

        eventHistory = new EventHistory(event, "NEW", "Nuevo reporte de bloqueo");
        ReflectionTestUtils.setField(eventHistory, "createdAt", LocalDateTime.now());

        notification = new Notification(eventHistory);
        ReflectionTestUtils.setField(notification, "id", 20L);
    }

    @Test
    @DisplayName("getAllByUserId() returns mapped list of UserNotificationResponseDTO")
    void testGetAllByUserId() {
        User user = new User("juan", "pwd", "USER");
        user.setId(1L);

        UserNotification un = new UserNotification(user, notification);
        when(repository.findAllByUserId(1L)).thenReturn(List.of(un));

        List<UserNotificationResponseDTO> result = service.getAllByUserId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).notificationId()).isEqualTo(20L);
        assertThat(result.get(0).change()).isEqualTo("NEW");
        verify(repository).findAllByUserId(1L);
    }

    @Test
    @DisplayName("markAllAsRead() calls repository with current timestamp")
    void testMarkAllAsRead() {
        service.markAllAsRead(1L);

        verify(repository).markAllAsRead(eq(1L), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("markAsRead() marks notification as read when it exists")
    void testMarkAsRead_success() {
        User user = new User("juan", "pwd", "USER");
        user.setId(1L);

        UserNotification un = new UserNotification(user, notification);
        assertThat(un.isRead()).isFalse();

        when(repository.findById(new UserNotificationId(1L, 20L))).thenReturn(Optional.of(un));

        service.markAsRead(1L, 20L);

        assertThat(un.isRead()).isTrue();
        assertThat(un.getReadAt()).isNotNull();
        verify(repository).findById(new UserNotificationId(1L, 20L));
    }

    @Test
    @DisplayName("markAsRead() throws ResourceNotFoundException when notification not found")
    void testMarkAsRead_notFound() {
        when(repository.findById(new UserNotificationId(1L, 999L))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.markAsRead(1L, 999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Notification 999 not found for user 1");
    }

    @Test
    @DisplayName("createNotificationsForNotification() creates and saves UserNotifications for matching active zones")
    void testCreateNotificationsForNotification_success() {
        when(repository.findUserIdsWithActiveZonesContainingPoint(cochabambaCenter))
                .thenReturn(List.of(100L, 200L));

        User user1 = new User("u1", "p", "USER");
        user1.setId(100L);
        User user2 = new User("u2", "p", "USER");
        user2.setId(200L);

        when(repository.existsById(new UserNotificationId(100L, 20L))).thenReturn(false);
        when(repository.existsById(new UserNotificationId(200L, 20L))).thenReturn(false);

        when(userRepository.getReferenceById(100L)).thenReturn(user1);
        when(userRepository.getReferenceById(200L)).thenReturn(user2);

        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<UserNotification> created = service.createNotificationsForNotification(notification);

        assertThat(created).hasSize(2);
        verify(repository).findUserIdsWithActiveZonesContainingPoint(cochabambaCenter);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<UserNotification>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());

        List<UserNotification> savedList = captor.getValue();
        assertThat(savedList).hasSize(2);
        assertThat(savedList.get(0).getId().userId()).isEqualTo(100L);
        assertThat(savedList.get(0).getId().notificationId()).isEqualTo(20L);
        assertThat(savedList.get(1).getId().userId()).isEqualTo(200L);
        assertThat(savedList.get(1).getId().notificationId()).isEqualTo(20L);
    }

    @Test
    @DisplayName("createNotificationsForNotification() returns empty list when no active zones contain the point")
    void testCreateNotificationsForNotification_noMatchingZones() {
        when(repository.findUserIdsWithActiveZonesContainingPoint(cochabambaCenter))
                .thenReturn(Collections.emptyList());

        List<UserNotification> created = service.createNotificationsForNotification(notification);

        assertThat(created).isEmpty();
        verify(repository, never()).saveAll(anyList());
    }

    @Test
    @DisplayName("createNotificationsForNotification() returns empty when notification, event, or point is null")
    void testCreateNotificationsForNotification_nullCases() {
        assertThat(service.createNotificationsForNotification(null)).isEmpty();

        Notification noHistory = new Notification(null);
        assertThat(service.createNotificationsForNotification(noHistory)).isEmpty();

        EventHistory noEventHistory = new EventHistory(null, "CHG", "content");
        Notification noEvent = new Notification(noEventHistory);
        assertThat(service.createNotificationsForNotification(noEvent)).isEmpty();

        Event eventWithoutPoint = new Event();
        EventHistory ehWithoutPoint = new EventHistory(eventWithoutPoint, "CHG", "content");
        Notification notifWithoutPoint = new Notification(ehWithoutPoint);
        assertThat(service.createNotificationsForNotification(notifWithoutPoint)).isEmpty();

        verify(repository, never()).findUserIdsWithActiveZonesContainingPoint(any());
    }

    @Test
    @DisplayName("createNotificationsForNotification() skips duplicate UserNotification if already present")
    void testCreateNotificationsForNotification_preventsDuplicates() {
        when(repository.findUserIdsWithActiveZonesContainingPoint(cochabambaCenter))
                .thenReturn(List.of(100L, 200L));

        when(repository.existsById(new UserNotificationId(100L, 20L))).thenReturn(true);
        when(repository.existsById(new UserNotificationId(200L, 20L))).thenReturn(false);

        User user2 = new User("u2", "p", "USER");
        user2.setId(200L);
        when(userRepository.getReferenceById(200L)).thenReturn(user2);

        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<UserNotification> created = service.createNotificationsForNotification(notification);

        assertThat(created).hasSize(1);
        assertThat(created.get(0).getId().userId()).isEqualTo(200L);
        verify(userRepository, never()).getReferenceById(100L);
    }

    @Test
    @DisplayName("distributeNotification() delegates to createNotificationsForNotification()")
    void testDistributeNotification() {
        when(repository.findUserIdsWithActiveZonesContainingPoint(cochabambaCenter))
                .thenReturn(Collections.emptyList());

        List<UserNotification> result = service.distributeNotification(notification);

        assertThat(result).isEmpty();
        verify(repository, times(1)).findUserIdsWithActiveZonesContainingPoint(cochabambaCenter);
    }
}
