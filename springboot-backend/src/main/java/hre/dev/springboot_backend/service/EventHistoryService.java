package hre.dev.springboot_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hre.dev.springboot_backend.dto.EventHistoryResponseDTO;
import hre.dev.springboot_backend.repository.EventHistoryRepository;

@Service
public class EventHistoryService {
    private final EventHistoryRepository repository;

    public EventHistoryService(EventHistoryRepository repository) {
        this.repository = repository;
    }

    public List<EventHistoryResponseDTO> getAll() {
        return this.repository.findAll()
                .stream()
                .map(EventHistoryResponseDTO::mapToDTO)
                .toList();
    }

    public List<EventHistoryResponseDTO> getAllByEventId(Long eventId) {
        return this.repository.findAllByEvent_IdOrderByCreatedAtDesc(eventId)
                .stream()
                .map(EventHistoryResponseDTO::mapToDTO)
                .toList();
    }
}
