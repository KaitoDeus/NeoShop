package com.neoshop.repository;

import com.neoshop.model.entity.OrderItem;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

  @Query(
      "SELECT c.name, SUM(oi.unitPrice * oi.quantity) as revenue "
          + "FROM OrderItem oi JOIN oi.product p JOIN p.category c "
          + "WHERE oi.order.status IN ('PAID', 'COMPLETED') "
          + "GROUP BY c.name")
  List<Object[]> getRevenueByCategory();

  @Query(
      "SELECT p.title, SUM(oi.quantity) as totalSold "
          + "FROM OrderItem oi JOIN oi.product p "
          + "WHERE oi.order.status IN ('PAID', 'COMPLETED') "
          + "GROUP BY p.id, p.title "
          + "ORDER BY totalSold DESC")
  List<Object[]> getTopSellingProducts();
}
