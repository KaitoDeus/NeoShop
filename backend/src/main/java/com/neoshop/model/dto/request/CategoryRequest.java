package com.neoshop.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
  @NotBlank(message = "Name is required")
  private String name;

  @NotBlank(message = "Slug is required")
  private String slug;

  private UUID parentId;
  private String iconUrl;
}
