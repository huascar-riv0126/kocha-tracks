package hre.dev.springboot_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Zone;
import hre.dev.springboot_backend.repository.ZoneRepository;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;

    public ZoneService(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    public List<Zone> getAll() {
        return zoneRepository.findByIsActiveTrue();
    }

    public Zone getById(Long id) {
        return zoneRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Zone doesn't exist with id: " + id
                        )
                );
    }

    public Zone create(Zone zoneDetails) {
        zoneDetails.setIsActive(true);

        return zoneRepository.save(zoneDetails);
    }

    public Zone updateById(Long id, Zone zoneDetails) {

        Zone oldZone = getById(id);

        oldZone.setName(zoneDetails.getName());
        oldZone.setType(zoneDetails.getType());
        oldZone.setCenter(zoneDetails.getCenter());
        oldZone.setRadiusMeters(zoneDetails.getRadiusMeters());
        oldZone.setGeometry(zoneDetails.getGeometry());

        return zoneRepository.save(oldZone);
    }

    public void deleteById(Long id) {

        Zone zone = getById(id);

        zone.setIsActive(false);
        zone.setDeletedAt(LocalDateTime.now());

        zoneRepository.save(zone);
    }
}