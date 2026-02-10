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

            // Self-check
            String rawPassword = request.getPassword();
            String newHash = passwordEncoder.encode(rawPassword);
            boolean selfCheck = passwordEncoder.matches(rawPassword, newHash);
            log.info("Self-check (encode->matches): {}", selfCheck);

            boolean matches = passwordEncoder.matches(rawPassword, user.getPasswordHash());
            log.info("DB Hash match result: {}", matches);
            if (!matches) {
                // Generate correct hash for debugging/fixing manually
                log.error("\n\n####################\nGENERATED HASH: >>{}<<\n####################\n\n",
                        passwordEncoder.encode(request.getPassword()));
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
                .roles(user.getRole())
                .build();

        var jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }
}
