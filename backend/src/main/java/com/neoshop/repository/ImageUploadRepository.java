package com.neoshop.repository;

import com.neoshop.model.entity.ImageUpload;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageUploadRepository extends JpaRepository<ImageUpload, UUID> {}
