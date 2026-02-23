package com.neoshop.service;

import com.neoshop.model.dto.request.ProductKeyRequest;
import com.neoshop.model.dto.response.ProductKeyResponse;
import com.neoshop.model.entity.Product;
import com.neoshop.model.entity.ProductKey;
import com.neoshop.repository.ProductKeyRepository;
import com.neoshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductKeyService {
    private final ProductKeyRepository productKeyRepository;
    private final ProductRepository productRepository;

    public List<ProductKeyResponse> getKeysByProduct(UUID productId) {
        return productKeyRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductKeyResponse addKey(UUID productId, ProductKeyRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductKey newKey = ProductKey.builder()
                .product(product)
                .keyCode(request.getKeyCode())
                .status(ProductKey.KeyStatus.AVAILABLE)
                .build();

        ProductKey savedKey = productKeyRepository.save(newKey);

        // Cập nhật stock quantity
        updateProductStock(product);

        return mapToResponse(savedKey);
    }

    public void deleteKey(UUID keyId) {
        ProductKey key = productKeyRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("Key not found"));

        Product product = key.getProduct();
        productKeyRepository.delete(key);

        // Cập nhật stock quantity
        updateProductStock(product);
    }

    private void updateProductStock(Product product) {
        int stock = (int) productKeyRepository.countByProductIdAndStatus(product.getId(),
                ProductKey.KeyStatus.AVAILABLE);
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
                .build();
    }
}
