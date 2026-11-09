package hre.dev.springboot_backend.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.dto.conversation.ConversationResponseDTO;
import hre.dev.springboot_backend.model.Conversation;
import hre.dev.springboot_backend.model.User;

class ConversationResponseDTOTest {

    @Test
    @DisplayName("mapToDTO() correctly maps Conversation entity to DTO")
    void testMapToDTO() {
        User creator = new User("carlos", "pwd", "USER");
        creator.setId(7L);

        Conversation conversation = new Conversation(creator, "Debate Comunitario");
        ReflectionTestUtils.setField(conversation, "id", 42L);
        LocalDateTime started = LocalDateTime.of(2026, 4, 1, 10, 0);
        ReflectionTestUtils.setField(conversation, "started", started);
        conversation.setState("OPEN");
        conversation.setApproval(15);
        conversation.setDisapproval(2);

        ConversationResponseDTO dto = ConversationResponseDTO.mapToDTO(conversation);

        assertThat(dto.id()).isEqualTo(42L);
        assertThat(dto.userId()).isEqualTo(7L);
        assertThat(dto.name()).isEqualTo("Debate Comunitario");
        assertThat(dto.started()).isEqualTo(started);
        assertThat(dto.state()).isEqualTo("OPEN");
        assertThat(dto.approval()).isEqualTo(15);
        assertThat(dto.disapproval()).isEqualTo(2);
    }
}

