package hre.dev.springboot_backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Zone;
import hre.dev.springboot_backend.repository.ZoneRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/")
public class ZoneController {

    private final ZoneRepository zoneRepository;

    ZoneController(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    @GetMapping("/zones")
    public List<Zone> getAll() {
        return zoneRepository.findByIsActiveTrue();
    }

    @GetMapping("/zones/{id}")
    public ResponseEntity<Zone> getById(@PathVariable Long id) {
        Zone zone = zoneRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zone doesn't exist with id: " + id));
        return ResponseEntity.ok(zone);
    }

    @PostMapping("/zones")
    public Zone create(@RequestBody Zone zoneDetails) {
        zoneDetails.setIsActive(true);
        return zoneRepository.save(zoneDetails);
    }

    @PutMapping("/zones/{id}")
    public ResponseEntity<Zone> updateById(@PathVariable Long id, @RequestBody Zone zoneDetails) {
        Zone oldZone = zoneRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zone doesn't exist with id: " + id));

        oldZone.setName(zoneDetails.getName());
        oldZone.setType(zoneDetails.getType());
        oldZone.setCenter(zoneDetails.getCenter());
        oldZone.setRadiusMeters(zoneDetails.getRadiusMeters());
        oldZone.setGeometry(zoneDetails.getGeometry());

        Zone updatedZone = zoneRepository.save(oldZone);
        return ResponseEntity.ok(updatedZone);
    }

    @DeleteMapping("/zones/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteById(@PathVariable Long id) {
        Zone zone = zoneRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zone doesn't exist with id: " + id));

        zone.setIsActive(false);
        zone.setDeletedAt(LocalDateTime.now());
        zoneRepository.save(zone);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}