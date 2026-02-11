package com.neoshop.controller;

import com.neoshop.model.entity.Product;
import com.neoshop.model.entity.ProductKey;
import com.neoshop.repository.ProductKeyRepository;
import com.neoshop.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/keys")
@RequiredArgsConstructor
@Tag(name = "Admin Key Management", description = "Quản lý khóa sản phẩm kỹ thuật số dành cho Admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminKeyController {
    private final ProductKeyRepository productKeyRepository;
    private final ProductRepository productRepository;

    @PostMapping("/bulk-add")
    @Operation(summary = "Thêm hàng loạt key cho sản phẩm")
    public ResponseEntity<String> bulkAddKeys(
            @RequestParam UUID productId,
            @RequestBody List<String> keyCodes) {
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductKey> keys = keyCodes.stream()
                .map(code -> ProductKey.builder()
                        .product(product)
                        .keyCode(code)
                        .status(ProductKey.KeyStatus.AVAILABLE)
                        .build())
                .collect(Collectors.toList());

        productKeyRepository.saveAll(keys);
        return ResponseEntity.ok("Successfully added " + keys.size() + " keys");
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Xem danh sách key của một sản phẩm")
    public ResponseEntity<Page<ProductKey>> getKeysByProduct(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productKeyRepository.findByProductId(productId, PageRequest.of(page, size)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa key")
    public ResponseEntity<Void> deleteKey(@PathVariable UUID id) {
        productKeyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
