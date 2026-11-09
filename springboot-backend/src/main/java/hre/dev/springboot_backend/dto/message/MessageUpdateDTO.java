package hre.dev.springboot_backend.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageUpdateDTO(
        @NotBlank @Size(max = 255) String content) {
}
