package hre.dev.springboot_backend.dto;

import java.time.LocalDateTime;

import hre.dev.springboot_backend.model.Conversation;

public record ConversationResponseDTO(
        Long id,
        Long userId,
        String name,
        LocalDateTime started,
        String state,
        int approval,
        int disapproval) {
    public static ConversationResponseDTO mapToDTO(Conversation c) {
        return new ConversationResponseDTO(
                c.getId(),
                c.getCreator().getId(),
                c.getName(),
                c.getStarted(),
                c.getState(),
                c.getApproval(),
                c.getDisapproval());
    }
}
