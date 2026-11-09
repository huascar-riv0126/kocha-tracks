package hre.dev.springboot_backend.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hre.dev.springboot_backend.model.User;

class UserResponseDTOTest {

    @Test
    @DisplayName("fromEntity() correctly maps User entity to UserResponseDTO")
    void testFromEntity() {
        User user = new User("admin_user", "supersecret", "ADMIN");
        user.setId(5L);

        UserResponseDTO dto = UserResponseDTO.fromEntity(user);

        assertThat(dto.id()).isEqualTo(5L);
        assertThat(dto.username()).isEqualTo("admin_user");
        assertThat(dto.role()).isEqualTo("ADMIN");
    }
}

