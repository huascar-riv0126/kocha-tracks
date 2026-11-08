package hre.dev.springboot_backend.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "events_sources")
public class EventSource {

    @EmbeddedId
    private EventSourceId id;

    @MapsId("eventId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    @MapsId("sourceId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_id")
    private Source source;

    protected EventSource() {
    }

    public EventSource(Event event, Source source) {
        this.event = event;
        this.source = source;
        this.id = new EventSourceId(event.getId(), source.getId());
    }
}
