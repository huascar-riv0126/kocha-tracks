package hre.dev.springboot_backend.service;

import hre.dev.springboot_backend.model.Source;
import hre.dev.springboot_backend.repository.SourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SourceService {

    private final SourceRepository sourceRepository;

    @Autowired
    public SourceService(SourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }

    public List<Source> getAllActiveSources() {
        return sourceRepository.findAll().stream()
                .filter(source -> source.getDeletedAt() == null)
                .collect(Collectors.toList());
    }

    public Optional<Source> getSourceById(Long id) {
        return sourceRepository.findById(id)
                .filter(source -> source.getDeletedAt() == null);
    }


    public Source createSource(Source source) {
        return sourceRepository.save(source);
    }


    public Source updateSource(Long id, Source updatedSource) {
        return sourceRepository.findById(id).map(existing -> {
            existing.setName(updatedSource.getName());
            existing.setUrl(updatedSource.getUrl());
            existing.setDescription(updatedSource.getDescription());
            existing.setIsActive(updatedSource.getIsActive());
            return sourceRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Source not found with id " + id));
    }

    public void deleteSource(Long id) {
        sourceRepository.findById(id).ifPresent(source -> {
            source.setDeletedAt(LocalDateTime.now());
            source.setIsActive(false);
            sourceRepository.save(source);
        });
    }
}