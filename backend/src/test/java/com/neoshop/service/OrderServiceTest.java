package com.neoshop.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.neoshop.model.dto.request.OrderRequest;
import com.neoshop.model.dto.response.OrderResponse;
import com.neoshop.model.entity.Order;
import com.neoshop.model.entity.Product;
import com.neoshop.model.entity.ProductKey;
import com.neoshop.model.entity.User;
import com.neoshop.repository.OrderRepository;
import com.neoshop.repository.ProductKeyRepository;
import com.neoshop.repository.ProductRepository;
import com.neoshop.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

  @Mock private OrderRepository orderRepository;
  @Mock private ProductRepository productRepository;
  @Mock private UserRepository userRepository;
  @Mock private ProductKeyRepository productKeyRepository;

  @InjectMocks private OrderService orderService;

  private User sampleUser;
  private Product sampleProduct;
  private UUID userId;
  private UUID productId;

  @BeforeEach
  void setUp() {
    userId = UUID.randomUUID();
    productId = UUID.randomUUID();

    sampleUser =
        User.builder().id(userId).email("test@example.com").fullName("Test Customer").build();

    sampleProduct =
        Product.builder()
            .id(productId)
            .title("Test Product")
            .price(new BigDecimal("100.00"))
            .stockQuantity(10)
            .build();
  }

  @Test
  void createOrder_Successful() {
    // Arrange
    OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest(productId, 2);
    OrderRequest request = new OrderRequest();
    request.setPaymentMethod("MOMO");
    request.setShippingAddress("Digital");
    request.setItems(List.of(itemRequest));

    when(userRepository.findById(userId)).thenReturn(Optional.of(sampleUser));
    when(productRepository.findById(productId)).thenReturn(Optional.of(sampleProduct));
    when(orderRepository.save(any(Order.class)))
        .thenAnswer(
            i -> {
              Order o = i.getArgument(0);
              o.setId(UUID.randomUUID());
              return o;
            });

    // Act
    OrderResponse response = orderService.createOrder(userId, request);

    // Assert
    assertNotNull(response);
    assertEquals("PENDING", response.getStatus());
    assertEquals(new BigDecimal("200.00"), response.getTotalAmount());
    assertEquals(8, sampleProduct.getStockQuantity());

    verify(orderRepository).save(any(Order.class));
  }

  @Test
  void createOrder_InsufficientStock() {
    // Arrange
    OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest(productId, 15);
    OrderRequest request = new OrderRequest();
    request.setItems(List.of(itemRequest));

    when(userRepository.findById(userId)).thenReturn(Optional.of(sampleUser));
    when(productRepository.findById(productId)).thenReturn(Optional.of(sampleProduct));

    // Act & Assert
    Exception exception =
        assertThrows(RuntimeException.class, () -> orderService.createOrder(userId, request));
    assertTrue(exception.getMessage().contains("Insufficient stock"));
  }

  @Test
  void updateOrderStatus_AssignsKeysWhenPaid() {
    // Arrange
    UUID orderId = UUID.randomUUID();
    Order order =
        Order.builder()
            .id(orderId)
            .user(sampleUser)
            .status("PENDING")
            .items(new java.util.ArrayList<>())
            .build();

    order
        .getItems()
        .add(
            com.neoshop.model.entity.OrderItem.builder()
                .product(sampleProduct)
                .quantity(1)
                .build());

    when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
    when(orderRepository.save(any(Order.class))).thenReturn(order);

    ProductKey mockKey =
        ProductKey.builder()
            .keyCode("ABC-123")
            .product(sampleProduct)
            .status(ProductKey.KeyStatus.AVAILABLE)
            .build();

    when(productKeyRepository.findAvailableKeysByProduct(any(), any()))
        .thenReturn(List.of(mockKey));

    // Act
    orderService.updateOrderStatus(orderId, "PAID");

    // Assert
    assertEquals("PAID", order.getStatus());
    assertEquals(ProductKey.KeyStatus.SOLD, mockKey.getStatus());
    assertEquals(orderId, mockKey.getOrderId());
    verify(productKeyRepository).saveAll(any());
  }
}
