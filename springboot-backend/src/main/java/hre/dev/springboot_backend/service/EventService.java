package hre.dev.springboot_backend.service;

import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Obtener todos los eventos activos
    public List<Event> getAllEvents() {
        return eventRepository.findByIsActiveTrue();
    }

    // Obtener un evento por ID si está activo
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findByIdAndIsActiveTrue(id);
    }

    // Crear un nuevo evento
    public Event createEvent(Event event) {
        event.setIsActive(true);
        return eventRepository.save(event);
    }

    // Actualizar un evento existente
    public Event updateEvent(Long id, Event eventDetails) {
        return eventRepository.findByIdAndIsActiveTrue(id).map(existingEvent -> {
            existingEvent.setName(eventDetails.getName());
            existingEvent.setDescription(eventDetails.getDescription());
            existingEvent.setLocation(eventDetails.getLocation());
            existingEvent.setPoint(eventDetails.getPoint());
            existingEvent.setStarted(eventDetails.getStarted());
            existingEvent.setEnded(eventDetails.getEnded());
            existingEvent.setState(eventDetails.getState());
            existingEvent.setGrade(eventDetails.getGrade());
            return eventRepository.save(existingEvent);
        }).orElseThrow(() -> new RuntimeException("Evento no encontrado o inactivo con id " + id));
    }

    // Eliminar (borrado lógico)
    public void deleteEvent(Long id) {
        Event event = eventRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado o inactivo con id " + id));
        
        event.setIsActive(false);
        event.setDeletedAt(LocalDateTime.now());
        eventRepository.save(event);
    }
}