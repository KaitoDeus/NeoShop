package com.neoshop.service;

import com.neoshop.model.dto.request.ChangePasswordRequest;
import com.neoshop.model.dto.request.UpdateProfileRequest;
import com.neoshop.model.dto.response.AuthResponse; // Reusing AuthResponse or create UserResponse

public interface UserService {
    AuthResponse updateProfile(String username, UpdateProfileRequest request);

    void changePassword(String username, ChangePasswordRequest request);

    AuthResponse getCurrentUser(String username);
}
