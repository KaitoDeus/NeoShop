package com.neoshop.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.neoshop.config.security.JwtService;
import com.neoshop.model.dto.request.GoogleLoginRequest;
import com.neoshop.model.dto.request.LoginRequest;
import com.neoshop.model.dto.request.RegisterRequest;
import com.neoshop.model.dto.response.AuthResponse;
import com.neoshop.model.entity.Role;
import com.neoshop.model.entity.User;
import com.neoshop.repository.RoleRepository;
import com.neoshop.repository.UserRepository;
import com.neoshop.service.AuthService;
import java.util.Collections;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

  @Value("${google.client-id:}")
  private String googleClientId;

  @Override
  public AuthResponse login(LoginRequest request) {
    log.info("Attempting to authenticate user: {}", request.getUsername());

    var userCheck = userRepository.findByUsername(request.getUsername());
    if (userCheck.isEmpty() && request.getUsername().contains("@")) {
      userCheck = userRepository.findByEmail(request.getUsername());
    }

    if (userCheck.isEmpty()) {
      log.warn("Login failed: User not found: {}", request.getUsername());
      throw new org.springframework.security.authentication.BadCredentialsException(
          "Thông tin đăng nhập không chính xác");
    }

    var user = userCheck.get();
    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
      log.warn("Login failed: Password mismatch for user: {}", user.getUsername());
      throw new org.springframework.security.authentication.BadCredentialsException(
          "Thông tin đăng nhập không chính xác");
    }

    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));

    var userDetails = org.springframework.security.core.userdetails.User.builder()
        .username(user.getUsername())
        .password(user.getPasswordHash())
        .roles(user.getRoles().stream().map(Role::getName).toArray(String[]::new))
        .build();

    var jwtToken = jwtService.generateToken(userDetails);

    return AuthResponse.builder()
        .userId(user.getId())
        .token(jwtToken)
        .username(user.getUsername())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .phoneNumber(user.getPhoneNumber())
        .address(user.getAddress())
        .avatar(user.getAvatar())
        .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
        .build();
  }

  @Override
  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new IllegalArgumentException("Tên đăng nhập đã tồn tại, vui lòng chọn tên khác");
    }
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("Email đã được sử dụng, vui lòng chọn email khác");
    }

    Role userRole = roleRepository
        .findByName("USER")
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

    // Tự động đăng nhập sau khi đăng ký
    var userDetails = org.springframework.security.core.userdetails.User.builder()
        .username(user.getUsername())
        .password(user.getPasswordHash())
        .roles(user.getRoles().stream().map(Role::getName).toArray(String[]::new))
        .build();

    var jwtToken = jwtService.generateToken(userDetails);

    return AuthResponse.builder()
        .userId(user.getId())
        .token(jwtToken)
        .username(user.getUsername())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .phoneNumber(user.getPhoneNumber())
        .address(user.getAddress())
        .avatar(user.getAvatar())
        .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
        .build();
  }

  @Override
  public AuthResponse googleLogin(GoogleLoginRequest request) {
    try {
      // Xác thực Google ID Token
      GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
          new NetHttpTransport(), GsonFactory.getDefaultInstance())
          .setAudience(Collections.singletonList(googleClientId))
          .build();

      GoogleIdToken idToken = verifier.verify(request.getCredential());
      if (idToken == null) {
        throw new org.springframework.security.authentication.BadCredentialsException(
            "Token Google không hợp lệ");
      }

      GoogleIdToken.Payload payload = idToken.getPayload();
      String googleId = payload.getSubject();
      String email = payload.getEmail();
      String name = (String) payload.get("name");
      String picture = (String) payload.get("picture");

      log.info("Google login: email={}, name={}, googleId={}", email, name, googleId);

      // Tìm người dùng hiện có theo email hoặc tạo mới
      User user = userRepository.findByEmail(email).orElse(null);

      if (user == null) {
        // Tạo người dùng mới từ dữ liệu Google
        Role userRole = roleRepository
            .findByName("USER")
            .orElseGet(() -> roleRepository.save(Role.builder().name("USER").build()));

        // Tạo username duy nhất từ tiền tố email
        String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9._-]", "");
        String username = baseUsername;
        int suffix = 1;
        while (userRepository.existsByUsername(username)) {
          username = baseUsername + suffix;
          suffix++;
        }

        user = User.builder()
            .username(username)
            .email(email)
            .passwordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
            .fullName(name != null ? name : username)
            .avatar(picture)
            .authProvider("GOOGLE")
            .providerId(googleId)
            .roles(Collections.singleton(userRole))
            .createdAt(java.time.LocalDateTime.now())
            .updatedAt(java.time.LocalDateTime.now())
            .build();

        userRepository.save(user);
        log.info("Created new user from Google: {}", username);
      } else {
        // Cập nhật thông tin Google nếu chưa liên kết
        if (!"GOOGLE".equals(user.getAuthProvider())) {
          user.setAuthProvider("GOOGLE");
          user.setProviderId(googleId);
        }
        // Cập nhật avatar nếu chưa có
        if (user.getAvatar() == null && picture != null) {
          user.setAvatar(picture);
        }
        // Cập nhật họ tên nếu trống
        if (user.getFullName() == null && name != null) {
          user.setFullName(name);
        }
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        log.info("Existing user logged in via Google: {}", user.getUsername());
      }

      // Tạo JWT token
      var userDetails = org.springframework.security.core.userdetails.User.builder()
          .username(user.getUsername())
          .password(user.getPasswordHash())
          .roles(user.getRoles().stream().map(Role::getName).toArray(String[]::new))
          .build();

      var jwtToken = jwtService.generateToken(userDetails);

      return AuthResponse.builder()
          .userId(user.getId())
          .token(jwtToken)
          .username(user.getUsername())
          .email(user.getEmail())
          .fullName(user.getFullName())
          .phoneNumber(user.getPhoneNumber())
          .address(user.getAddress())
          .avatar(user.getAvatar())
          .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
          .build();

    } catch (org.springframework.security.authentication.BadCredentialsException e) {
      throw e;
    } catch (Exception e) {
      log.error("Đăng nhập Google thất bại", e);
      throw new org.springframework.security.authentication.BadCredentialsException(
          "Đăng nhập Google thất bại: " + e.getMessage());
    }
  }
}
