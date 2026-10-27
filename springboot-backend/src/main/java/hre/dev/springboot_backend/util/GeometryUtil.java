package hre.dev.springboot_backend.util;

import hre.dev.springboot_backend.dto.PointDTO;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

public final class GeometryUtil {

    public static final int SRID_WGS84 = 4326;
    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), SRID_WGS84);

    private GeometryUtil() {
    }

    public static Point toPoint(PointDTO dto) {
        if (dto == null || dto.getLat() == null || dto.getLong() == null) {
            return null;
        }
        Coordinate coordinate = new Coordinate(dto.getLong(), dto.getLat());
        return GEOMETRY_FACTORY.createPoint(coordinate);
    }

    public static PointDTO toPointDTO(Point point) {
        if (point == null || point.isEmpty()) {
            return null;
        }
        return new PointDTO(point.getY(), point.getX());
    }
}
