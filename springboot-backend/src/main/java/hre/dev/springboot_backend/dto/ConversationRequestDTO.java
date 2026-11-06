package hre.dev.springboot_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ConversationRequestDTO(
        @NotNull Long creatorId,
        @NotBlank @Size(max = 100) String name) {
}