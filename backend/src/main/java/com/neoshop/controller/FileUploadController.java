package com.neoshop.controller;

import com.neoshop.model.entity.ImageUpload;
import com.neoshop.repository.ImageUploadRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@Tag(name = "Upload", description = "File Upload Management")
@RequiredArgsConstructor
public class FileUploadController {

  private final ImageUploadRepository imageUploadRepository;
  private final String uploadDir = "uploads";

  @PostMapping("/image")
  @Operation(summary = "Upload an image")
  public ResponseEntity<String> uploadImage(
      @RequestParam("file") MultipartFile multipartFile, Principal principal) throws IOException {

    String fileName =
        StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
    String fileExtension =
        fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : ".jpg";
    String newFileName = UUID.randomUUID().toString() + fileExtension;

    Path uploadPath = Paths.get(uploadDir);

    if (!Files.exists(uploadPath)) {
      Files.createDirectories(uploadPath);
    }

    try (InputStream inputStream = multipartFile.getInputStream()) {
      Path filePath = uploadPath.resolve(newFileName);
      Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException ioe) {
      throw new IOException("Could not save image file: " + fileName, ioe);
    }

    // Return the relative URL to the file
    String fileUrl = "/api/images/" + newFileName;

    // Save to database
    ImageUpload imageUpload =
        ImageUpload.builder()
            .fileName(newFileName)
            .fileUrl(fileUrl)
            .fileType(multipartFile.getContentType())
            .fileSize(multipartFile.getSize())
            .uploadedBy(principal != null ? principal.getName() : "anonymous")
            .build();

    imageUploadRepository.save(imageUpload);

    return ResponseEntity.ok(fileUrl);
  }
}
