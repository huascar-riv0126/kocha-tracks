package hre.dev.springboot_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.dto.SourceResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Source;
import hre.dev.springboot_backend.repository.SourceRepository;

@ExtendWith(MockitoExtension.class)
class SourceServiceTest {

    @Mock
    private SourceRepository sourceRepository;

    @InjectMocks
    private SourceService sourceService;

    private Source source;

    @BeforeEach
    void setUp() {
        source = new Source();
        ReflectionTestUtils.setField(source, "id", 1L);
        source.setName("Los Tiempos");
        source.setUrl("https://www.lostiempos.com");
        source.setDescription("Periodico regional Cochabamba");
        source.setIsActive(true);
    }

    @Test
    @DisplayName("getAllActiveSources() returns non-deleted sources")
    void testGetAllActiveSources() {
        when(sourceRepository.findAllByDeletedAtIsNull()).thenReturn(List.of(source));

        List<Source> result = sourceService.getAllActiveSources();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Los Tiempos");
        verify(sourceRepository).findAllByDeletedAtIsNull();
    }

    @Test
    @DisplayName("getSourceById() returns source when found")
    void testGetSourceById_found() {
        when(sourceRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(source));

        Source result = sourceService.getSourceById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Los Tiempos");
    }

    @Test
    @DisplayName("getSourceById() throws ResourceNotFoundException when not found")
    void testGetSourceById_notFound() {
        when(sourceRepository.findByIdAndDeletedAtIsNull(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sourceService.getSourceById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Source 999 not found");
    }

    @Test
    @DisplayName("createSource() creates and persists a new source")
    void testCreateSource() {
        SourceResponseDTO request = new SourceResponseDTO(null, "Opinion", "https://www.opinion.com.bo", "Diario de Cochabamba");
        when(sourceRepository.save(any(Source.class))).thenAnswer(invocation -> {
            Source s = invocation.getArgument(0);
            ReflectionTestUtils.setField(s, "id", 2L);
            return s;
        });

        Source created = sourceService.createSource(request);

        assertThat(created.getId()).isEqualTo(2L);
        assertThat(created.getName()).isEqualTo("Opinion");
        assertThat(created.getIsActive()).isTrue();
        verify(sourceRepository).save(any(Source.class));
    }

    @Test
    @DisplayName("updateSource() updates existing source details")
    void testUpdateSource() {
        SourceResponseDTO request = new SourceResponseDTO(1L, "Los Tiempos Digital", "https://lostiempos.com/digital", "Periodico Digital");
        when(sourceRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(source));
        when(sourceRepository.save(any(Source.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Source updated = sourceService.updateSource(1L, request);

        assertThat(updated.getName()).isEqualTo("Los Tiempos Digital");
        assertThat(updated.getUrl()).isEqualTo("https://lostiempos.com/digital");
        assertThat(updated.getDescription()).isEqualTo("Periodico Digital");
        verify(sourceRepository).save(source);
    }

    @Test
    @DisplayName("deleteSource() soft-deletes the source")
    void testDeleteSource() {
        when(sourceRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(source));

        sourceService.deleteSource(1L);

        assertThat(source.getIsActive()).isFalse();
        assertThat(source.getDeletedAt()).isNotNull();
        verify(sourceRepository).save(source);
    }
}

