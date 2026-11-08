package hre.dev.springboot_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hre.dev.springboot_backend.dto.EventHistoryResponseDTO;
import hre.dev.springboot_backend.service.EventHistoryService;

@RestController
@RequestMapping(path = "api/v1/events/history")
public class EventHistoryController {
    private final EventHistoryService service;

    public EventHistoryController(EventHistoryService service) {
        this.service = service;
    }

    @GetMapping()
    public List<EventHistoryResponseDTO> getAll() {
        return this.service.getAll();
    }

    @GetMapping("/{eventId}")
    public List<EventHistoryResponseDTO> getAllByEventId(@PathVariable Long eventId) {
        return this.service.getAllByEventId(eventId);
    }

}
