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

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import hre.dev.springboot_backend.dto.message.MessageRequestDTO;
import hre.dev.springboot_backend.dto.message.MessageResponseDTO;
import hre.dev.springboot_backend.service.MessageService;

@WebMvcTest(MessageController.class)
class MessageControllerTest extends ControllerTestSupport {

    private static final String BASE_URL = "/api/v1/conversations/messages";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MessageService messageService;

    @Test
    @DisplayName("POST /api/v1/conversations/messages creates message with 201 Created")
    void testCreate() throws Exception {
        MessageResponseDTO response = new MessageResponseDTO(1L, "Cuidado con la zona de derrumbes");
        when(messageService.create(any(MessageRequestDTO.class))).thenReturn(response);

        String json = """
            {
                "authorId": 10,
                "conversationId": 20,
                "content": "Cuidado con la zona de derrumbes"
            }
            """;

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.content").value("Cuidado con la zona de derrumbes"));

        verify(messageService).create(any(MessageRequestDTO.class));
    }

    @Test
    @DisplayName("GET /api/v1/conversations/messages returns all active messages")
    void testGetAll() throws Exception {
        MessageResponseDTO response = new MessageResponseDTO(1L, "Alerta");
        when(messageService.readAll()).thenReturn(List.of(response));

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].content").value("Alerta"));

        verify(messageService).readAll();
    }

    @Test
    @DisplayName("GET /api/v1/conversations/messages?authorId=10 returns messages by author")
    void testGetByAuthorId() throws Exception {
        MessageResponseDTO response = new MessageResponseDTO(1L, "Alerta de autor");
        when(messageService.readAllByAuthorId(10L)).thenReturn(List.of(response));

        mockMvc.perform(get(BASE_URL).param("authorId", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        verify(messageService).readAllByAuthorId(10L);
    }

    @Test
    @DisplayName("GET /api/v1/conversations/messages?conversationId=20 returns messages by conversation")
    void testGetByConversationId() throws Exception {
        MessageResponseDTO response = new MessageResponseDTO(1L, "Mensaje del hilo");
        when(messageService.readAllByConversationId(20L)).thenReturn(List.of(response));

        mockMvc.perform(get(BASE_URL).param("conversationId", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        verify(messageService).readAllByConversationId(20L);
    }

    @Test
    @DisplayName("PATCH /api/v1/conversations/messages/{id} updates message content")
    void testChangeMessage() throws Exception {
        MessageResponseDTO response = new MessageResponseDTO(1L, "Contenido Editado");
        when(messageService.changeMessage(eq(1L), eq("Contenido Editado"))).thenReturn(response);

        String json = """
            {
                "content": "Contenido Editado"
            }
            """;

        mockMvc.perform(patch(BASE_URL + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Contenido Editado"));

        verify(messageService).changeMessage(1L, "Contenido Editado");
    }

    @Test
    @DisplayName("DELETE /api/v1/conversations/messages/{id} deletes message with 204 No Content")
    void testDeleteById() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/1"))
                .andExpect(status().isNoContent());

        verify(messageService).softDeleteMessageById(1L);
    }
}

