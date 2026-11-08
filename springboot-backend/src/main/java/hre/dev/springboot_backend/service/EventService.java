package hre.dev.springboot_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hre.dev.springboot_backend.dto.EventRequestDTO;
import hre.dev.springboot_backend.dto.EventResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.model.EventChange;
import hre.dev.springboot_backend.model.EventChangeResult;
import hre.dev.springboot_backend.model.EventHistory;
import hre.dev.springboot_backend.model.Notification;
import hre.dev.springboot_backend.repository.EventHistoryRepository;
import hre.dev.springboot_backend.repository.EventRepository;
import hre.dev.springboot_backend.repository.NotificationRepository;
import hre.dev.springboot_backend.util.GeometryUtil;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventHistoryRepository eventHistoryRepository;
    private final NotificationRepository notificationRepository;
    private final UserNotificationService userNotificationService;

    private EventChangeResult detectChanges(Event oldEvent, EventRequestDTO dto) {
        List<EventChange> changes = new ArrayList<>();

        if (!Objects.equals(oldEvent.getDescription(), dto.getDescription())) {
            changes.add(new EventChange(
                    "DESCRIPTION_UPDATED",
                    dto.getDescription()));
        }

        if (!Objects.equals(oldEvent.getState(), dto.getState())) {
            changes.add(new EventChange(
                    "STATUS_UPDATED",
                    "De %s a %s".formatted(oldEvent.getState(), dto.getState())));
        }

        if (!Objects.equals(oldEvent.getGrade(), dto.getGrade())) {
            changes.add(new EventChange(
                    "GRADE_UPDATED",
                    "De %s a %s".formatted(oldEvent.getGrade(), dto.getGrade())));
        }

        return new EventChangeResult(changes);
    }

    private void createHistoryAndNotification(Event event, List<EventChange> changes) {
        for (EventChange change : changes) {
            EventHistory history = eventHistoryRepository.save(
                    new EventHistory(event, change.change(), change.content()));

            Notification notification = notificationRepository.save(
                    new Notification(history));

            userNotificationService.distributeNotification(notification);
        }
    }

    public EventService(
            EventRepository eventRepository,
            EventHistoryRepository eventHistoryRepository,
            NotificationRepository notificationRepository,
            UserNotificationService userNotificationService) {
        this.eventRepository = eventRepository;
        this.eventHistoryRepository = eventHistoryRepository;
        this.notificationRepository = notificationRepository;
        this.userNotificationService = userNotificationService;
    }

    @Transactional(readOnly = true)
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + id));

        return mapToResponseDTO(event);
    }

    @Transactional
    public EventResponseDTO createEvent(EventRequestDTO requestDTO) {
        Event event = mapToEntity(requestDTO);
        event.setIsActive(true);
        Event savedEvent = eventRepository.save(event);
        createHistoryAndNotification(
                savedEvent,
                List.of(new EventChange("EVENT_CREATED", "Se creo el evento")));
        return mapToResponseDTO(savedEvent);
    }

    @Transactional
    public EventResponseDTO updateEvent(Long eventId, EventRequestDTO request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        EventChangeResult result = detectChanges(event, request);

        if (!result.hasChanges()) {
            return mapToResponseDTO(event);
        }

        event.updateFromDTO(request);
        Event savedEvent = eventRepository.save(event);
        createHistoryAndNotification(savedEvent, result.changes());
        return mapToResponseDTO(savedEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + id));

        event.setIsActive(false);
        event.setDeletedAt(LocalDateTime.now());
        eventRepository.save(event);
        createHistoryAndNotification(
                event,
                List.of(new EventChange("EVENT_DELETED", "Se solicito eliminar el evento")));
    }

    public Event mapToEntity(EventRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        Event event = new Event();
        event.setName(dto.getName());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        event.setPoint(GeometryUtil.toPoint(dto.getPoint()));
        event.setStarted(dto.getStarted());
        event.setEnded(dto.getEnded());
        event.setState(dto.getState());
        event.setGrade(dto.getGrade());
        return event;
    }

    public EventResponseDTO mapToResponseDTO(Event event) {
        if (event == null) {
            return null;
        }
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setPoint(GeometryUtil.toPointDTO(event.getPoint()));
        dto.setStarted(event.getStarted());
        dto.setEnded(event.getEnded());
        dto.setState(event.getState());
        dto.setGrade(event.getGrade());
        dto.setUpdatedAt(event.getUpdatedAt());
        return dto;
    }
}