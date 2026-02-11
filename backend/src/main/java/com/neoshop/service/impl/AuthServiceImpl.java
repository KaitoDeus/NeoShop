package com.neoshop.service.impl;

import com.neoshop.model.dto.request.LoginRequest;
import com.neoshop.model.dto.response.AuthResponse;
import com.neoshop.repository.UserRepository;
import com.neoshop.config.security.JwtService;
import com.neoshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

        @Override
        public AuthResponse login(LoginRequest request) {
                log.info("Attempting to authenticate user: {}", request.getUsername());

                var userCheck = userRepository.findByUsername(request.getUsername());
                if (userCheck.isPresent()) {
                        var user = userCheck.get();
                        log.info("Checking password for user: {}", user.getUsername());
                        log.info("Stored Hash from DB: >>{}<<", user.getPasswordHash());
                        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                                log.warn("Password mismatch for user: {}", user.getUsername());
                        }
                } else {
                        log.warn("User not found in DB: {}", request.getUsername());
                }

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                var user = userCheck.orElseThrow(() -> new UsernameNotFoundException("User not found"));

                // Chuyển sang định dạng UserDetails của Spring Security để generate token
                var userDetails = org.springframework.security.core.userdetails.User.builder()
                                .username(user.getUsername())
                                .password(user.getPasswordHash())
                                .roles(user.getRoles().stream()
                                                .map(com.neoshop.model.entity.Role::getName)
                                                .toArray(String[]::new))
                                .build();

                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .roles(user.getRoles().stream()
                                                .map(com.neoshop.model.entity.Role::getName)
                                                .collect(java.util.stream.Collectors.toSet()))
                                .build();
        }
}
