package hre.dev.springboot_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hre.dev.springboot_backend.dto.SourceResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Source;
import hre.dev.springboot_backend.repository.SourceRepository;

@Service
@Transactional(readOnly = true)
public class SourceService {
    private static final Logger log = LoggerFactory.getLogger(SourceService.class);
    private final SourceRepository sourceRepository;

    public SourceService(SourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }

    public List<Source> getAllActiveSources() {
        return sourceRepository.findAllByDeletedAtIsNull();
    }

    public Source getSourceById(Long id) {
        return sourceRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source " + id + " not found"));
    }

    @Transactional
    public Source createSource(SourceResponseDTO request) {
        Source source = new Source();
        source.setName(request.name());
        source.setUrl(request.url());
        source.setDescription(request.description());
        source.setIsActive(true);

        Source saved = sourceRepository.save(source);
        log.info("Source created: id={}, name={}", saved.getId(), saved.getName());
        return saved;
    }

    @Transactional
    public Source updateSource(Long id, SourceResponseDTO request) {
        Source existing = getSourceById(id);
        existing.setName(request.name());
        existing.setUrl(request.url());
        existing.setDescription(request.description());

        Source saved = sourceRepository.save(existing);
        log.info("Source updated: id={}", saved.getId());
        return saved;
    }

    @Transactional
    public void deleteSource(Long id) {
        Source source = getSourceById(id);
        source.setDeletedAt(LocalDateTime.now());
        source.setIsActive(false);
        sourceRepository.save(source);
        log.info("Source soft-deleted: id={}", id);
    }
}
