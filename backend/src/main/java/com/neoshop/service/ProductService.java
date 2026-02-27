package com.neoshop.service;

import com.neoshop.model.dto.request.ProductRequest;
import com.neoshop.model.dto.response.ProductResponse;
import com.neoshop.model.entity.Category;
import com.neoshop.model.entity.Product;
import com.neoshop.repository.CategoryRepository;
import com.neoshop.repository.ProductRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {
  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;

  public Page<ProductResponse> getAllProducts(Pageable pageable) {
    return productRepository.findAll(pageable).map(this::mapToResponse);
  }

  public Page<ProductResponse> getProductsByCategory(UUID categoryId, Pageable pageable) {
    return productRepository.findByCategoryId(categoryId, pageable).map(this::mapToResponse);
  }

  public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
    return productRepository
        .findByTitleContainingIgnoreCase(query, pageable)
        .map(this::mapToResponse);
  }

  @org.springframework.transaction.annotation.Transactional(readOnly = true)
  public Page<ProductResponse> getAllProductsAdmin(
      String title, UUID categoryId, String status, Pageable pageable) {
    String searchTitle = (title != null && !title.isBlank()) ? "%" + title.toLowerCase() + "%" : null;
    return productRepository
        .findFilteredProducts(searchTitle, categoryId, status, null, null, pageable)
        .map(this::mapToResponse);
  }

  public Page<ProductResponse> getFilteredProducts(
      String title, UUID categoryId, Double minPrice, Double maxPrice, Pageable pageable) {
    java.math.BigDecimal min = minPrice != null ? java.math.BigDecimal.valueOf(minPrice) : null;
    java.math.BigDecimal max = maxPrice != null ? java.math.BigDecimal.valueOf(maxPrice) : null;
    return productRepository
        .findFilteredProducts(title, categoryId, "ACTIVE", min, max, pageable)
        .map(this::mapToResponse);
  }

  @org.springframework.cache.annotation.Cacheable(value = "products", key = "#id")
  public ProductResponse getProductById(UUID id) {
    Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    return mapToResponse(product);
  }

  public ProductResponse createProduct(ProductRequest request) {
    Category category = null;
    if (request.getCategoryId() != null) {
      category = categoryRepository
          .findById(request.getCategoryId())
          .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    Product product = Product.builder()
        .title(request.getTitle())
        .description(request.getDescription())
        .price(request.getPrice())
        .salePrice(request.getSalePrice())
        .category(category)
        .stockQuantity(0)
        .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
        .createdAt(LocalDateTime.now())
        .build();

    Product savedProduct = productRepository.save(product);
    return mapToResponse(savedProduct);
  }

  @org.springframework.cache.annotation.CachePut(value = "products", key = "#id")
  public ProductResponse updateProduct(UUID id, ProductRequest request) {
    Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

    Category category = null;
    if (request.getCategoryId() != null) {
      category = categoryRepository
          .findById(request.getCategoryId())
          .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    product.setTitle(request.getTitle());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setSalePrice(request.getSalePrice());
    product.setCategory(category);
    if (request.getStatus() != null) {
      product.setStatus(request.getStatus());
    }

    Product updatedProduct = productRepository.save(product);
    return mapToResponse(updatedProduct);
  }

  @org.springframework.cache.annotation.CacheEvict(value = "products", key = "#id")
  public void deleteProduct(UUID id) {
    if (!productRepository.existsById(id)) {
      throw new RuntimeException("Product not found");
    }
    productRepository.deleteById(id);
  }

  @org.springframework.transaction.annotation.Transactional
  public void bulkDeleteProducts(List<UUID> ids) {
    productRepository.deleteAllById(ids);
  }

  @org.springframework.transaction.annotation.Transactional
  public void bulkUpdateProductStatus(List<UUID> ids, String status) {
    List<Product> products = productRepository.findAllById(ids);
    products.forEach(product -> product.setStatus(status));
    productRepository.saveAll(products);
  }

  private ProductResponse mapToResponse(Product product) {
    return ProductResponse.builder()
        .id(product.getId())
        .title(product.getTitle())
        .description(product.getDescription())
        .price(product.getPrice())
        .salePrice(product.getSalePrice())
        .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
        .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
        .stockQuantity(product.getStockQuantity())
        .status(product.getStatus())
        .createdAt(product.getCreatedAt())
        .averageRating(product.getAverageRating() != null ? product.getAverageRating() : 0.0)
        .reviewCount(product.getReviewCount() != null ? product.getReviewCount() : 0)
        .build();
  }
}
