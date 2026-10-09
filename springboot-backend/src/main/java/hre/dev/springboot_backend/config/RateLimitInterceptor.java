package hre.dev.springboot_backend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitProperties properties;

    private final Map<String, Bucket> cache = Collections.synchronizedMap(
            new LinkedHashMap<String, Bucket>(100, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<String, Bucket> eldest) {
                    return size() > 5000; 
                }
            }
    );

    public RateLimitInterceptor(RateLimitProperties properties) {
        this.properties = properties;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String clientIp = getClientIP(request);
        String requestUri = request.getRequestURI();
        String matchedRoute = resolveRoutePattern(requestUri);
        String key = clientIp + ":" + matchedRoute;

        Bucket bucket;
        synchronized (cache) {
            bucket = cache.computeIfAbsent(key, k -> createNewBucket(matchedRoute));
        }

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            response.addHeader("X-RateLimit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            long waitForRefill = Math.max(1, probe.getNanosToWaitForRefill() / 1_000_000_000);
            response.addHeader("X-RateLimit-Retry-After-Seconds", String.valueOf(waitForRefill));
            writeJsonErrorResponse(response, requestUri);
            return false;
        }
    }

    private String resolveRoutePattern(String requestUri) {
        if (properties.getSpecific() != null) {
            for (String configuredRoute : properties.getSpecific().keySet()) {
                if (requestUri.equals(configuredRoute) || requestUri.startsWith(configuredRoute + "/")) {
                    return configuredRoute;
                }
            }
        }
        return "GLOBAL";
    }

    private Bucket createNewBucket(String routePattern) {
        RateLimitProperties.Limit limit = properties.getGlobal();
        
        if (!"GLOBAL".equals(routePattern) && properties.getSpecific() != null) {
            limit = properties.getSpecific().getOrDefault(routePattern, properties.getGlobal());
        }

        int capacity = (limit != null && limit.getCapacity() > 0) ? limit.getCapacity() : 60;
        int minutes = (limit != null && limit.getMinutes() > 0) ? limit.getMinutes() : 1;

        Bandwidth bandwidth = Bandwidth.builder()
                .capacity(capacity)
                .refillGreedy(capacity, Duration.ofMinutes(minutes))
                .build();
        return Bucket.builder().addLimit(bandwidth).build();
    }

    private void writeJsonErrorResponse(HttpServletResponse response, String requestUri) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String json = String.format(
                "{\"timestamp\":\"%s\",\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Límite de peticiones excedido. Intenta de nuevo más tarde.\",\"path\":\"%s\"}",
                Instant.now(),
                requestUri
        );
        response.getWriter().write(json);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isBlank()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}