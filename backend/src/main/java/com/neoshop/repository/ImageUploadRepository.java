package com.neoshop.repository;

import com.neoshop.model.entity.ImageUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ImageUploadRepository extends JpaRepository<ImageUpload, UUID> {
}
