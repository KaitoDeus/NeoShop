package com.neoshop.service.impl;

import com.neoshop.model.dto.request.ChangePasswordRequest;
import com.neoshop.model.dto.request.UpdateProfileRequest;
import com.neoshop.model.dto.response.AuthResponse; // Reusing for user details
import com.neoshop.model.entity.Role;
import com.neoshop.model.entity.User;
import com.neoshop.repository.UserRepository;
import com.neoshop.service.UserService;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final com.neoshop.repository.RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public AuthResponse updateProfile(String username, UpdateProfileRequest request) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    if (request.getFullName() != null) user.setFullName(request.getFullName());
    if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
    if (request.getAddress() != null) user.setAddress(request.getAddress());
    if (request.getAvatar() != null) user.setAvatar(request.getAvatar());

    user.setUpdatedAt(java.time.LocalDateTime.now());
    userRepository.save(user);

    return mapToAuthResponse(user);
  }

  @Override
  public void changePassword(String username, ChangePasswordRequest request) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
      throw new RuntimeException("Old password does not match");
    }

    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    user.setUpdatedAt(java.time.LocalDateTime.now());
    userRepository.save(user);
  }

  @Override
  public AuthResponse getCurrentUser(String username) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    return mapToAuthResponse(user);
  }

  @Override
  public org.springframework.data.domain.Page<com.neoshop.model.dto.response.UserResponse>
      getAllUsers(org.springframework.data.domain.Pageable pageable) {
    return userRepository
        .findAll(pageable)
        .map(
            user ->
                com.neoshop.model.dto.response.UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .phoneNumber(user.getPhoneNumber())
                    .address(user.getAddress())
                    .avatar(user.getAvatar())
                    .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                    .active(true)
                    .build());
  }

  @Override
  public com.neoshop.model.dto.response.UserResponse createUser(
      com.neoshop.model.dto.request.RegisterRequest request) {
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new RuntimeException("Username already exists");
    }
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already exists");
    }

    Role userRole =
        roleRepository
            .findByName("USER")
            .orElseGet(() -> roleRepository.save(Role.builder().name("USER").build()));

    User user =
        User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getUsername())
            .address("")
            .phoneNumber("")
            .roles(java.util.Collections.singleton(userRole))
            .createdAt(java.time.LocalDateTime.now())
            .updatedAt(java.time.LocalDateTime.now())
            .build();

    User savedUser = userRepository.save(user);

    return com.neoshop.model.dto.response.UserResponse.builder()
        .id(savedUser.getId())
        .username(savedUser.getUsername())
        .email(savedUser.getEmail())
        .fullName(savedUser.getFullName())
        .roles(savedUser.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
        .active(savedUser.isActive())
        .build();
  }

  @Override
  public com.neoshop.model.dto.response.UserResponse updateUserAdmin(
      UUID id, UpdateProfileRequest request) {
    User user =
        userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

    if (request.getFullName() != null) user.setFullName(request.getFullName());
    if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
    if (request.getAddress() != null) user.setAddress(request.getAddress());
    if (request.getAvatar() != null) user.setAvatar(request.getAvatar());

    user.setUpdatedAt(java.time.LocalDateTime.now());
    User savedUser = userRepository.save(user);

    return com.neoshop.model.dto.response.UserResponse.builder()
        .id(savedUser.getId())
        .username(savedUser.getUsername())
        .email(savedUser.getEmail())
        .fullName(savedUser.getFullName())
        .phoneNumber(savedUser.getPhoneNumber())
        .address(savedUser.getAddress())
        .avatar(savedUser.getAvatar())
        .roles(savedUser.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
        .active(savedUser.isActive())
        .build();
  }

  @Override
  public void deleteUser(UUID id) {
    if (!userRepository.existsById(id)) {
      throw new RuntimeException("User not found");
    }
    userRepository.deleteById(id);
  }

  @Override
  @org.springframework.transaction.annotation.Transactional
  public void deleteUsersBulk(List<UUID> ids) {
    userRepository.deleteAllById(ids);
  }

  @Override
  @org.springframework.transaction.annotation.Transactional
  public void updateUsersStatusBulk(List<UUID> ids, boolean active) {
    List<User> users = userRepository.findAllById(ids);
    users.forEach(user -> user.setActive(active));
    userRepository.saveAll(users);
  }

  private AuthResponse mapToAuthResponse(User user) {
    return AuthResponse.builder()
        .username(user.getUsername())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .phoneNumber(user.getPhoneNumber())
        .address(user.getAddress())
        .avatar(user.getAvatar())
        .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
        .build();
  }
}
