package hre.dev.springboot_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Point;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hre.dev.springboot_backend.dto.EventRequestDTO;
import hre.dev.springboot_backend.dto.EventResponseDTO;
import hre.dev.springboot_backend.dto.PointDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.model.EventHistory;
import hre.dev.springboot_backend.model.Notification;
import hre.dev.springboot_backend.repository.EventHistoryRepository;
import hre.dev.springboot_backend.repository.EventRepository;
import hre.dev.springboot_backend.repository.NotificationRepository;
import hre.dev.springboot_backend.util.GeometryUtil;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventHistoryRepository eventHistoryRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserNotificationService userNotificationService;

    @InjectMocks
    private EventService eventService;

    private EventRequestDTO requestDTO;
    private Event eventEntity;

    @BeforeEach
    void setUp() {
        PointDTO pointDTO = new PointDTO(-17.3895, -66.1568);

        requestDTO = new EventRequestDTO();
        requestDTO.setName("Concierto en la Plaza");
        requestDTO.setDescription("Música en vivo");
        requestDTO.setLocation("Plaza Principal");
        requestDTO.setPoint(pointDTO);
        requestDTO.setStarted(LocalDateTime.of(2026, 11, 20, 18, 0));
        requestDTO.setEnded(LocalDateTime.of(2026, 11, 20, 22, 0));
        requestDTO.setState("SCHEDULED");
        requestDTO.setGrade("HIGH");

        eventEntity = new Event();
        eventEntity.setId(1L);
        eventEntity.setName("Concierto en la Plaza");
        eventEntity.setDescription("Música en vivo");
        eventEntity.setLocation("Plaza Principal");
        eventEntity.setPoint(GeometryUtil.toPoint(pointDTO));
        eventEntity.setStarted(requestDTO.getStarted());
        eventEntity.setEnded(requestDTO.getEnded());
        eventEntity.setState(requestDTO.getState());
        eventEntity.setGrade(requestDTO.getGrade());
        eventEntity.setIsActive(true);
    }

    /**
     * Configura los mocks de historial y notificación usados al
     * crear/borrar/actualizar.
     */
    private void mockHistoryAndNotification() {
        when(eventHistoryRepository.save(any(EventHistory.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void testGeometryConversion() {
        PointDTO dto = new PointDTO(-17.3895, -66.1568);
        Point point = GeometryUtil.toPoint(dto);

        assertThat(point).isNotNull();
        assertThat(point.getSRID()).isEqualTo(4326);
        assertThat(point.getX()).isEqualTo(-66.1568); // Longitude
        assertThat(point.getY()).isEqualTo(-17.3895); // Latitude

        PointDTO convertedBack = GeometryUtil.toPointDTO(point);
        assertThat(convertedBack).isNotNull();
        assertThat(convertedBack.getLat()).isEqualTo(-17.3895);
        assertThat(convertedBack.getLong()).isEqualTo(-66.1568);
    }

    @Test
    void testCreateEvent() {
        when(eventRepository.save(any(Event.class))).thenReturn(eventEntity);
        mockHistoryAndNotification();

        EventResponseDTO response = eventService.createEvent(requestDTO);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Concierto en la Plaza");
        assertThat(response.getPoint()).isNotNull();
        assertThat(response.getPoint().getLat()).isEqualTo(-17.3895);
        assertThat(response.getPoint().getLong()).isEqualTo(-66.1568);

        verify(eventRepository, times(1)).save(any(Event.class));
        verify(eventHistoryRepository, times(1)).save(any(EventHistory.class));
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(userNotificationService, times(1)).distributeNotification(any(Notification.class));
    }

    @Test
    void testGetEventById() {
        when(eventRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(eventEntity));

        EventResponseDTO response = eventService.getEventById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Concierto en la Plaza");
    }

    @Test
    void testGetAllEvents() {
        when(eventRepository.findAllByIsActiveTrue()).thenReturn(List.of(eventEntity));

        List<EventResponseDTO> events = eventService.getAllEvents();

        assertThat(events).hasSize(1);
        assertThat(events.get(0).getName()).isEqualTo("Concierto en la Plaza");
    }

    @Test
    void testDeleteEvent() {
        when(eventRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(eventEntity));
        when(eventRepository.save(any(Event.class))).thenReturn(eventEntity);
        mockHistoryAndNotification();

        eventService.deleteEvent(1L);

        assertThat(eventEntity.getIsActive()).isFalse();
        assertThat(eventEntity.getDeletedAt()).isNotNull();
        verify(eventRepository, times(1)).save(eventEntity);
        verify(eventHistoryRepository, times(1)).save(any(EventHistory.class));
        verify(userNotificationService, times(1)).distributeNotification(any(Notification.class));
    }

    @Test
    void testUpdateEvent_sinCambios_noGuardaNada() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(eventEntity));

        // requestDTO tiene los mismos description/state/grade que eventEntity
        EventResponseDTO response = eventService.updateEvent(1L, requestDTO);

        assertThat(response).isNotNull();
        verify(eventRepository, never()).save(any(Event.class));
        verifyNoInteractions(eventHistoryRepository, notificationRepository, userNotificationService);
    }

    @Test
    void testUpdateEvent_conCambios_generaHistorialYNotificacion() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(eventEntity));
        when(eventRepository.save(any(Event.class))).thenReturn(eventEntity);
        mockHistoryAndNotification();

        requestDTO.setState("CANCELLED"); // cambia solo el estado -> 1 cambio

        eventService.updateEvent(1L, requestDTO);

        verify(eventRepository, times(1)).save(any(Event.class));
        verify(eventHistoryRepository, times(1)).save(any(EventHistory.class));
        verify(userNotificationService, times(1)).distributeNotification(any(Notification.class));
    }

    @Test
    void testUpdateEvent_noExiste_lanzaExcepcion() {
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.updateEvent(99L, requestDTO))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
