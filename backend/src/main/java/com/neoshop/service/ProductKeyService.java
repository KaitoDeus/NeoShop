package com.neoshop.service;

import com.neoshop.model.dto.request.BulkKeyRequest;
import com.neoshop.model.dto.request.ProductKeyRequest;
import com.neoshop.model.dto.response.ProductKeyResponse;
import com.neoshop.model.entity.Product;
import com.neoshop.model.entity.ProductKey;
import com.neoshop.repository.ProductKeyRepository;
import com.neoshop.repository.ProductRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductKeyService {
  private final ProductKeyRepository productKeyRepository;
  private final ProductRepository productRepository;

  public Page<ProductKeyResponse> searchKeys(
      UUID productId, String query, String status, Pageable pageable) {
    ProductKey.KeyStatus keyStatus = null;
    if (status != null && !status.isEmpty()) {
      try {
        keyStatus = ProductKey.KeyStatus.valueOf(status.toUpperCase());
      } catch (IllegalArgumentException e) {
        // Bỏ qua trạng thái không hợp lệ
      }
    }

    return productKeyRepository
        .searchKeys(productId, query, keyStatus, pageable)
        .map(this::mapToResponse);
  }

  public List<ProductKeyResponse> getKeysByProduct(UUID productId) {
    return productKeyRepository.findByProductId(productId).stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public ProductKeyResponse addKey(UUID productId, ProductKeyRequest request) {
    Product product = productRepository
        .findById(productId)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    ProductKey newKey = ProductKey.builder()
        .product(product)
        .keyCode(request.getKeyCode())
        .status(ProductKey.KeyStatus.AVAILABLE)
        .build();

    ProductKey savedKey = productKeyRepository.save(newKey);
    updateProductStock(product);

    return mapToResponse(savedKey);
  }

  @Transactional
  public List<ProductKeyResponse> bulkAddKeys(BulkKeyRequest request) {
    Product product = productRepository
        .findById(request.getProductId())
        .orElseThrow(() -> new RuntimeException("Product not found"));

    List<ProductKey> keysToSave = new ArrayList<>();
    for (String keyCode : request.getKeyCodes()) {
      if (keyCode == null || keyCode.trim().isEmpty())
        continue;

      keysToSave.add(
          ProductKey.builder()
              .product(product)
              .keyCode(keyCode.trim())
              .status(ProductKey.KeyStatus.AVAILABLE)
              .build());
    }

    List<ProductKey> savedKeys = productKeyRepository.saveAll(keysToSave);
    updateProductStock(product);

    return savedKeys.stream().map(this::mapToResponse).collect(Collectors.toList());
  }

  @Transactional
  public void deleteKey(UUID keyId) {
    ProductKey key = productKeyRepository
        .findById(keyId)
        .orElseThrow(() -> new RuntimeException("Key not found"));

    Product product = key.getProduct();
    productKeyRepository.delete(key);
    updateProductStock(product);
  }

  private void updateProductStock(Product product) {
    int stock = (int) productKeyRepository.countByProductIdAndStatus(
        product.getId(), ProductKey.KeyStatus.AVAILABLE);
    product.setStockQuantity(stock);
    productRepository.save(product);
  }

  private ProductKeyResponse mapToResponse(ProductKey key) {
    return ProductKeyResponse.builder()
        .id(key.getId())
        .productId(key.getProduct().getId())
        .keyCode(key.getKeyCode())
        .status(key.getStatus().name())
        .orderId(key.getOrderId())
        .productTitle(key.getProduct().getTitle())
        .createdAt(key.getCreatedAt())
        .build();
  }
}
