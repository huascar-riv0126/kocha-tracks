package hre.dev.springboot_backend.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.model.Event;
import hre.dev.springboot_backend.model.EventHistory;

class EventHistoryResponseDTOTest {
    private final String change = "STATUS";
    private final String content = "Se creo el evento";

    @Test
    @DisplayName("mapToDTO() copies change, content and createdAt from the entity")
    void testMapToDTO() {
        LocalDateTime createdAt = LocalDateTime.of(2026, 1, 1, 1, 1);
        Event event = new Event();
        event.setId(10L);
        EventHistory entity = new EventHistory(event, change, content);
        ReflectionTestUtils.setField(entity, "createdAt", createdAt);

        EventHistoryResponseDTO dto = EventHistoryResponseDTO.mapToDTO(entity);

        assertThat(dto.change()).isEqualTo(change);
        assertThat(dto.content()).isEqualTo(content);
        assertThat(dto.createdAt()).isEqualTo(createdAt);
    }
}
