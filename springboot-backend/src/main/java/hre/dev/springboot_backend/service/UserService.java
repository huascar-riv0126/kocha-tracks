package hre.dev.springboot_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import hre.dev.springboot_backend.dto.UserResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponseDTO> getAll() {
        return userRepository.findByIsActiveTrue()
                .stream()
                .map(UserResponseDTO::fromEntity)
                .toList();
    }

    public UserResponseDTO getById(Long id) {
        User user = findActiveUser(id);

        return UserResponseDTO.fromEntity(user);
    }

    public UserResponseDTO create(User userDetails) {

        userDetails.setPassword(
                passwordEncoder.encode(userDetails.getPassword())
        );

        userDetails.setIsActive(true);

        User savedUser = userRepository.save(userDetails);

        return UserResponseDTO.fromEntity(savedUser);
    }

    public UserResponseDTO updateById(
            Long id,
            User userDetails
    ) {

        User oldUser = findActiveUser(id);

        oldUser.setUsername(userDetails.getUsername());
        oldUser.setRole(userDetails.getRole());

        if (userDetails.getPassword() != null
                && !userDetails.getPassword().isBlank()) {

            oldUser.setPassword(
                    passwordEncoder.encode(userDetails.getPassword())
            );
        }

        User updatedUser = userRepository.save(oldUser);

        return UserResponseDTO.fromEntity(updatedUser);
    }

    public void deleteById(Long id) {

        User user = findActiveUser(id);

        user.setIsActive(false);
        user.setDeletedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    private User findActiveUser(Long id) {

        return userRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User doesn't exist with id: " + id
                        )
                );
    }
}