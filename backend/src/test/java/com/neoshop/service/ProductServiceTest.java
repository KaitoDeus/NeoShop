package com.neoshop.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.neoshop.model.dto.response.ProductResponse;
import com.neoshop.model.entity.Product;
import com.neoshop.repository.ProductRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

  @Mock private ProductRepository productRepository;

  @InjectMocks private ProductService productService;

  @Test
  void getAllProducts_ReturnsPage() {
    // Arrange
    Pageable pageable = PageRequest.of(0, 10);
    Product product = Product.builder().title("Test").build();
    Page<Product> page = new PageImpl<>(List.of(product));

    when(productRepository.findAll(pageable)).thenReturn(page);

    // Act
    Page<ProductResponse> result = productService.getAllProducts(pageable);

    // Assert
    assertEquals(1, result.getTotalElements());
    assertEquals("Test", result.getContent().get(0).getTitle());
  }

  @Test
  void getProductById_Successful() {
    // Arrange
    UUID id = UUID.randomUUID();
    Product product = Product.builder().id(id).title("Found").build();
    when(productRepository.findById(id)).thenReturn(Optional.of(product));

    // Act
    ProductResponse response = productService.getProductById(id);

    // Assert
    assertNotNull(response);
    assertEquals("Found", response.getTitle());
  }

  @Test
  void getProductById_NotFound() {
    // Arrange
    UUID id = UUID.randomUUID();
    when(productRepository.findById(id)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> productService.getProductById(id));
  }
}
