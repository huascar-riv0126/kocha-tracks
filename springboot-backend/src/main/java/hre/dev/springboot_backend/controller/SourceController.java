package hre.dev.springboot_backend.controller;

import hre.dev.springboot_backend.model.Source;
import hre.dev.springboot_backend.service.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sources")
public class SourceController {

    private final SourceService sourceService;

    @Autowired
    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @GetMapping
    public ResponseEntity<List<Source>> getAllSources() {
        return ResponseEntity.ok(sourceService.getAllActiveSources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Source> getSourceById(@PathVariable Long id) {
        return sourceService.getSourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Source> createSource(@RequestBody Source source) {
        Source createdSource = sourceService.createSource(source);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Source> updateSource(@PathVariable Long id, @RequestBody Source source) {
        try {
            Source updated = sourceService.updateSource(id, source);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSource(@PathVariable Long id) {
        sourceService.deleteSource(id);
        return ResponseEntity.noContent().build();
    }
}