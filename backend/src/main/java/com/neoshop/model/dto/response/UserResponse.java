package com.neoshop.model.dto.response;

import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
  private UUID id;
  private String username;
  private String email;
  private String fullName;
  private String phoneNumber;
  private String address;
  private String avatar;
  private Set<String> roles;
  private boolean active;
}
