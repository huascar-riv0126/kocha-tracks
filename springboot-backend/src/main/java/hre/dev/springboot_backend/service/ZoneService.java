package hre.dev.springboot_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import hre.dev.springboot_backend.dto.ZoneRequestDTO;
import hre.dev.springboot_backend.dto.ZoneResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.model.Zone;
import hre.dev.springboot_backend.repository.UserRepository;
import hre.dev.springboot_backend.repository.ZoneRepository;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final UserRepository userRepository;

    public ZoneService(
            ZoneRepository zoneRepository,
            UserRepository userRepository) {
        this.zoneRepository = zoneRepository;
        this.userRepository = userRepository;
    }

    public List<ZoneResponseDTO> getAll() {
        return zoneRepository.findByIsActiveTrue()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ZoneResponseDTO getById(Long id) {
        Zone zone = findActiveZone(id);
        return toResponseDTO(zone);
    }

    public ZoneResponseDTO create(ZoneRequestDTO request) {

        validateRequest(request);

        User user = userRepository.findByIdAndIsActiveTrue(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User doesn't exist or is inactive with id: "
                                        + request.getUserId()
                        )
                );

        Zone zone = new Zone();

        zone.setUser(user);
        zone.setName(request.getName());
        zone.setType(request.getType());
        zone.setCenter(request.getCenter());
        zone.setRadiusMeters(request.getRadiusMeters());
        zone.setGeometry(request.getGeometry());
        zone.setIsActive(true);

        Zone savedZone = zoneRepository.save(zone);

        return toResponseDTO(savedZone);
    }

    public ZoneResponseDTO updateById(
            Long id,
            ZoneRequestDTO request) {

        validateRequest(request);

        Zone zone = findActiveZone(id);

        // Si también quieres permitir cambiar el usuario de la zona:
        User user = userRepository.findByIdAndIsActiveTrue(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User doesn't exist or is inactive with id: "
                                        + request.getUserId()
                        )
                );

        zone.setUser(user);
        zone.setName(request.getName());
        zone.setType(request.getType());
        zone.setCenter(request.getCenter());
        zone.setRadiusMeters(request.getRadiusMeters());
        zone.setGeometry(request.getGeometry());

        Zone updatedZone = zoneRepository.save(zone);

        return toResponseDTO(updatedZone);
    }

    public void deleteById(Long id) {

        Zone zone = findActiveZone(id);

        zone.setIsActive(false);
        zone.setDeletedAt(LocalDateTime.now());

        zoneRepository.save(zone);
    }

    private Zone findActiveZone(Long id) {
        return zoneRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Zone doesn't exist with id: " + id
                        )
                );
    }

    private ZoneResponseDTO toResponseDTO(Zone zone) {
        return new ZoneResponseDTO(
                zone.getId(),
                zone.getUser().getId(),
                zone.getName(),
                zone.getType(),
                zone.getCenter(),
                zone.getRadiusMeters(),
                zone.getGeometry()
        );
    }

    private void validateRequest(ZoneRequestDTO request) {

        if (request.getUserId() == null) {
            throw new IllegalArgumentException("userId is required");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("name is required");
        }

        if (request.getType() == null || request.getType().isBlank()) {
            throw new IllegalArgumentException("type is required");
        }

        String type = request.getType().trim().toUpperCase();

        if (type.equals("CIRCULAR") || type.equals("RADIO")) {
            if (request.getCenter() == null
                    || request.getCenter().isBlank()
                    || request.getRadiusMeters() == null) {

                throw new IllegalArgumentException(
                        "center and radiusMeters are required for circular zones"
                );
            }
        }

        if (type.equals("GEOMETRY") || type.equals("POLYGON")) {
            if (request.getGeometry() == null
                    || request.getGeometry().isBlank()) {

                throw new IllegalArgumentException(
                        "geometry is required for polygon zones"
                );
            }
        }
    }
}