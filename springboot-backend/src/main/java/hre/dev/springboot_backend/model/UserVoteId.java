package hre.dev.springboot_backend.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public record UserVoteId(
        @Column(name = "user_id") Long userId,
        @Column(name = "event_id") Long eventId) implements Serializable {
}