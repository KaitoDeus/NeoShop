package com.neoshop.repository;

import com.neoshop.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
        Page<Product> findByCategoryId(UUID categoryId, Pageable pageable);

        Page<Product> findByTitleContainingIgnoreCase(String title, Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p LEFT JOIN p.category c WHERE " +
                        "(?1 IS NULL OR LOWER(p.title) LIKE ?1) AND " +
                        "(?2 IS NULL OR c.id = ?2) AND " +
                        "(?3 IS NULL OR p.status = ?3)")
        Page<Product> findFilteredProducts(String title, UUID categoryId, String status, Pageable pageable);

}
