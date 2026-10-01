package hre.dev.springboot_backend.dto;

public record SourceResponseDTO(
    Long id,
    String name,
    String url,
    String description
) {}