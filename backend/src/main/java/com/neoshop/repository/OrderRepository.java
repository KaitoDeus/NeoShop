package com.neoshop.repository;

import com.neoshop.model.entity.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
  Page<Order> findByUserId(UUID userId, Pageable pageable);

  Page<Order> findByStatus(String status, Pageable pageable);

  @org.springframework.data.jpa.repository.Query(
      "SELECT DISTINCT o FROM Order o "
          + "LEFT JOIN o.user u "
          + "LEFT JOIN o.items i "
          + "LEFT JOIN i.product p "
          + "WHERE (:status IS NULL OR o.status = :status OR (:status = 'PAID' AND o.status = 'COMPLETED')) "
          + "AND (cast(:startDate as timestamp) IS NULL OR o.orderDate >= :startDate) "
          + "AND (cast(:endDate as timestamp) IS NULL OR o.orderDate <= :endDate) "
          + "AND (:query IS NULL OR :query = '' OR "
          + "LOWER(u.email) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR "
          + "LOWER(u.username) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR "
          + "LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR "
          + "LOWER(p.title) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR "
          + "CAST(o.id AS string) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))")
  Page<Order> searchOrders(
      @org.springframework.data.repository.query.Param("status") String status,
      @org.springframework.data.repository.query.Param("query") String query,
      @org.springframework.data.repository.query.Param("startDate")
          java.time.LocalDateTime startDate,
      @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate,
      Pageable pageable);

  @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN ('PAID', 'COMPLETED')")
  BigDecimal sumTotalRevenue();

  @Query(
      "SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN ('PAID', 'COMPLETED') AND o.orderDate BETWEEN :startDate AND :endDate")
  BigDecimal sumRevenueBetween(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

  @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
  List<Object[]> countOrdersByStatus();
}
