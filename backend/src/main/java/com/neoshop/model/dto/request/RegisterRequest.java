package com.neoshop.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
  @NotBlank(message = "Tên đăng nhập không được để trống")
  @Size(min = 4, max = 20, message = "Tên đăng nhập phải từ 4 đến 20 ký tự")
  @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z0-9._-]{4,}$", message = "Tên đăng nhập không chứa ký tự đặc biệt không hợp lệ")
  private String username;

  @NotBlank(message = "Email không được để trống")
  @Email(message = "Định dạng email không hợp lệ")
  private String email;

  @NotBlank(message = "Mật khẩu không được để trống")
  @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
  @jakarta.validation.constraints.Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).*$", message = "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt")
  private String password;
}
