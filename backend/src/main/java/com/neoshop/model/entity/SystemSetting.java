package com.neoshop.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSetting {
  @Id private String settingKey;

  @Column(columnDefinition = "TEXT")
  private String settingValue;
}
