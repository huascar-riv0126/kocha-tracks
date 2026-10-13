package hre.dev.springboot_backend.dto;

import org.hibernate.validator.constraints.URL;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SourceResponseDTO(
        Long id,
        @NotBlank @Size(max = 100) String name,
        @NotBlank @URL String url,
        @Size(max = 255) String description) {
}