package com.neoshop.repository;

import com.neoshop.model.entity.Review;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    Page<Review> findByProductIdOrderByCreatedAtDesc(UUID productId, Pageable pageable);

    Optional<Review> findByProductIdAndUserId(UUID productId, UUID userId);

    @Query("SELECT AVG(CAST(r.rating AS double)) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRating(@Param("productId") UUID productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Integer getReviewCount(@Param("productId") UUID productId);
}
