package com.neoshop.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neoshop.model.dto.response.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

  private final Map<String, RequestInfo> requestCounts = new ConcurrentHashMap<>();
  private static final int MAX_REQUESTS = 5; // 5 requests
  private static final long TIME_WINDOW = 60000; // 1 minute window

  private static class RequestInfo {
    AtomicInteger count = new AtomicInteger(0);
    AtomicLong startTime = new AtomicLong(System.currentTimeMillis());
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String path = request.getRequestURI();

    // Apply rate limiting only to authentication endpoints
    if (path.startsWith("/api/v1/auth/")) {
      String clientIp = getClientIp(request);
      RequestInfo info = requestCounts.computeIfAbsent(clientIp, k -> new RequestInfo());

      long currentTime = System.currentTimeMillis();
      long windowStart = info.startTime.get();

      if (currentTime - windowStart > TIME_WINDOW) {
        // Reset window
        info.startTime.set(currentTime);
        info.count.set(1);
      } else {
        if (info.count.incrementAndGet() > MAX_REQUESTS) {
          log.warn("Rate limit exceeded for IP: {}", clientIp);
          response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
          response.setContentType("application/json");

          ErrorResponse errorResponse =
              ErrorResponse.builder()
                  .status(HttpStatus.TOO_MANY_REQUESTS.value())
                  .message("Rate limit exceeded. Please try again later.")
                  .timestamp(LocalDateTime.now())
                  .build();

          new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
          return;
        }
      }
    }

    filterChain.doFilter(request, response);
  }

  private String getClientIp(HttpServletRequest request) {
    String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader == null) {
      return request.getRemoteAddr();
    }
    return xfHeader.split(",")[0];
  }
}
