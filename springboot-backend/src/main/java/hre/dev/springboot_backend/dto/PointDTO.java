package hre.dev.springboot_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PointDTO {

    @NotNull(message = "La latitud (lat) es obligatoria")
    private Double lat;

    @NotNull(message = "La longitud (long) es obligatoria")
    @JsonProperty("long")
    private Double longitude;

    public PointDTO() {
    }

    public PointDTO(Double lat, Double longitude) {
        this.lat = lat;
        this.longitude = longitude;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    @JsonProperty("long")
    public Double getLong() {
        return longitude;
    }

    @JsonProperty("long")
    public void setLong(Double longitude) {
        this.longitude = longitude;
    }

    @JsonIgnore
    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    // Alias para compatibilidad con requests JSON alternativos
    @JsonProperty("lng")
    public void setLng(Double lng) {
        if (this.longitude == null) {
            this.longitude = lng;
        }
    }

    @JsonProperty("latitude")
    public void setLatitude(Double latitude) {
        if (this.lat == null) {
            this.lat = latitude;
        }
    }

    // Soporte para estructura GeoJSON: { "type": "Point", "coordinates": [long, lat] }
    @JsonProperty("coordinates")
    public void setCoordinates(List<Double> coordinates) {
        if (coordinates != null && coordinates.size() >= 2) {
            this.longitude = coordinates.get(0);
            this.lat = coordinates.get(1);
        }
    }
}
