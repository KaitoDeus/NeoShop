package com.neoshop.service;

import com.neoshop.model.entity.SystemSetting;
import com.neoshop.repository.SystemSettingRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemSettingService {
  private final SystemSettingRepository repository;

  public Map<String, String> getAllSettings() {
    try {
      return repository.findAll().stream()
          .filter(s -> s.getSettingKey() != null)
          .collect(
              Collectors.toMap(
                  SystemSetting::getSettingKey,
                  s -> s.getSettingValue() != null ? s.getSettingValue() : ""));
    } catch (Exception e) {
      log.error("Error fetching all settings", e);
      return new HashMap<>();
    }
  }

  @Transactional
  public void updateSettings(Map<String, String> settings) {
    if (settings == null) return;

    settings.forEach(
        (key, value) -> {
          try {
            SystemSetting setting =
                repository.findById(key).orElse(SystemSetting.builder().settingKey(key).build());
            setting.setSettingValue(value);
            repository.save(setting);
          } catch (Exception e) {
            log.error("Error updating setting: {}", key, e);
          }
        });
  }

  public String getSetting(String key, String defaultValue) {
    return repository.findById(key).map(SystemSetting::getSettingValue).orElse(defaultValue);
  }
}
