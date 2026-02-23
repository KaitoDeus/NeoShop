package com.neoshop.service.impl;

import com.neoshop.model.dto.request.LoginRequest;
import com.neoshop.model.dto.request.RegisterRequest;
import com.neoshop.model.dto.response.AuthResponse;
import com.neoshop.model.entity.Role;
import com.neoshop.model.entity.User;
import com.neoshop.repository.RoleRepository;
import com.neoshop.repository.UserRepository;
import com.neoshop.config.security.JwtService;
import com.neoshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

        @Override
        public AuthResponse login(LoginRequest request) {
                log.info("Attempting to authenticate user: {}", request.getUsername());

                var userCheck = userRepository.findByUsername(request.getUsername());
                if (userCheck.isEmpty() && request.getUsername().contains("@")) {
                        userCheck = userRepository.findByEmail(request.getUsername());
                }

                if (userCheck.isPresent()) {
                        var user = userCheck.get();
                        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                                log.warn("Password mismatch for user: {}", user.getUsername());
                        }
                } else {
                        log.warn("User not found in DB: {}", request.getUsername());
                }

                var user = userCheck.orElseThrow(() -> new UsernameNotFoundException("User not found"));

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                user.getUsername(),
                                                request.getPassword()));

                var userDetails = org.springframework.security.core.userdetails.User.builder()
                                .username(user.getUsername())
                                .password(user.getPasswordHash())
                                .roles(user.getRoles().stream()
                                                .map(Role::getName)
                                                .toArray(String[]::new))
                                .build();

                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phoneNumber(user.getPhoneNumber())
                                .address(user.getAddress())
                                .avatar(user.getAvatar())
                                .roles(user.getRoles().stream()
                                                .map(Role::getName)
                                                .collect(Collectors.toSet()))
                                .build();
        }

        @Override
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new RuntimeException("Username already exists");
                }
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                Role userRole = roleRepository.findByName("USER")
                                .orElseGet(() -> roleRepository.save(Role.builder().name("USER").build()));

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .passwordHash(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getUsername())
                                .roles(Collections.singleton(userRole))
                                .createdAt(java.time.LocalDateTime.now())
                                .updatedAt(java.time.LocalDateTime.now())
                                .build();

                userRepository.save(user);

                // Auto login after register
                var userDetails = org.springframework.security.core.userdetails.User.builder()
                                .username(user.getUsername())
                                .password(user.getPasswordHash())
                                .roles(user.getRoles().stream()
                                                .map(Role::getName)
                                                .toArray(String[]::new))
                                .build();

                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phoneNumber(user.getPhoneNumber())
                                .address(user.getAddress())
                                .avatar(user.getAvatar())
                                .roles(user.getRoles().stream()
                                                .map(Role::getName)
                                                .collect(Collectors.toSet()))
                                .build();
        }
}
