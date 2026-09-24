package hre.dev.springboot_backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.repository.UserRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/")
public class UserController {

    private final UserRepository userRepository;

    UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getAll() {
        return userRepository.findByIsActiveTrue();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        User user = userRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User doesn't exist with id: " + id));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public User create(@RequestBody User userDetails) {
        userDetails.setIsActive(true);
        return userRepository.save(userDetails);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateById(@PathVariable Long id, @RequestBody User userDetails) {
        User oldUser = userRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User doesn't exist with id: " + id));
        
        oldUser.setUsername(userDetails.getUsername());
        oldUser.setRole(userDetails.getRole());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            oldUser.setPassword(userDetails.getPassword());
        }

        User updatedUser = userRepository.save(oldUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteById(@PathVariable Long id) {
        User user = userRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User doesn't exist with id: " + id));
        
        user.setIsActive(false);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}