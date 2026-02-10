package com.neoshop.service;

import com.neoshop.model.dto.request.LoginRequest;
import com.neoshop.model.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
