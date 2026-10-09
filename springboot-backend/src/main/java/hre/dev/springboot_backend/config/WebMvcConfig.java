package hre.dev.springboot_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import hre.dev.springboot_backend.logging.RequestLoggingInterceptor;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final RateLimitInterceptor rateLimitInterceptor;
    private final RequestLoggingInterceptor requestLoggerInterceptor;

    public WebMvcConfig(RateLimitInterceptor rateLimitInterceptor, RequestLoggingInterceptor requestLoggerInterceptor) {
        this.rateLimitInterceptor = rateLimitInterceptor;
        this.requestLoggerInterceptor = requestLoggerInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestLoggerInterceptor)
            .addPathPatterns("/api/**")
            .excludePathPatterns("/actuator/**")
            .order(Ordered.HIGHEST_PRECEDENCE);

        registry.addInterceptor (rateLimitInterceptor)
        .addPathPatterns("/api/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("X-RateLimit-Remaining", "X-RateLimit-Retry-After-Seconds");
    }
}