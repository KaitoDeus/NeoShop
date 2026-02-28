package com.neoshop;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NeoshopApplication {

  @PostConstruct
  public void init() {
    // Set múi giờ mặc định cho JVM là Asia/Ho_Chi_Minh (GMT+7)
    TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
  }

  public static void main(String[] args) {
    SpringApplication.run(NeoshopApplication.class, args);
  }
}
