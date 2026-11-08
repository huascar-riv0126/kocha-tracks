package hre.dev.springboot_backend.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record MessageRequestDTO(
        @NotNull @Positive Long authorId,
        @NotNull @Positive Long conversationId,
        @NotBlank @Size(max = 255) String content) {
}
