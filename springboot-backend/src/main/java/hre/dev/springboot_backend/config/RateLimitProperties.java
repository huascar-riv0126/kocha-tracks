package hre.dev.springboot_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@ConfigurationProperties(prefix = "api.ratelimit")
public class RateLimitProperties {

    private Limit global = new Limit(50, 1); 
    private Map<String, Limit> specific = new HashMap<>();

    public Limit getGlobal() { return global; }
    public void setGlobal(Limit global) { this.global = global; }
    public Map<String, Limit> getSpecific() { return specific; }
    public void setSpecific(Map<String, Limit> specific) { this.specific = specific; }

    private static final Logger log = LoggerFactory.getLogger(RateLimitProperties.class);

    @PostConstruct
    public void verifyBinding() {
    log.info("RateLimit Global -> Capacidad: {}, Minutos: {}", global.getCapacity(), global.getMinutes());
    log.info("RateLimit Específico cargado -> {}", specific);
    }

    public static class Limit {
        private int capacity;
        private int minutes;

        public Limit() {}
        public Limit(int capacity, int minutes) {
            this.capacity = capacity;
            this.minutes = minutes;
        }

        public int getCapacity() { return capacity; }
        public void setCapacity(int capacity) { this.capacity = capacity; }
        public int getMinutes() { return minutes; }
        public void setMinutes(int minutes) { this.minutes = minutes; }
    }
}