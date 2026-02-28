package com.neoshop.config.security;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class SecurityConfig {

        private final JwtService jwtService;
        private final UserDetailsService userDetailsService;
        private final AuthenticationProvider authenticationProvider;
        private final RateLimitFilter rateLimitFilter;

        @PostConstruct
        public void init() {
                log.info("SecurityConfig initialized and loaded!");
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http.csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                                .authorizeHttpRequests(
                                                auth -> auth.requestMatchers(
                                                                "/api/v1/auth/login",
                                                                "/api/v1/auth/register",
                                                                "/api/v1/auth/google",
                                                                "/api/products/**",
                                                                "/api/categories/**",
                                                                "/api/upload/**",
                                                                "/api/images/**",
                                                                "/api/payments/vnpay/ipn",
                                                                "/api/payments/vnpay/return",
                                                                "/api/payments/momo/ipn",
                                                                "/api/payments/momo/return",
                                                                "/uploads/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/actuator/**")
                                                                .permitAll()
                                                                .anyRequest()
                                                                .authenticated())
                                .sessionManagement(
                                                session -> session
                                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class) // Add
                                // Rate
                                // Limit
                                // Filter
                                .addFilterBefore(
                                                new JwtAuthenticationFilter(jwtService, userDetailsService),
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(
                                java.util.List.of("http://localhost:5173")); // Allow
                // known
                // frontend
                // ports
                configuration.setAllowedMethods(
                                java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(
                                java.util.List.of(
                                                "Authorization",
                                                "Content-Type",
                                                "X-Requested-With",
                                                "Accept",
                                                "Origin",
                                                "Access-Control-Request-Method",
                                                "Access-Control-Request-Headers"));
                configuration.setExposedHeaders(
                                java.util.List.of("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L); // 1 hour

                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
