package com.neoshop.model.dto.response;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
  private UUID id;
  private String name;
  private String slug;
  private UUID parentId;
  private String iconUrl;
}
