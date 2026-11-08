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
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import hre.dev.springboot_backend.dto.SourceResponseDTO;
import hre.dev.springboot_backend.model.Source;
import hre.dev.springboot_backend.service.SourceService;

@WebMvcTest(SourceController.class)
class SourceControllerTest extends ControllerTestSupport {

    private static final String BASE_URL = "/api/v1/sources";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SourceService sourceService;

    @Test
    @DisplayName("GET /api/v1/sources returns all sources")
    void testGetAllSources() throws Exception {
        Source s = new Source();
        ReflectionTestUtils.setField(s, "id", 1L);
        s.setName("Los Tiempos");
        s.setUrl("https://www.lostiempos.com");
        s.setDescription("Noticias Cochabamba");

        when(sourceService.getAllActiveSources()).thenReturn(List.of(s));

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Los Tiempos"));

        verify(sourceService).getAllActiveSources();
    }

    @Test
    @DisplayName("GET /api/v1/sources/{id} returns source by id")
    void testGetSourceById() throws Exception {
        Source s = new Source();
        ReflectionTestUtils.setField(s, "id", 1L);
        s.setName("Los Tiempos");
        s.setUrl("https://www.lostiempos.com");
        s.setDescription("Noticias Cochabamba");

        when(sourceService.getSourceById(1L)).thenReturn(s);

        mockMvc.perform(get(BASE_URL + "/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Los Tiempos"));

        verify(sourceService).getSourceById(1L);
    }

    @Test
    @DisplayName("POST /api/v1/sources creates source and returns 201 Created")
    void testCreateSource() throws Exception {
        Source s = new Source();
        ReflectionTestUtils.setField(s, "id", 2L);
        s.setName("Opinion");
        s.setUrl("https://www.opinion.com.bo");
        s.setDescription("Diario regional");

        when(sourceService.createSource(any(SourceResponseDTO.class))).thenReturn(s);

        String json = """
            {
                "name": "Opinion",
                "url": "https://www.opinion.com.bo",
                "description": "Diario regional"
            }
            """;

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("Opinion"));

        verify(sourceService).createSource(any(SourceResponseDTO.class));
    }

    @Test
    @DisplayName("POST /api/v1/sources returns 400 Bad Request on invalid input")
    void testCreateSource_invalidInput() throws Exception {
        String invalidJson = """
            {
                "name": "",
                "url": "not-a-valid-url"
            }
            """;

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/v1/sources/{id} updates source")
    void testUpdateSource() throws Exception {
        Source s = new Source();
        ReflectionTestUtils.setField(s, "id", 1L);
        s.setName("Opinion Actualizada");
        s.setUrl("https://www.opinion.com.bo/actual");

        when(sourceService.updateSource(eq(1L), any(SourceResponseDTO.class))).thenReturn(s);

        String json = """
            {
                "name": "Opinion Actualizada",
                "url": "https://www.opinion.com.bo/actual"
            }
            """;

        mockMvc.perform(put(BASE_URL + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Opinion Actualizada"));

        verify(sourceService).updateSource(eq(1L), any(SourceResponseDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/v1/sources/{id} deletes source with 204 No Content")
    void testDeleteSource() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/1"))
                .andExpect(status().isNoContent());

        verify(sourceService).deleteSource(1L);
    }
}

