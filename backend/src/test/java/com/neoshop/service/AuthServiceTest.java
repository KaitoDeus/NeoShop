package com.neoshop.service;

import com.neoshop.config.security.JwtService;
import com.neoshop.model.dto.request.LoginRequest;
import com.neoshop.model.dto.response.AuthResponse;
import com.neoshop.model.entity.Role;
import com.neoshop.model.entity.User;
import com.neoshop.repository.UserRepository;
import com.neoshop.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        Role userRole = Role.builder().name("USER").build();
        sampleUser = User.builder()
                .username("testuser")
                .passwordHash("hashedPassword")
                .roles(Set.of(userRole))
                .build();

        loginRequest = new LoginRequest("testuser", "password123");
    }

    @Test
    void login_Successful() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("mock-jwt-token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("mock-jwt-token", response.getToken());
        assertTrue(response.getRoles().contains("USER"));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void login_UserNotFound() {
        // Arrange
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());
        LoginRequest unknownRequest = new LoginRequest("unknown", "password");

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.login(unknownRequest));
    }
}
