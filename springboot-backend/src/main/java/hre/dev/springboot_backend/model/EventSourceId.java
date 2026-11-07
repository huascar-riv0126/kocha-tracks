package hre.dev.springboot_backend.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public record EventSourceId(
        @Column(name = "event_id") Long eventId,
        @Column(name = "source_id") Long sourceId) implements Serializable {
}
