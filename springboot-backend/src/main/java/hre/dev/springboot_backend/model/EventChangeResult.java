package hre.dev.springboot_backend.model;

import java.util.List;

public record EventChangeResult(List<EventChange> changes) {
    public boolean hasChanges() {
        return !changes.isEmpty();
    }
}
