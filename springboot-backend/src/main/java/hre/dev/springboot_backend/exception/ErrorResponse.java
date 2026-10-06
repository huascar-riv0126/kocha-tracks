package hre.dev.springboot_backend.exception;

import java.util.List;

public record ErrorResponse(int status, String message, List<FieldError> errors) {
    public record FieldError(String field, String message) {}

    public ErrorResponse(int status, String message) {
        this(status, message, List.of());
    }
}