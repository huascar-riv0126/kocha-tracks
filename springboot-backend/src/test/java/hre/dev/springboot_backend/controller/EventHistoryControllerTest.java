package hre.dev.springboot_backend.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import hre.dev.springboot_backend.dto.EventHistoryResponseDTO;
import hre.dev.springboot_backend.service.EventHistoryService;

@WebMvcTest(EventHistoryController.class)
class EventHistoryControllerTest extends ControllerTestSupport {

    private static final String BASE_URL = "/api/v1/events/history";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EventHistoryService service;

    @Test
    @DisplayName("GET /api/v1/events/history returns all entries")
    void testGetAll() throws Exception {
        LocalDateTime createdAt = LocalDateTime.of(2026, 1, 1, 1, 1);
        when(service.getAll()).thenReturn(List.of(
                new EventHistoryResponseDTO("STATUS", "Se creo el evento", createdAt),
                new EventHistoryResponseDTO("TITLE", "Se modifico el titulo", createdAt)));

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].change").value("STATUS"))
                .andExpect(jsonPath("$[0].content").value("Se creo el evento"))
                .andExpect(jsonPath("$[0].createdAt").value("2026-01-01T01:01:00"))
                .andExpect(jsonPath("$[1].change").value("TITLE"));
    }

    @Test
    @DisplayName("GET /api/v1/events/history returns an empty array when there is no history")
    void testGetAll_empty() throws Exception {
        when(service.getAll()).thenReturn(List.of());

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("GET /api/v1/events/history/{eventId} returns the entries of that event")
    void testGetAllByEventId() throws Exception {
        LocalDateTime createdAt = LocalDateTime.of(2026, 11, 3, 10, 30);
        when(service.getAllByEventId(10L)).thenReturn(List.of(
                new EventHistoryResponseDTO("STATUS", "Pasó a activo", createdAt)));

        mockMvc.perform(get(BASE_URL + "/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].change").value("STATUS"));

        verify(service).getAllByEventId(10L);
    }

    @Test
    @DisplayName("GET /api/v1/events/history/{eventId} returns 400 when eventId is not a number")
    void testGetAllByEventId_invalidId() throws Exception {
        mockMvc.perform(get(BASE_URL + "/abc"))
                .andExpect(status().isBadRequest());
    }
}