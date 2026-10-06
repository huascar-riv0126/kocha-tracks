package hre.dev.springboot_backend.model;

import jakarta.persistence.*;
<<<<<<< HEAD
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

@Entity
@Table(name = "Event")
=======

@Entity
@Table(name = "events")
>>>>>>> feat/hu-14-events-crud
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
<<<<<<< HEAD
    private String name;
=======
    private String title;
>>>>>>> feat/hu-14-events-crud

    @Column(columnDefinition = "TEXT")
    private String description;

<<<<<<< HEAD
    private String location;

    @Column(columnDefinition = "POINT")
    private Point point;

    private LocalDateTime started;
    
    private LocalDateTime ended;
    
    private String state;
    
    private String grade;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Métodos del ciclo de vida para auditoría automática
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructor vacío requerido por JPA
    public Event() {}

=======
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String severity;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true; // Flag para el borrado lógico

    public Event() {
    }

>>>>>>> feat/hu-14-events-crud
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

<<<<<<< HEAD
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
=======
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
>>>>>>> feat/hu-14-events-crud

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

<<<<<<< HEAD
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Point getPoint() { return point; }
    public void setPoint(Point point) { this.point = point; }

    public LocalDateTime getStarted() { return started; }
    public void setStarted(LocalDateTime started) { this.started = started; }

    public LocalDateTime getEnded() { return ended; }
    public void setEnded(LocalDateTime ended) { this.ended = ended; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
=======
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
>>>>>>> feat/hu-14-events-crud
}