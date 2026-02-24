package com.neoshop.service;

import com.neoshop.model.dto.request.ChangePasswordRequest;
import com.neoshop.model.dto.request.UpdateProfileRequest;
import com.neoshop.model.dto.response.AuthResponse;
import com.neoshop.model.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
import java.util.List;

public interface UserService {
    AuthResponse updateProfile(String username, UpdateProfileRequest request);

    void changePassword(String username, ChangePasswordRequest request);

    AuthResponse getCurrentUser(String username);

    Page<UserResponse> getAllUsers(Pageable pageable);

    UserResponse createUser(com.neoshop.model.dto.request.RegisterRequest request);

    UserResponse updateUserAdmin(UUID id, com.neoshop.model.dto.request.UpdateProfileRequest request);

    void deleteUser(UUID id);

    void deleteUsersBulk(List<UUID> ids);

    void updateUsersStatusBulk(List<UUID> ids, boolean active);
}
