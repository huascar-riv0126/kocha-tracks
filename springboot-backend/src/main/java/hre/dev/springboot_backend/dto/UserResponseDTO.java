package hre.dev.springboot_backend.dto;

import hre.dev.springboot_backend.model.User;

public record UserResponseDTO(
        long id,
        String username,
        String role
) {

    public static UserResponseDTO fromEntity(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}