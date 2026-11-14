package hre.dev.springboot_backend.dto;

public record LoginRequestDTO(
        String email,
        String password
) {}