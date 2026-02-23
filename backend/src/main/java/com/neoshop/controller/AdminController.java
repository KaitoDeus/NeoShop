package com.neoshop.controller;

import com.neoshop.model.dto.request.ProductKeyRequest;
import com.neoshop.model.dto.request.ProductRequest;
import com.neoshop.model.dto.response.OrderResponse;
import com.neoshop.model.dto.response.ProductKeyResponse;
import com.neoshop.model.dto.response.ProductResponse;
import com.neoshop.model.dto.response.UserResponse;
import com.neoshop.service.OrderService;
import com.neoshop.service.ProductKeyService;
import com.neoshop.service.ProductService;
import com.neoshop.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "Admin specific operations for Orders, Products, and Users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final OrderService orderService;
    private final ProductService productService;
    private final UserService userService;
    private final ProductKeyService productKeyService;

    @GetMapping("/orders")
    @Operation(summary = "List all orders with optional status filter")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page, size);
        String filterStatus = (status != null && status.trim().isEmpty()) ? null : status;
        return ResponseEntity.ok(orderService.getAllOrdersManaged(filterStatus, pageable));

    }

    @GetMapping("/products")
    @Operation(summary = "List all products with filters")
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page, size);

        // Convert empty strings to null for consistent repository filtering
        String filterTitle = (title != null && title.trim().isEmpty()) ? null : title;
        String filterStatus = (status != null && status.trim().isEmpty()) ? null : status;

        UUID categoryUuid = null;
        if (categoryId != null && !categoryId.trim().isEmpty()) {
            try {
                categoryUuid = UUID.fromString(categoryId);
            } catch (IllegalArgumentException e) {
                // Ignore invalid UUID
            }
        }

        return ResponseEntity.ok(productService.getAllProductsAdmin(filterTitle, categoryUuid, filterStatus, pageable));
    }

    @GetMapping("/users")
    @Operation(summary = "List all users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    // Product Management
    @PostMapping("/products")
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable UUID id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Product Key Management
    @GetMapping("/products/{productId}/keys")
    @Operation(summary = "List all keys for a product")
    public ResponseEntity<List<ProductKeyResponse>> getProductKeys(@PathVariable UUID productId) {
        return ResponseEntity.ok(productKeyService.getKeysByProduct(productId));
    }

    @PostMapping("/products/{productId}/keys")
    @Operation(summary = "Add a new key to a product")
    public ResponseEntity<ProductKeyResponse> addProductKey(@PathVariable UUID productId,
            @Valid @RequestBody ProductKeyRequest request) {
        return ResponseEntity.ok(productKeyService.addKey(productId, request));
    }

    @DeleteMapping("/keys/{keyId}")
    @Operation(summary = "Delete a product key")
    public ResponseEntity<Void> deleteProductKey(@PathVariable UUID keyId) {
        productKeyService.deleteKey(keyId);
        return ResponseEntity.noContent().build();
    }
}
