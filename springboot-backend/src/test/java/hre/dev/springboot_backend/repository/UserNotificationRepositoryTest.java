package hre.dev.springboot_backend.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserNotificationRepositoryTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    private UserNotificationRepositoryCustomImpl queryRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @BeforeEach
    void setUp() {
        queryRepository = new UserNotificationRepositoryCustomImpl(entityManager);
    }

    @Test
    @DisplayName("findUserIdsWithActiveZonesContainingPoint() returns empty list when point is null")
    void testFindUserIds_nullPoint() {
        List<Long> result = queryRepository.findUserIdsWithActiveZonesContainingPoint(null);

        assertThat(result).isEmpty();
        verify(entityManager, never()).createNativeQuery(anyString());
    }

    @Test
    @DisplayName("findUserIdsWithActiveZonesContainingPoint() binds lon/lat and returns distinct user IDs")
    void testFindUserIds_success() {
        Point point = geometryFactory.createPoint(new Coordinate(-66.1568, -17.3895));

        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.getResultList()).thenReturn(List.of(10L, 20L));

        List<Long> userIds = queryRepository.findUserIdsWithActiveZonesContainingPoint(point);

        assertThat(userIds).containsExactly(10L, 20L);

        ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
        verify(entityManager).createNativeQuery(sqlCaptor.capture());

        String sql = sqlCaptor.getValue();
        // Verify DISTINCT and essential filters
        assertThat(sql).contains("SELECT DISTINCT z.user_id");
        assertThat(sql).contains("FROM zones z");
        assertThat(sql).contains("JOIN users u ON u.id = z.user_id");
        assertThat(sql).contains("z.is_active = true");
        assertThat(sql).contains("z.deleted_at IS NULL");
        assertThat(sql).contains("u.is_active = true");
        assertThat(sql).contains("u.deleted_at IS NULL");

        // Verify Circular spatial functions
        assertThat(sql).contains("ST_DWithin");
        assertThat(sql).contains("CIRCULAR");
        assertThat(sql).contains("RADIO");
        assertThat(sql).contains("radius_meters");

        // Verify Polygon spatial functions
        assertThat(sql).contains("ST_Covers");
        assertThat(sql).contains("POLYGON");
        assertThat(sql).contains("GEOMETRY");
        assertThat(sql).contains("ST_GeomFromGeoJSON");
        assertThat(sql).contains("ST_GeomFromText");

        // Verify parameters
        verify(query).setParameter(eq("lon"), eq(-66.1568));
        verify(query).setParameter(eq("lat"), eq(-17.3895));
    }

    @Test
    @DisplayName("findUserIdsWithActiveZonesContainingPoint() converts BigInteger or Number results to Long")
    void testFindUserIds_numberConversion() {
        Point point = geometryFactory.createPoint(new Coordinate(-66.1568, -17.3895));

        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.getResultList()).thenReturn(List.of(Integer.valueOf(100), Long.valueOf(200)));

        List<Long> userIds = queryRepository.findUserIdsWithActiveZonesContainingPoint(point);

        assertThat(userIds).containsExactly(100L, 200L);
    }

    @Test
    @DisplayName("findUserIdsWithActiveZonesContainingPoint() returns empty list when query returns no rows")
    void testFindUserIds_emptyResult() {
        Point point = geometryFactory.createPoint(new Coordinate(-66.1568, -17.3895));

        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.getResultList()).thenReturn(Collections.emptyList());

        List<Long> userIds = queryRepository.findUserIdsWithActiveZonesContainingPoint(point);

        assertThat(userIds).isEmpty();
    }
}
