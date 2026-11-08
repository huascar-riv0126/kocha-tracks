package hre.dev.springboot_backend.dto.message;

import hre.dev.springboot_backend.model.Message;

public record MessageResponseDTO(
        Long id,
        String content) {
    public static MessageResponseDTO mapToDTO(Message message) {
        return new MessageResponseDTO(
                message.getId(),
                message.getContent());
    }
}
