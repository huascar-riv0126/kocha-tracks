package hre.dev.springboot_backend.controller;

import hre.dev.springboot_backend.dto.SourceResponseDTO;
import hre.dev.springboot_backend.model.Source;
import hre.dev.springboot_backend.service.SourceService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sources")
public class SourceController {

    private final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    private SourceResponseDTO  convertToDTO(Source source) {
        return new SourceResponseDTO(
                source.getId(),
                source.getName(),
                source.getUrl(),
                source.getDescription()
        );
    }

    @GetMapping
    public List<SourceResponseDTO> getAllSources() {
        return sourceService.getAllActiveSources().stream()
                .map(this::convertToDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public SourceResponseDTO getSourceById(@PathVariable Long id) {
        return convertToDTO(sourceService.getSourceById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SourceResponseDTO createSource(@Valid @RequestBody SourceResponseDTO request) {
        return convertToDTO(sourceService.createSource(request));
    }

    @PutMapping("/{id}")
    public SourceResponseDTO updateSource(@PathVariable Long id,
                                          @Valid @RequestBody SourceResponseDTO request) {
        return convertToDTO(sourceService.updateSource(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSource(@PathVariable Long id) {
        sourceService.deleteSource(id);
    }
}