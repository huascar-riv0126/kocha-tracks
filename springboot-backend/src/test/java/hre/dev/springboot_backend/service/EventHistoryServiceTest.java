package hre.dev.springboot_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hre.dev.springboot_backend.dto.EventHistoryResponseDTO;
import hre.dev.springboot_backend.model.EventHistory;
import hre.dev.springboot_backend.repository.EventHistoryRepository;

@ExtendWith(MockitoExtension.class)
class EventHistoryServiceTest {
    @Mock
    private EventHistoryRepository repository;

    @InjectMocks
    private EventHistoryService service;

    private EventHistory buildHistory(Long eventId) {
        EventHistory history = new EventHistory(eventId, "test change", "lorem ipsum");
        return history;
    }

    @Test
    @DisplayName("getAll() return all entries mapped to DTO")
    void testGetAll() {
        List<EventHistory> entities = List.of(
                buildHistory(10L),
                buildHistory(20L));
        when(repository.findAll()).thenReturn(entities);

        List<EventHistoryResponseDTO> result = service.getAll();

        assertThat(result).hasSize(2);
        verify(repository).findAll();
    }

    @Test
    @DisplayName("getAll() returns an empty list when db has no entries")
    void testGetAll_empty() {
        when(repository.findAll()).thenReturn(List.of());

        List<EventHistoryResponseDTO> result = service.getAll();

        assertThat(result).isEmpty();
        verify(repository).findAll();
    }

    @Test
    @DisplayName("getAllByEventId() queries the repository with the given eventId")
    void testGetAllByEventId_usesGivenId() {
        when(repository.findAllByEventIdOrderByCreatedAtDesc(10L))
                .thenReturn(List.of(buildHistory(10L)));
        when(repository.findAllByEventIdOrderByCreatedAtDesc(11L))
                .thenReturn(List.of(buildHistory(11L), buildHistory(11L)));

        assertThat(service.getAllByEventId(10L)).hasSize(1);
        assertThat(service.getAllByEventId(11L)).hasSize(2);
    }

    @Test
    @DisplayName("getAllByEventId() returns an empty list if there is no entries for the event")
    void testGetAllByEventId_empty() {
        when(repository.findAllByEventIdOrderByCreatedAtDesc(99L)).thenReturn(List.of());

        List<EventHistoryResponseDTO> result = service.getAllByEventId(99L);

        assertThat(result).isEmpty();
        verify(repository).findAllByEventIdOrderByCreatedAtDesc(99L);
    }
}
