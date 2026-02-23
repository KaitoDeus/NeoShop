package com.neoshop.repository;

import com.neoshop.model.entity.ProductKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductKeyRepository extends JpaRepository<ProductKey, UUID> {

    @Query("SELECT pk FROM ProductKey pk WHERE pk.product.id = :productId AND pk.status = 'AVAILABLE'")
    List<ProductKey> findAvailableKeysByProduct(UUID productId, Pageable pageable);

    long countByProductIdAndStatus(UUID productId, ProductKey.KeyStatus status);

    Page<ProductKey> findByProductId(UUID productId, Pageable pageable);

    List<ProductKey> findByProductId(UUID productId);
}
