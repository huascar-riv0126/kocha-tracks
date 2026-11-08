package hre.dev.springboot_backend.dto;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PointDTOTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testSerializationWithLatAndLong() throws Exception {
        PointDTO point = new PointDTO(-17.3895, -66.1568);
        String json = objectMapper.writeValueAsString(point);

        assertThat(json).contains("\"lat\":-17.3895");
        assertThat(json).contains("\"long\":-66.1568");
    }

    @Test
    void testDeserializationWithLatAndLong() throws Exception {
        String json = "{\"lat\": -17.3895, \"long\": -66.1568}";
        PointDTO point = objectMapper.readValue(json, PointDTO.class);

        assertThat(point.getLat()).isEqualTo(-17.3895);
        assertThat(point.getLong()).isEqualTo(-66.1568);
    }

    @Test
    void testDeserializationWithGeoJsonCoordinates() throws Exception {
        String json = "{\"coordinates\": [-66.1568, -17.3895]}";
        PointDTO point = objectMapper.readValue(json, PointDTO.class);

        assertThat(point.getLat()).isEqualTo(-17.3895);
        assertThat(point.getLong()).isEqualTo(-66.1568);
    }
}
