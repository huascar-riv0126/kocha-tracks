package hre.dev.springboot_backend.dto;

import java.time.LocalDateTime;

import hre.dev.springboot_backend.model.EventHistory;

public record EventHistoryResponseDTO(
        String change,
        String content,
        LocalDateTime createdAt) {

    public static EventHistoryResponseDTO mapToDTO(EventHistory eh) {
        return new EventHistoryResponseDTO(
                eh.getChange(),
                eh.getContent(),
                eh.getCreatedAt());
    }
}
