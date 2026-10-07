package hre.dev.springboot_backend.service;

import hre.dev.springboot_backend.dto.EventRequestDTO;
import hre.dev.springboot_backend.dto.EventResponseDTO;
import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Método auxiliar para convertir Entidad a DTO (evita exponer la BD)
    private EventResponseDTO mapToResponseDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLatitude(event.getLatitude());
        dto.setLongitude(event.getLongitude());
        dto.setSeverity(event.getSeverity());
        dto.setSourceId(event.getSourceId());
        return dto;
    }

    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public EventResponseDTO getEventById(Long id) {
        Optional<Event> event = eventRepository.findByIdAndIsActiveTrue(id);
        return event.map(this::mapToResponseDTO).orElse(null);
    }

    public EventResponseDTO createEvent(EventRequestDTO requestDTO) {
        Event event = new Event();
        event.setTitle(requestDTO.getTitle());
        event.setDescription(requestDTO.getDescription());
        event.setLatitude(requestDTO.getLatitude());
        event.setLongitude(requestDTO.getLongitude());
        event.setSeverity(requestDTO.getSeverity());
        event.setSourceId(requestDTO.getSourceId());
        event.setIsActive(true);

        Event savedEvent = eventRepository.save(event);
        return mapToResponseDTO(savedEvent);
    }

    public EventResponseDTO updateEvent(Long id, EventRequestDTO requestDTO) {
        Optional<Event> existingEventOpt = eventRepository.findByIdAndIsActiveTrue(id);
        if (existingEventOpt.isPresent()) {
            Event event = existingEventOpt.get();
            event.setTitle(requestDTO.getTitle());
            event.setDescription(requestDTO.getDescription());
            event.setLatitude(requestDTO.getLatitude());
            event.setLongitude(requestDTO.getLongitude());
            event.setSeverity(requestDTO.getSeverity());
            event.setSourceId(requestDTO.getSourceId());
            
            Event updatedEvent = eventRepository.save(event);
            return mapToResponseDTO(updatedEvent);
        }
        return null;
    }

    public boolean deleteEvent(Long id) {
        Optional<Event> existingEventOpt = eventRepository.findByIdAndIsActiveTrue(id);
        if (existingEventOpt.isPresent()) {
            Event event = existingEventOpt.get();
            event.setIsActive(false); // Aquí se cumple el criterio de "Borrado Lógico"
            eventRepository.save(event);
            return true;
        }
        return false;
    }
}