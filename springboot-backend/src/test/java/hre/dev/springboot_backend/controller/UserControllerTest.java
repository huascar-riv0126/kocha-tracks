package hre.dev.springboot_backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import hre.dev.springboot_backend.dto.UserResponseDTO;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.service.UserService;

@WebMvcTest(UserController.class)
class UserControllerTest extends ControllerTestSupport {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Test
    @DisplayName("GET /api/v1/users returns list of users")
    void testGetAll() throws Exception {
        UserResponseDTO user = new UserResponseDTO(1L, "carlos", "USER");
        when(userService.getAll()).thenReturn(List.of(user));

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].username").value("carlos"));

        verify(userService).getAll();
    }

    @Test
    @DisplayName("GET /api/v1/users/{id} returns user by id")
    void testGetById() throws Exception {
        UserResponseDTO user = new UserResponseDTO(1L, "carlos", "USER");
        when(userService.getById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("carlos"));

        verify(userService).getById(1L);
    }

    @Test
    @DisplayName("POST /api/v1/users creates user with 201 Created")
    void testCreate() throws Exception {
        UserResponseDTO created = new UserResponseDTO(2L, "ana", "USER");
        when(userService.create(any(User.class))).thenReturn(created);

        String json = """
            {
                "username": "ana",
                "password": "secretPassword123",
                "role": "USER"
            }
            """;

        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.username").value("ana"));

        verify(userService).create(any(User.class));
    }

    @Test
    @DisplayName("PUT /api/v1/users/{id} updates user")
    void testUpdateById() throws Exception {
        UserResponseDTO updated = new UserResponseDTO(1L, "carlos_modificado", "ADMIN");
        when(userService.updateById(eq(1L), any(User.class))).thenReturn(updated);

        String json = """
            {
                "username": "carlos_modificado",
                "role": "ADMIN"
            }
            """;

        mockMvc.perform(put("/api/v1/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("carlos_modificado"))
                .andExpect(jsonPath("$.role").value("ADMIN"));

        verify(userService).updateById(eq(1L), any(User.class));
    }

    @Test
    @DisplayName("DELETE /api/v1/users/{id} deletes user and returns deleted: true")
    void testDeleteById() throws Exception {
        mockMvc.perform(delete("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted").value(true));

        verify(userService).deleteById(1L);
    }
}

