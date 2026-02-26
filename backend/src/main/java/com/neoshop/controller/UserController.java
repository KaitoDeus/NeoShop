package com.neoshop.controller;

import com.neoshop.model.dto.request.ChangePasswordRequest;
import com.neoshop.model.dto.request.UpdateProfileRequest;
import com.neoshop.model.dto.response.AuthResponse;
import com.neoshop.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
// Or Principal
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "User Profile Management")
@SecurityRequirement(name = "bearerAuth") // Assuming Swagger config
public class UserController {

  private final UserService userService;

  @GetMapping("/profile")
  @Operation(summary = "Get current user profile")
  public ResponseEntity<AuthResponse> getCurrentUser(Principal principal) {
    return ResponseEntity.ok(userService.getCurrentUser(principal.getName()));
  }

  @RequestMapping(
      value = "/profile",
      method = {RequestMethod.PATCH, RequestMethod.PUT})
  @Operation(
      summary = "Update user profile",
      description = "Update full name, phone number, address, avatar")
  public ResponseEntity<AuthResponse> updateProfile(
      @RequestBody UpdateProfileRequest request, Principal principal) {
    return ResponseEntity.ok(userService.updateProfile(principal.getName(), request));
  }

  @PostMapping("/change-password")
  @Operation(summary = "Change password")
  public ResponseEntity<String> changePassword(
      @Valid @RequestBody ChangePasswordRequest request, Principal principal) {
    userService.changePassword(principal.getName(), request);
    return ResponseEntity.ok("Password changed successfully");
  }
}
