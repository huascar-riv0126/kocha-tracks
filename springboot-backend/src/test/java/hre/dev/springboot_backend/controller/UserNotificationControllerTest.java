package hre.dev.springboot_backend.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import hre.dev.springboot_backend.dto.UserNotificationResponseDTO;
import hre.dev.springboot_backend.service.UserNotificationService;

@WebMvcTest(UserNotificationController.class)
class UserNotificationControllerTest extends ControllerTestSupport {

    private static final String BASE_URL = "/api/v1/users/1/notifications";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserNotificationService service;

    @Test
    @DisplayName("GET /api/v1/users/{userId}/notifications returns all user notifications")
    void testGetAllNotifications() throws Exception {
        LocalDateTime createdAt = LocalDateTime.of(2026, 11, 1, 10, 0);
        when(service.getAllByUserId(1L)).thenReturn(List.of(
                new UserNotificationResponseDTO(10L, "STATUS", "Cambio de estado", false, null, createdAt),
                new UserNotificationResponseDTO(11L, "LOCATION", "Cambio de punto", true, createdAt, createdAt)));

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].notificationId").value(10))
                .andExpect(jsonPath("$[0].change").value("STATUS"))
                .andExpect(jsonPath("$[0].read").value(false))
                .andExpect(jsonPath("$[1].notificationId").value(11))
                .andExpect(jsonPath("$[1].read").value(true));

        verify(service).getAllByUserId(1L);
    }

    @Test
    @DisplayName("GET /api/v1/users/{userId}/notifications returns empty list when no notifications")
    void testGetAllNotifications_empty() throws Exception {
        when(service.getAllByUserId(1L)).thenReturn(List.of());

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("PATCH /api/v1/users/{userId}/notifications/read marks all as read with 204 No Content")
    void testMarkAllAsRead() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/read"))
                .andExpect(status().isNoContent());

        verify(service).markAllAsRead(1L);
    }

    @Test
    @DisplayName("PATCH /api/v1/users/{userId}/notifications/{notificationId}/read marks single notification as read with 204 No Content")
    void testMarkSingleAsRead() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/20/read"))
                .andExpect(status().isNoContent());

        verify(service).markAsRead(1L, 20L);
    }
}

