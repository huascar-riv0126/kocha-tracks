package hre.dev.springboot_backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class EventRequestDTO {

    @NotBlank(message = "El nombre del evento es obligatorio")
    private String name;

    private String description;

    private String location;

    @NotNull(message = "El punto geográfico (lat, long) es obligatorio")
    @Valid
    private PointDTO point;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime started;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime ended;

    private String state;

    private String grade;

    public EventRequestDTO() {
    }

    public EventRequestDTO(String name, String description, String location, PointDTO point,
                           LocalDateTime started, LocalDateTime ended, String state, String grade) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.point = point;
        this.started = started;
        this.ended = ended;
        this.state = state;
        this.grade = grade;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public PointDTO getPoint() {
        return point;
    }

    public void setPoint(PointDTO point) {
        this.point = point;
    }

    public LocalDateTime getStarted() {
        return started;
    }

    public void setStarted(LocalDateTime started) {
        this.started = started;
    }

    public LocalDateTime getEnded() {
        return ended;
    }

    public void setEnded(LocalDateTime ended) {
        this.ended = ended;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}