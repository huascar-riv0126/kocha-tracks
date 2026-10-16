package hre.dev.springboot_backend.service;

import hre.dev.springboot_backend.dto.EventRequestDTO;
import hre.dev.springboot_backend.dto.EventResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.repository.EventRepository;
import hre.dev.springboot_backend.util.GeometryUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
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
        return mapToResponseDTO(savedEvent);
    }

    @Transactional
    public EventResponseDTO updateEvent(Long id, EventRequestDTO requestDTO) {
        Event event = eventRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + id));

        event.setName(requestDTO.getName());
        event.setDescription(requestDTO.getDescription());
        event.setLocation(requestDTO.getLocation());
        event.setPoint(GeometryUtil.toPoint(requestDTO.getPoint()));
        event.setStarted(requestDTO.getStarted());
        event.setEnded(requestDTO.getEnded());
        event.setState(requestDTO.getState());
        event.setGrade(requestDTO.getGrade());

        Event updatedEvent = eventRepository.save(event);
        return mapToResponseDTO(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con id: " + id));

        event.setIsActive(false);
        event.setDeletedAt(LocalDateTime.now());
        eventRepository.save(event);
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
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setIsActive(event.getIsActive());
        dto.setDeletedAt(event.getDeletedAt());
        return dto;
    }
}