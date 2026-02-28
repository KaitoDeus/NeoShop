package com.neoshop.service;

import com.neoshop.model.dto.request.GoogleLoginRequest;
import com.neoshop.model.dto.request.LoginRequest;
import com.neoshop.model.dto.response.AuthResponse;

public interface AuthService {
  AuthResponse login(LoginRequest request);

  AuthResponse register(com.neoshop.model.dto.request.RegisterRequest request);

  AuthResponse googleLogin(GoogleLoginRequest request);
}
