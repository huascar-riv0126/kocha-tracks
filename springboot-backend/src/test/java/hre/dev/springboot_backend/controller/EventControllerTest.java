package hre.dev.springboot_backend.controller;

import hre.dev.springboot_backend.dto.EventRequestDTO;
import hre.dev.springboot_backend.dto.EventResponseDTO;
import hre.dev.springboot_backend.dto.PointDTO;
import hre.dev.springboot_backend.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    private EventRequestDTO requestDTO;
    private EventResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        PointDTO pointDTO = new PointDTO(-17.3895, -66.1568);

        requestDTO = new EventRequestDTO();
        requestDTO.setName("Festival de la Concordia");
        requestDTO.setDescription("Festival cultural anual");
        requestDTO.setLocation("Cochabamba Centro");
        requestDTO.setPoint(pointDTO);
        requestDTO.setStarted(LocalDateTime.of(2026, 12, 1, 10, 0));
        requestDTO.setEnded(LocalDateTime.of(2026, 12, 1, 20, 0));
        requestDTO.setState("ACTIVE");
        requestDTO.setGrade("NORMAL");

        responseDTO = new EventResponseDTO();
        responseDTO.setId(10L);
        responseDTO.setName("Festival de la Concordia");
        responseDTO.setDescription("Festival cultural anual");
        responseDTO.setLocation("Cochabamba Centro");
        responseDTO.setPoint(pointDTO);
        responseDTO.setStarted(requestDTO.getStarted());
        responseDTO.setEnded(requestDTO.getEnded());
        responseDTO.setState(requestDTO.getState());
        responseDTO.setGrade(requestDTO.getGrade());
    }

    @Test
    void testGetAllEvents() {
        when(eventService.getAllEvents()).thenReturn(List.of(responseDTO));

        ResponseEntity<List<EventResponseDTO>> response = eventController.getAllEvents();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(1);
        assertThat(response.getBody().get(0).getName()).isEqualTo("Festival de la Concordia");
    }

    @Test
    void testGetEventById() {
        when(eventService.getEventById(10L)).thenReturn(responseDTO);

        ResponseEntity<EventResponseDTO> response = eventController.getEventById(10L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(10L);
    }

    @Test
    void testCreateEvent() {
        when(eventService.createEvent(any(EventRequestDTO.class))).thenReturn(responseDTO);

        ResponseEntity<EventResponseDTO> response = eventController.createEvent(requestDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(10L);
        assertThat(response.getBody().getPoint().getLat()).isEqualTo(-17.3895);
        assertThat(response.getBody().getPoint().getLong()).isEqualTo(-66.1568);
    }

    @Test
    void testUpdateEvent() {
        when(eventService.updateEvent(eq(10L), any(EventRequestDTO.class))).thenReturn(responseDTO);

        ResponseEntity<EventResponseDTO> response = eventController.updateEvent(10L, requestDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(10L);
    }

    @Test
    void testDeleteEvent() {
        doNothing().when(eventService).deleteEvent(10L);

        ResponseEntity<Map<String, Boolean>> response = eventController.deleteEvent(10L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("deleted", true);
        verify(eventService, times(1)).deleteEvent(10L);
    }
}
