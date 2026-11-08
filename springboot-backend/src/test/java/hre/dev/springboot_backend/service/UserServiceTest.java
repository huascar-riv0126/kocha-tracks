package hre.dev.springboot_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import hre.dev.springboot_backend.dto.UserResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("marcelo", "raw_password", "USER");
        user.setId(1L);
    }

    @Test
    @DisplayName("getAll() returns active users mapped to DTO")
    void testGetAll() {
        when(userRepository.findByIsActiveTrue()).thenReturn(List.of(user));

        List<UserResponseDTO> result = userService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).username()).isEqualTo("marcelo");
        verify(userRepository).findByIsActiveTrue();
    }

    @Test
    @DisplayName("getById() returns user when found")
    void testGetById_found() {
        when(userRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(user));

        UserResponseDTO result = userService.getById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.username()).isEqualTo("marcelo");
    }

    @Test
    @DisplayName("getById() throws ResourceNotFoundException when user does not exist")
    void testGetById_notFound() {
        when(userRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User doesn't exist with id: 99");
    }

    @Test
    @DisplayName("create() encodes password and sets user active")
    void testCreate() {
        User newUser = new User("sofia", "plain_text", "ADMIN");
        when(passwordEncoder.encode("plain_text")).thenReturn("encoded_hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(2L);
            return u;
        });

        UserResponseDTO response = userService.create(newUser);

        assertThat(response.id()).isEqualTo(2L);
        assertThat(response.username()).isEqualTo("sofia");
        assertThat(newUser.getPassword()).isEqualTo("encoded_hash");
        assertThat(newUser.isIsActive()).isTrue();
        verify(userRepository).save(newUser);
    }

    @Test
    @DisplayName("updateById() updates fields and encodes new password when provided")
    void testUpdateById_withPassword() {
        User updateDetails = new User("marcelo_renamed", "new_secret", "ADMIN");
        when(userRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("new_secret")).thenReturn("new_hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO response = userService.updateById(1L, updateDetails);

        assertThat(response.username()).isEqualTo("marcelo_renamed");
        assertThat(response.role()).isEqualTo("ADMIN");
        assertThat(user.getPassword()).isEqualTo("new_hash");
    }

    @Test
    @DisplayName("updateById() leaves password unchanged when not provided")
    void testUpdateById_withoutPassword() {
        User updateDetails = new User("marcelo_renamed", "", "USER");
        when(userRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO response = userService.updateById(1L, updateDetails);

        assertThat(response.username()).isEqualTo("marcelo_renamed");
        assertThat(user.getPassword()).isEqualTo("raw_password");
    }

    @Test
    @DisplayName("deleteById() soft-deletes user")
    void testDeleteById() {
        when(userRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(user));

        userService.deleteById(1L);

        assertThat(user.isIsActive()).isFalse();
        assertThat(user.getDeletedAt()).isNotNull();
        verify(userRepository).save(user);
    }
}

