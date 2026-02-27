package com.neoshop.repository;

import com.neoshop.model.entity.ProductKey;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductKeyRepository extends JpaRepository<ProductKey, UUID> {

        @Query("SELECT pk FROM ProductKey pk WHERE pk.product.id = :productId AND pk.status = 'AVAILABLE'")
        List<ProductKey> findAvailableKeysByProduct(
                        @Param("productId") UUID productId, Pageable pageable);

        long countByProductIdAndStatus(UUID productId, ProductKey.KeyStatus status);

        Page<ProductKey> findByProductId(UUID productId, Pageable pageable);

        List<ProductKey> findByProductId(UUID productId);

        List<ProductKey> findByOrderId(UUID orderId);

        List<ProductKey> findByOrderIdIn(List<UUID> orderIds);

        @Query("SELECT pk FROM ProductKey pk WHERE "
                        + "(:query IS NULL OR :query = '' OR "
                        + " LOWER(pk.keyCode) LIKE LOWER(CONCAT('%', :query, '%')) OR "
                        + " LOWER(pk.product.title) LIKE LOWER(CONCAT('%', :query, '%'))) AND "
                        + "(:productId IS NULL OR pk.product.id = :productId) AND "
                        + "(:status IS NULL OR pk.status = :status)")
        Page<ProductKey> searchKeys(
                        @Param("productId") UUID productId,
                        @Param("query") String query,
                        @Param("status") ProductKey.KeyStatus status,
                        Pageable pageable);
}
