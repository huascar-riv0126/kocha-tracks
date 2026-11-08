package hre.dev.springboot_backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import hre.dev.springboot_backend.config.RateLimitInterceptor;
import hre.dev.springboot_backend.logging.RequestLoggingInterceptor;

abstract class ControllerTestSupport {

    @MockitoBean 
    protected RateLimitInterceptor rateLimitInterceptor;

    @MockitoBean
    protected RequestLoggingInterceptor requestLoggingInterceptor;

    @BeforeEach 
    void letRequestsThrough() throws Exception {
        when(rateLimitInterceptor.preHandle(any(), any(), any())).thenReturn(true);
        when(requestLoggingInterceptor.preHandle(any(), any(), any())).thenReturn(true);
    }
}
