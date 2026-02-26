package com.neoshop.repository;

import com.neoshop.model.entity.Product;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
  Page<Product> findByCategoryId(UUID categoryId, Pageable pageable);

  Page<Product> findByTitleContainingIgnoreCase(String title, Pageable pageable);

  @org.springframework.data.jpa.repository.Query(
      value =
          "SELECT * FROM products p WHERE "
              + "(cast(:title as varchar) IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', cast(:title as varchar), '%'))) AND "
              + "(cast(:catId as varchar) IS NULL OR cast(p.category_id as varchar) = cast(:catId as varchar)) AND "
              + "(cast(:status as varchar) IS NULL OR p.status = cast(:status as varchar)) AND "
              + "(:minPrice IS NULL OR COALESCE(p.sale_price, p.price) >= :minPrice) AND "
              + "(:maxPrice IS NULL OR COALESCE(p.sale_price, p.price) <= :maxPrice)",
      countQuery =
          "SELECT count(*) FROM products p WHERE "
              + "(cast(:title as varchar) IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', cast(:title as varchar), '%'))) AND "
              + "(cast(:catId as varchar) IS NULL OR cast(p.category_id as varchar) = cast(:catId as varchar)) AND "
              + "(cast(:status as varchar) IS NULL OR p.status = cast(:status as varchar)) AND "
              + "(:minPrice IS NULL OR COALESCE(p.sale_price, p.price) >= :minPrice) AND "
              + "(:maxPrice IS NULL OR COALESCE(p.sale_price, p.price) <= :maxPrice)",
      nativeQuery = true)
  Page<Product> findFilteredProducts(
      @org.springframework.data.repository.query.Param("title") String title,
      @org.springframework.data.repository.query.Param("catId") UUID categoryId,
      @org.springframework.data.repository.query.Param("status") String status,
      @org.springframework.data.repository.query.Param("minPrice") java.math.BigDecimal minPrice,
      @org.springframework.data.repository.query.Param("maxPrice") java.math.BigDecimal maxPrice,
      Pageable pageable);
}
