package hre.dev.springboot_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
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
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.dto.ZoneRequestDTO;
import hre.dev.springboot_backend.dto.ZoneResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.model.Zone;
import hre.dev.springboot_backend.repository.UserRepository;
import hre.dev.springboot_backend.repository.ZoneRepository;

@ExtendWith(MockitoExtension.class)
class ZoneServiceTest {

    @Mock
    private ZoneRepository zoneRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ZoneService zoneService;

    private User user;
    private Zone circularZone;
    private Zone polygonZone;

    @BeforeEach
    void setUp() {
        user = new User("mario", "secret", "USER");
        user.setId(1L);

        circularZone = new Zone(user, "Zona Circular Norte", "CIRCULAR", 1500.0);
        ReflectionTestUtils.setField(circularZone, "id", 10L);
        circularZone.setCenter("-17.3895, -66.1568");

        polygonZone = new Zone();
        ReflectionTestUtils.setField(polygonZone, "id", 20L);
        polygonZone.setUser(user);
        polygonZone.setName("Zona Poligonal Centro");
        polygonZone.setType("POLYGON");
        polygonZone.setGeometry("POLYGON((-66.16 -17.39, -66.15 -17.39, -66.15 -17.38, -66.16 -17.38, -66.16 -17.39))");
    }

    @Test
    @DisplayName("getAll() returns all active zones mapped to DTO")
    void testGetAll() {
        when(zoneRepository.findByIsActiveTrue()).thenReturn(List.of(circularZone, polygonZone));

        List<ZoneResponseDTO> result = zoneService.getAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Zona Circular Norte");
        assertThat(result.get(1).getName()).isEqualTo("Zona Poligonal Centro");
        verify(zoneRepository).findByIsActiveTrue();
    }

    @Test
    @DisplayName("getById() returns active zone response when found")
    void testGetById_found() {
        when(zoneRepository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.of(circularZone));

        ZoneResponseDTO response = zoneService.getById(10L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getName()).isEqualTo("Zona Circular Norte");
        assertThat(response.getRadiusMeters()).isEqualTo(1500.0);
    }

    @Test
    @DisplayName("getById() throws ResourceNotFoundException when zone does not exist")
    void testGetById_notFound() {
        when(zoneRepository.findByIdAndIsActiveTrue(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> zoneService.getById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Zone doesn't exist with id: 999");
    }

    @Test
    @DisplayName("create() successfully creates circular zone")
    void testCreate_circular() {
        ZoneRequestDTO request = new ZoneRequestDTO();
        request.setUserId(1L);
        request.setName("Mi Casa Circular");
        request.setType("RADIO");
        request.setCenter("-17.3895, -66.1568");
        request.setRadiusMeters(800.0);

        when(userRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(user));
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> {
            Zone z = invocation.getArgument(0);
            ReflectionTestUtils.setField(z, "id", 30L);
            return z;
        });

        ZoneResponseDTO response = zoneService.create(request);

        assertThat(response.getId()).isEqualTo(30L);
        assertThat(response.getName()).isEqualTo("Mi Casa Circular");
        assertThat(response.getRadiusMeters()).isEqualTo(800.0);
        verify(zoneRepository).save(any(Zone.class));
    }

    @Test
    @DisplayName("create() successfully creates polygon zone")
    void testCreate_polygon() {
        ZoneRequestDTO request = new ZoneRequestDTO();
        request.setUserId(1L);
        request.setName("Parque Urbano");
        request.setType("POLYGON");
        request.setGeometry("POLYGON((-66.16 -17.39, -66.15 -17.39, -66.15 -17.38, -66.16 -17.38, -66.16 -17.39))");

        when(userRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(user));
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> {
            Zone z = invocation.getArgument(0);
            ReflectionTestUtils.setField(z, "id", 31L);
            return z;
        });

        ZoneResponseDTO response = zoneService.create(request);

        assertThat(response.getId()).isEqualTo(31L);
        assertThat(response.getType()).isEqualTo("POLYGON");
        assertThat(response.getGeometry()).contains("POLYGON");
        verify(zoneRepository).save(any(Zone.class));
    }

    @Test
    @DisplayName("create() throws IllegalArgumentException when circular zone lacks center or radius")
    void testCreate_circularMissingFields() {
        ZoneRequestDTO request = new ZoneRequestDTO();
        request.setUserId(1L);
        request.setName("Invalida");
        request.setType("CIRCULAR");

        assertThatThrownBy(() -> zoneService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("center and radiusMeters are required for circular zones");

        verify(zoneRepository, never()).save(any());
    }

    @Test
    @DisplayName("create() throws IllegalArgumentException when polygon zone lacks geometry")
    void testCreate_polygonMissingGeometry() {
        ZoneRequestDTO request = new ZoneRequestDTO();
        request.setUserId(1L);
        request.setName("Invalida");
        request.setType("POLYGON");

        assertThatThrownBy(() -> zoneService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("geometry is required for polygon zones");

        verify(zoneRepository, never()).save(any());
    }

    @Test
    @DisplayName("create() throws ResourceNotFoundException when user is inactive or not found")
    void testCreate_userNotFound() {
        ZoneRequestDTO request = new ZoneRequestDTO();
        request.setUserId(99L);
        request.setName("Zona Valida");
        request.setType("RADIO");
        request.setCenter("-17.38, -66.15");
        request.setRadiusMeters(500.0);

        when(userRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> zoneService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User doesn't exist or is inactive with id: 99");
    }

    @Test
    @DisplayName("updateById() updates zone successfully")
    void testUpdateById_success() {
        ZoneRequestDTO request = new ZoneRequestDTO();
        request.setUserId(1L);
        request.setName("Zona Modificada");
        request.setType("RADIO");
        request.setCenter("-17.39, -66.16");
        request.setRadiusMeters(2000.0);

        when(zoneRepository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.of(circularZone));
        when(userRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(user));
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ZoneResponseDTO response = zoneService.updateById(10L, request);

        assertThat(response.getName()).isEqualTo("Zona Modificada");
        assertThat(response.getRadiusMeters()).isEqualTo(2000.0);
    }

    @Test
    @DisplayName("deleteById() soft-deletes the zone")
    void testDeleteById() {
        when(zoneRepository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.of(circularZone));

        zoneService.deleteById(10L);

        assertThat(circularZone.isIsActive()).isFalse();
        assertThat(circularZone.getDeletedAt()).isNotNull();
        verify(zoneRepository).save(circularZone);
    }
}

