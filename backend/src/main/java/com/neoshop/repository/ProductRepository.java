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

        @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM products p WHERE " +
                        "(:title IS NULL OR p.title ILIKE CONCAT('%', :title, '%')) AND " +
                        "(:categoryId IS NULL OR p.category_id = CAST(:categoryId AS uuid)) AND " +
                        "(:status IS NULL OR p.status = :status)", countQuery = "SELECT count(*) FROM products p WHERE "
                                        +
                                        "(:title IS NULL OR p.title ILIKE CONCAT('%', :title, '%')) AND " +
                                        "(:categoryId IS NULL OR p.category_id = CAST(:categoryId AS uuid)) AND " +
                                        "(:status IS NULL OR p.status = :status)", nativeQuery = true)
        Page<Product> findFilteredProducts(
                        @org.springframework.data.repository.query.Param("title") String title,
                        @org.springframework.data.repository.query.Param("categoryId") UUID categoryId,
                        @org.springframework.data.repository.query.Param("status") String status,
                        Pageable pageable);

}
