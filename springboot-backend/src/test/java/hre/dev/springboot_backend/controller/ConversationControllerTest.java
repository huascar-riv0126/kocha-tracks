package hre.dev.springboot_backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import hre.dev.springboot_backend.dto.conversation.ConversationRequestDTO;
import hre.dev.springboot_backend.dto.conversation.ConversationResponseDTO;
import hre.dev.springboot_backend.service.ConversationService;

@WebMvcTest(ConversationController.class)
class ConversationControllerTest extends ControllerTestSupport {

    private static final String BASE_URL = "/api/v1/conversations";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ConversationService conversationService;

    @Test
    @DisplayName("POST /api/v1/conversations creates conversation and returns 201 Created")
    void testCreate() throws Exception {
        ConversationResponseDTO response = new ConversationResponseDTO(
                1L, 10L, "Alerta Sismo", LocalDateTime.now(), "OPEN", 0, 0);
        when(conversationService.create(any(ConversationRequestDTO.class))).thenReturn(response);

        String json = """
            {
                "creatorId": 10,
                "name": "Alerta Sismo"
            }
            """;

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Alerta Sismo"));

        verify(conversationService).create(any(ConversationRequestDTO.class));
    }

    @Test
    @DisplayName("GET /api/v1/conversations returns all active conversations")
    void testGetAll() throws Exception {
        ConversationResponseDTO response = new ConversationResponseDTO(
                1L, 10L, "Alerta Sismo", LocalDateTime.now(), "OPEN", 0, 0);
        when(conversationService.readAll()).thenReturn(List.of(response));

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Alerta Sismo"));

        verify(conversationService).readAll();
    }

    @Test
    @DisplayName("GET /api/v1/conversations?creatorId=10 returns conversations by creator")
    void testGetByCreatorId() throws Exception {
        ConversationResponseDTO response = new ConversationResponseDTO(
                1L, 10L, "Alerta Sismo", LocalDateTime.now(), "OPEN", 0, 0);
        when(conversationService.readAllByCreatorId(10L)).thenReturn(List.of(response));

        mockMvc.perform(get(BASE_URL).param("creatorId", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].userId").value(10));

        verify(conversationService).readAllByCreatorId(10L);
    }

    @Test
    @DisplayName("GET /api/v1/conversations?title=Sismo searches conversations by title")
    void testFindByTitle() throws Exception {
        ConversationResponseDTO response = new ConversationResponseDTO(
                1L, 10L, "Alerta Sismo", LocalDateTime.now(), "OPEN", 0, 0);
        when(conversationService.readAllContainingString("Sismo")).thenReturn(List.of(response));

        mockMvc.perform(get(BASE_URL).param("title", "Sismo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Alerta Sismo"));

        verify(conversationService).readAllContainingString("Sismo");
    }

    @Test
    @DisplayName("PATCH /api/v1/conversations/{id} updates conversation title")
    void testChangeTitle() throws Exception {
        ConversationResponseDTO response = new ConversationResponseDTO(
                1L, 10L, "Nuevo Titulo", LocalDateTime.now(), "OPEN", 0, 0);
        when(conversationService.changeName(eq(1L), any(ConversationRequestDTO.class))).thenReturn(response);

        String json = """
            {
                "creatorId": 10,
                "name": "Nuevo Titulo"
            }
            """;

        mockMvc.perform(patch(BASE_URL + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nuevo Titulo"));

        verify(conversationService).changeName(eq(1L), any(ConversationRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/v1/conversations/{id} deletes conversation with 204 No Content")
    void testDeleteById() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/1"))
                .andExpect(status().isNoContent());

        verify(conversationService).deleteById(1L);
    }
}

