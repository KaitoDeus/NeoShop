package com.neoshop.repository;

import com.neoshop.model.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findByUserId(UUID userId, Pageable pageable);

    Page<Order> findByStatus(String status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:query IS NULL OR o.user.email LIKE %:query% OR o.user.username LIKE %:query% OR CAST(o.id AS string) LIKE %:query%)")
    Page<Order> searchOrders(@Param("status") String status, @Param("query") String query, Pageable pageable);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN ('PAID', 'COMPLETED')")
    BigDecimal sumTotalRevenue();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN ('PAID', 'COMPLETED') AND o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();
}
