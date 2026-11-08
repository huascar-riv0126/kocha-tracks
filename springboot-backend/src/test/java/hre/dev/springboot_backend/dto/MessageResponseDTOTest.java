package hre.dev.springboot_backend.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.dto.message.MessageResponseDTO;
import hre.dev.springboot_backend.model.Conversation;
import hre.dev.springboot_backend.model.Message;
import hre.dev.springboot_backend.model.User;

class MessageResponseDTOTest {

    @Test
    @DisplayName("mapToDTO() correctly maps Message entity to DTO")
    void testMapToDTO() {
        User author = new User("daniela", "pass", "USER");
        author.setId(3L);

        Conversation conv = new Conversation(author, "Ruta Bloqueada");
        ReflectionTestUtils.setField(conv, "id", 10L);

        Message message = new Message(author, conv, "La avenida Blanco Galindo se encuentra bloqueada.");
        ReflectionTestUtils.setField(message, "id", 88L);

        MessageResponseDTO dto = MessageResponseDTO.mapToDTO(message);

        assertThat(dto.id()).isEqualTo(88L);
        assertThat(dto.content()).isEqualTo("La avenida Blanco Galindo se encuentra bloqueada.");
    }
}

