package hre.dev.springboot_backend.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingInterceptor.class);
    private static final String START_ATTR = RequestLoggingInterceptor.class.getName() + ".start";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_ATTR, System.nanoTime());
        if (log.isTraceEnabled()) {
            log.trace("Incoming request: {} {} from {}",
                    request.getMethod(), request.getRequestURI(), request.getRemoteAddr());
            log.trace("Request mapped to handler: {}", describe(handler));
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        long elapsedMs = (System.nanoTime() - (long) request.getAttribute(START_ATTR)) / 1_000_000;
        if (log.isTraceEnabled()) {
            log.trace("Request completed in handler: {}", describe(handler));
            if (ex != null) {
                log.trace("Request finished with unresolved exception: {}", ex.toString());
            }
        }

        log.info("{} {} => {} ({} ms)",
                request.getMethod(), request.getRequestURI(), response.getStatus(), elapsedMs);
    }

    private static String describe(Object handler) {
        return handler instanceof HandlerMethod hm ? hm.getShortLogMessage() : String.valueOf(handler);
    }
}