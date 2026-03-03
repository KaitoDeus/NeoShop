package com.neoshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  @org.springframework.beans.factory.annotation.Value("${application.cors.allowed-origins:${ALLOWED_ORIGINS:http://localhost:5173}}")
  private java.util.List<String> allowedOrigins;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    // Broaden CORS for all API and uploads endpoints
    registry
        .addMapping("/**")
        .allowedOrigins(allowedOrigins.toArray(new String[0]))
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
        .allowedHeaders("*")
        .allowCredentials(true);
  }
}
