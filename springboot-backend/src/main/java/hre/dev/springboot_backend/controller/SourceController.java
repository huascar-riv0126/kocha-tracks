package hre.dev.springboot_backend.controller;

import hre.dev.springboot_backend.dto.SourceResponseDTO;
import hre.dev.springboot_backend.model.Source;
import hre.dev.springboot_backend.service.SourceService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/sources")
public class SourceController {

    private final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    private SourceResponseDTO convertToDTO(Source source) {
        return new SourceResponseDTO(
                source.getId(),
                source.getName(),
                source.getUrl(),
                source.getDescription()
        );
    }

    @GetMapping
    public ResponseEntity<List<SourceResponseDTO>> getAllSources() {
        List<SourceResponseDTO> dtos = sourceService.getAllActiveSources().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SourceResponseDTO> getSourceById(@PathVariable Long id) {
        return sourceService.getSourceById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<SourceResponseDTO> createSource(@RequestBody Source source) {
        Source createdSource = sourceService.createSource(source);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(createdSource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SourceResponseDTO> updateSource(@PathVariable Long id, @RequestBody Source source) {
        try {
            Source updated = sourceService.updateSource(id, source);
            return ResponseEntity.ok(convertToDTO(updated));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSource(@PathVariable Long id) {
        try {
            sourceService.deleteSource(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}