package com.neoshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
  private String token;
  private String username;
  private String email;
  private String fullName;
  private String phoneNumber;
  private String address;
  private String avatar;
  private java.util.Set<String> roles;
}
