package hre.dev.springboot_backend.repository;

import java.util.Collections;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.locationtech.jts.geom.Point;

public class UserNotificationRepositoryCustomImpl implements UserNotificationRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public UserNotificationRepositoryCustomImpl() {
    }

    public UserNotificationRepositoryCustomImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Long> findUserIdsWithActiveZonesContainingPoint(Point point) {
        if (point == null) {
            return Collections.emptyList();
        }

        double longitude = point.getX();
        double latitude = point.getY();

        String sql = """
            SELECT DISTINCT z.user_id
            FROM zones z
            JOIN users u ON u.id = z.user_id
            WHERE z.is_active = true
              AND z.deleted_at IS NULL
              AND u.is_active = true
              AND u.deleted_at IS NULL
              AND (
                (
                  UPPER(TRIM(z.type)) IN ('CIRCULAR', 'RADIO')
                  AND z.center IS NOT NULL
                  AND z.radius_meters IS NOT NULL
                  AND ST_DWithin(
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                    (
                      CASE
                        WHEN z.center LIKE '{%' THEN ST_SetSRID(ST_GeomFromGeoJSON(z.center), 4326)
                        WHEN UPPER(z.center) LIKE 'POINT%' THEN ST_SetSRID(ST_GeomFromText(z.center), 4326)
                        WHEN z.center LIKE '%,%' THEN
                          CASE
                            WHEN CAST(TRIM(SPLIT_PART(z.center, ',', 1)) AS double precision) < -30
                            THEN ST_SetSRID(ST_MakePoint(
                              CAST(TRIM(SPLIT_PART(z.center, ',', 1)) AS double precision),
                              CAST(TRIM(SPLIT_PART(z.center, ',', 2)) AS double precision)
                            ), 4326)
                            ELSE ST_SetSRID(ST_MakePoint(
                              CAST(TRIM(SPLIT_PART(z.center, ',', 2)) AS double precision),
                              CAST(TRIM(SPLIT_PART(z.center, ',', 1)) AS double precision)
                            ), 4326)
                          END
                        ELSE NULL
                      END
                    )::geography,
                    z.radius_meters
                  )
                )
                OR
                (
                  UPPER(TRIM(z.type)) IN ('POLYGON', 'GEOMETRY')
                  AND z.geometry IS NOT NULL
                  AND (
                    CASE
                      WHEN z.geometry LIKE '{%'
                      THEN ST_Covers(ST_SetSRID(ST_GeomFromGeoJSON(z.geometry), 4326), ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))
                      WHEN UPPER(z.geometry) LIKE 'POLYGON%' OR UPPER(z.geometry) LIKE 'MULTIPOLYGON%'
                      THEN ST_Covers(ST_SetSRID(ST_GeomFromText(z.geometry), 4326), ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))
                      ELSE false
                    END
                  )
                )
              )
            """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("lon", longitude);
        query.setParameter("lat", latitude);

        List<?> results = query.getResultList();
        return results.stream()
                .map(val -> ((Number) val).longValue())
                .toList();
    }
}
