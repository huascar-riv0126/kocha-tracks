package hre.dev.springboot_backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import hre.dev.springboot_backend.dto.ZoneRequestDTO;
import hre.dev.springboot_backend.dto.ZoneResponseDTO;
import hre.dev.springboot_backend.service.ZoneService;

@WebMvcTest(ZoneController.class)
class ZoneControllerTest extends ControllerTestSupport {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ZoneService zoneService;

    @Test
    @DisplayName("GET /api/v1/zones returns list of zones")
    void testGetAll() throws Exception {
        ZoneResponseDTO zone = new ZoneResponseDTO(1L, 10L, "Casa", "RADIO", "-17.38,-66.15", 1000.0, null);
        when(zoneService.getAll()).thenReturn(List.of(zone));

        mockMvc.perform(get("/api/v1/zones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Casa"));

        verify(zoneService).getAll();
    }

    @Test
    @DisplayName("GET /api/v1/zones/{id} returns zone by id")
    void testGetById() throws Exception {
        ZoneResponseDTO zone = new ZoneResponseDTO(1L, 10L, "Casa", "RADIO", "-17.38,-66.15", 1000.0, null);
        when(zoneService.getById(1L)).thenReturn(zone);

        mockMvc.perform(get("/api/v1/zones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Casa"));

        verify(zoneService).getById(1L);
    }

    @Test
    @DisplayName("POST /api/v1/zones creates zone and returns 201 Created")
    void testCreate() throws Exception {
        ZoneResponseDTO created = new ZoneResponseDTO(5L, 10L, "Oficina", "RADIO", "-17.38,-66.15", 500.0, null);
        when(zoneService.create(any(ZoneRequestDTO.class))).thenReturn(created);

        String json = """
            {
                "userId": 10,
                "name": "Oficina",
                "type": "RADIO",
                "center": "-17.38,-66.15",
                "radiusMeters": 500.0
            }
            """;

        mockMvc.perform(post("/api/v1/zones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.name").value("Oficina"));

        verify(zoneService).create(any(ZoneRequestDTO.class));
    }

    @Test
    @DisplayName("PUT /api/v1/zones/{id} updates zone")
    void testUpdateById() throws Exception {
        ZoneResponseDTO updated = new ZoneResponseDTO(1L, 10L, "Casa Actualizada", "RADIO", "-17.38,-66.15", 1200.0, null);
        when(zoneService.updateById(eq(1L), any(ZoneRequestDTO.class))).thenReturn(updated);

        String json = """
            {
                "userId": 10,
                "name": "Casa Actualizada",
                "type": "RADIO",
                "center": "-17.38,-66.15",
                "radiusMeters": 1200.0
            }
            """;

        mockMvc.perform(put("/api/v1/zones/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Casa Actualizada"));

        verify(zoneService).updateById(eq(1L), any(ZoneRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/v1/zones/{id} deletes zone and returns deleted:true")
    void testDeleteById() throws Exception {
        mockMvc.perform(delete("/api/v1/zones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted").value(true));

        verify(zoneService).deleteById(1L);
    }
}

