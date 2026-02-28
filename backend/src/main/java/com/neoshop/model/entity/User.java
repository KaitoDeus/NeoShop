package com.neoshop.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID id;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(name = "password_hash")
  private String passwordHash;

  private String fullName;

  private String phoneNumber;

  private String address;

  private String avatar;

  @Column(name = "auth_provider")
  @Builder.Default
  private String authProvider = "LOCAL"; // LOCAL, GOOGLE

  @Column(name = "provider_id")
  private String providerId;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
  @Builder.Default
  private java.util.Set<Role> roles = new java.util.HashSet<>();

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @Builder.Default
  private boolean active = true;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
