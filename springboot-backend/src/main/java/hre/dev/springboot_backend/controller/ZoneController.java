package hre.dev.springboot_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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

import hre.dev.springboot_backend.dto.ZoneRequestDTO;
import hre.dev.springboot_backend.dto.ZoneResponseDTO;
import hre.dev.springboot_backend.service.ZoneService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping("/zones")
    public ResponseEntity<List<ZoneResponseDTO>> getAll() {
        return ResponseEntity.ok(zoneService.getAll());
    }

    @GetMapping("/zones/{id}")
    public ResponseEntity<ZoneResponseDTO> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(zoneService.getById(id));
    }

    @PostMapping("/zones")
    public ResponseEntity<ZoneResponseDTO> create(
            @RequestBody ZoneRequestDTO request) {

        ZoneResponseDTO createdZone = zoneService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdZone);
    }

    @PutMapping("/zones/{id}")
    public ResponseEntity<ZoneResponseDTO> updateById(
            @PathVariable Long id,
            @RequestBody ZoneRequestDTO request) {

        return ResponseEntity.ok(
                zoneService.updateById(id, request)
        );
    }

    @DeleteMapping("/zones/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteById(
            @PathVariable Long id) {

        zoneService.deleteById(id);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return ResponseEntity.ok(response);
    }
}