package hre.dev.springboot_backend.dto;

public class ZoneResponseDTO {

    private Long id;
    private Long userId;
    private String name;
    private String type;
    private String center;
    private Double radiusMeters;
    private String geometry;

    public ZoneResponseDTO() {
    }

    public ZoneResponseDTO(
            Long id,
            Long userId,
            String name,
            String type,
            String center,
            Double radiusMeters,
            String geometry) {

        this.id = id;
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.center = center;
        this.radiusMeters = radiusMeters;
        this.geometry = geometry;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCenter() {
        return center;
    }

    public void setCenter(String center) {
        this.center = center;
    }

    public Double getRadiusMeters() {
        return radiusMeters;
    }

    public void setRadiusMeters(Double radiusMeters) {
        this.radiusMeters = radiusMeters;
    }

    public String getGeometry() {
        return geometry;
    }

    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }
}