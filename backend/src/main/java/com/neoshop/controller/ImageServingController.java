package com.neoshop.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
@Tag(name = "Image Serving", description = "Phục vụ ảnh đã tải lên")
@Slf4j
public class ImageServingController {

  private final String uploadDir = "/app/uploads";

  @GetMapping("/{filename:.+}")
  @Operation(summary = "Serve an image by filename")
  public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
    log.info("Requesting image: {}", filename);
    try {
      Path filePath = Paths.get(uploadDir).resolve(filename).normalize();

      if (!Files.exists(filePath)) {
        log.warn("Image not found at primary path: {}", filePath);
        // Thử đường dẫn tương đối 'uploads'
        filePath = Paths.get("uploads").resolve(filename).normalize();
        if (!Files.exists(filePath)) {
          log.error("Image definitely not found: {}", filename);
          return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
      }

      Resource resource = new UrlResource(filePath.toUri());

      if (resource.exists() || resource.isReadable()) {
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
          contentType = "image/jpeg";
          if (filename.toLowerCase().endsWith(".png"))
            contentType = "image/png";
          else if (filename.toLowerCase().endsWith(".gif"))
            contentType = "image/gif";
        }

        log.info("Serving image: {} with type: {}", filename, contentType);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .body(resource);
      } else {
        log.warn("Resource exists but not readable: {}", filename);
        return ResponseEntity.notFound().build();
      }
    } catch (IOException e) {
      log.error("Exception while serving image: {}", filename, e);
      return ResponseEntity.internalServerError().build();
    }
  }
}
