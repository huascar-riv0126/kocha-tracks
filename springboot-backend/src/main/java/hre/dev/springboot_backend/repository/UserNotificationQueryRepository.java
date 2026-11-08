package hre.dev.springboot_backend.repository;

import java.util.List;
import org.locationtech.jts.geom.Point;

public interface UserNotificationQueryRepository {

    /**
     * Finds distinct user IDs whose active zones of interest contain the given event point.
     * Evaluates both circular (radio) and polygonal (geometry) zones with SRID 4326.
     *
     * @param point Location point of the event
     * @return List of unique user IDs
     */
    List<Long> findUserIdsWithActiveZonesContainingPoint(Point point);
}

