package hre.dev.springboot_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import hre.dev.springboot_backend.dto.UserNotificationResponseDTO;
import hre.dev.springboot_backend.service.UserNotificationService;

@RestController
@RequestMapping(path = "api/v1/users/{userId}/notifications")
public class UserNotificationController {
    private final UserNotificationService service;

    public UserNotificationController(UserNotificationService service) {
        this.service = service;
    }

    @GetMapping()
    public List<UserNotificationResponseDTO> getAllNotifications(@PathVariable Long userId) {
        return this.service.getAllByUserId(userId);
    }
    
    @PatchMapping("/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(@PathVariable Long userId) {
        service.markAllAsRead(userId);
    }

    @PatchMapping("/{notificationId}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(@PathVariable Long userId, @PathVariable Long notificationId) {
        service.markAsRead(userId, notificationId);
    }
}
