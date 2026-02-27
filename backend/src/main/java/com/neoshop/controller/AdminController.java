package com.neoshop.controller;

import com.neoshop.model.dto.request.CategoryRequest;
import com.neoshop.model.dto.request.ProductKeyRequest;
import com.neoshop.model.dto.request.ProductRequest;
import com.neoshop.model.dto.response.OrderResponse;
import com.neoshop.model.dto.response.ProductKeyResponse;
import com.neoshop.model.dto.response.ProductResponse;
import com.neoshop.model.dto.response.UserResponse;
import com.neoshop.service.CategoryService;
import com.neoshop.service.OrderService;
import com.neoshop.service.ProductKeyService;
import com.neoshop.service.ProductService;
import com.neoshop.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
  private final CategoryService categoryService;

  @GetMapping("/orders")
  @Operation(summary = "List all orders with optional status, query and date filters")
  public ResponseEntity<Page<OrderResponse>> getAllOrders(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String query,
      @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
      @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate) {

    // Normalize empty strings to null for repository filtering
    String filterStatus = (status != null && status.trim().isEmpty()) ? null : status;
    String filterQuery = (query != null && query.trim().isEmpty()) ? null : query;

    Pageable pageable = PageRequest.of(
        page, size, org.springframework.data.domain.Sort.by("orderDate").descending());
    return ResponseEntity.ok(
        orderService.getAllOrdersManaged(filterStatus, filterQuery, startDate, endDate, pageable));
  }

  @PostMapping("/orders")
  @Operation(summary = "Admin tạo đơn hàng cho người dùng cụ thể")
  public ResponseEntity<OrderResponse> createOrderForUser(
      @RequestParam UUID userId,
      @jakarta.validation.Valid @RequestBody com.neoshop.model.dto.request.OrderRequest request) {
    return ResponseEntity.ok(orderService.createOrder(userId, request));
  }

  @GetMapping("/products")
  @Operation(summary = "List all products with filters")
  public ResponseEntity<Page<ProductResponse>> getAllProducts(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String title,
      @RequestParam(required = false) String categoryId,
      @RequestParam(required = false) String status,
      @RequestParam(defaultValue = "created_at,desc") String sort) {
    String[] sortParts = sort.split(",");
    org.springframework.data.domain.Sort sortObj = org.springframework.data.domain.Sort.by(sortParts[0]);
    if (sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])) {
      sortObj = sortObj.descending();
    }
    Pageable pageable = PageRequest.of(page, size, sortObj);

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

    return ResponseEntity.ok(
        productService.getAllProductsAdmin(filterTitle, categoryUuid, filterStatus, pageable));
  }

  @GetMapping("/users")
  @Operation(summary = "List all users")
  public ResponseEntity<Page<UserResponse>> getAllUsers(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String query) {
    Pageable pageable = PageRequest.of(page, size);
    String filterQuery = (query != null && query.trim().isEmpty()) ? null : query;
    return ResponseEntity.ok(userService.getAllUsers(filterQuery, pageable));
  }

  @PostMapping("/users")
  @Operation(summary = "Create a new user (Admin)")
  public ResponseEntity<UserResponse> createUser(
      @Valid @RequestBody com.neoshop.model.dto.request.RegisterRequest request) {
    return ResponseEntity.ok(userService.createUser(request));
  }

  @PutMapping("/users/{id}")
  @Operation(summary = "Update user (Admin)")
  public ResponseEntity<UserResponse> updateUserAdmin(
      @PathVariable UUID id,
      @Valid @RequestBody com.neoshop.model.dto.request.UpdateProfileRequest request) {
    return ResponseEntity.ok(userService.updateUserAdmin(id, request));
  }

  @DeleteMapping("/users/{id}")
  @Operation(summary = "Delete user (Admin)")
  public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }

  // Product Management
  @PostMapping("/products")
  @Operation(summary = "Create a new product")
  public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
    return ResponseEntity.ok(productService.createProduct(request));
  }

  @PutMapping("/products/{id}")
  @Operation(summary = "Update an existing product")
  public ResponseEntity<ProductResponse> updateProduct(
      @PathVariable UUID id, @Valid @RequestBody ProductRequest request) {
    return ResponseEntity.ok(productService.updateProduct(id, request));
  }

  @DeleteMapping("/products/{id}")
  @Operation(summary = "Delete a product")
  public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/products/bulk")
  @Operation(summary = "Bulk delete products")
  public ResponseEntity<Void> bulkDeleteProducts(@RequestBody List<UUID> ids) {
    productService.bulkDeleteProducts(ids);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/products/bulk-status")
  @Operation(summary = "Bulk update products status")
  public ResponseEntity<Void> bulkUpdateProductStatus(
      @RequestBody List<UUID> ids, @RequestParam String status) {
    productService.bulkUpdateProductStatus(ids, status);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/users/bulk")
  @Operation(summary = "Bulk delete users")
  public ResponseEntity<Void> bulkDeleteUsers(@RequestBody List<UUID> ids) {
    userService.deleteUsersBulk(ids);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/users/bulk-status")
  @Operation(summary = "Bulk update users status")
  public ResponseEntity<Void> bulkUpdateUserStatus(
      @RequestBody List<UUID> ids, @RequestParam boolean active) {
    userService.updateUsersStatusBulk(ids, active);
    return ResponseEntity.noContent().build();
  }

  // Product Key Management
  @GetMapping("/keys")
  @Operation(summary = "Search all keys with filters and sorting")
  public ResponseEntity<Page<ProductKeyResponse>> searchKeys(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String query,
      @RequestParam(required = false) UUID productId,
      @RequestParam(required = false) String status) {

    // Normalize empty strings to null
    String filterQuery = (query != null && query.trim().isEmpty()) ? null : query;
    String filterStatus = (status != null && status.trim().isEmpty()) ? null : status;

    Pageable pageable = PageRequest.of(
        page, size, org.springframework.data.domain.Sort.by("createdAt").descending());
    return ResponseEntity.ok(productKeyService.searchKeys(productId, filterQuery, filterStatus, pageable));
  }

  @PostMapping("/keys/bulk")
  @Operation(summary = "Bulk add product keys")
  public ResponseEntity<List<ProductKeyResponse>> bulkAddKeys(
      @Valid @RequestBody com.neoshop.model.dto.request.BulkKeyRequest request) {
    return ResponseEntity.ok(productKeyService.bulkAddKeys(request));
  }

  @GetMapping("/products/{productId}/keys")
  @Operation(summary = "List all keys for a product")
  public ResponseEntity<List<ProductKeyResponse>> getProductKeys(@PathVariable UUID productId) {
    return ResponseEntity.ok(productKeyService.getKeysByProduct(productId));
  }

  @PostMapping("/products/{productId}/keys")
  @Operation(summary = "Add a new key to a product")
  public ResponseEntity<ProductKeyResponse> addProductKey(
      @PathVariable UUID productId, @Valid @RequestBody ProductKeyRequest request) {
    return ResponseEntity.ok(productKeyService.addKey(productId, request));
  }

  @DeleteMapping("/keys/{keyId}")
  @Operation(summary = "Delete a product key")
  public ResponseEntity<Void> deleteProductKey(@PathVariable UUID keyId) {
    productKeyService.deleteKey(keyId);
    return ResponseEntity.noContent().build();
  }

  // --- CATEGORY MANAGEMENT ---

  @PostMapping("/categories")
  @Operation(summary = "Create a new category")
  public ResponseEntity<com.neoshop.model.dto.response.CategoryResponse> createCategory(
      @Valid @RequestBody CategoryRequest request) {
    return ResponseEntity.ok(categoryService.createCategory(request));
  }

  @PutMapping("/categories/{id}")
  @Operation(summary = "Update a category")
  public ResponseEntity<com.neoshop.model.dto.response.CategoryResponse> updateCategory(
      @PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
    return ResponseEntity.ok(categoryService.updateCategory(id, request));
  }

  @DeleteMapping("/categories/{id}")
  @Operation(summary = "Delete a category")
  public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
    categoryService.deleteCategory(id);
    return ResponseEntity.noContent().build();
  }

  // --- ORDER MANAGEMENT ---

  @PatchMapping("/orders/{id}/status")
  @Operation(summary = "Update order status")
  public ResponseEntity<OrderResponse> updateOrderStatus(
      @PathVariable UUID id, @RequestParam String status) {
    return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
  }

  @DeleteMapping("/orders/{id}")
  @Operation(summary = "Delete order")
  public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
    orderService.deleteOrder(id);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/orders/bulk")
  @Operation(summary = "Bulk delete orders")
  public ResponseEntity<Void> bulkDeleteOrders(@RequestBody List<UUID> ids) {
    orderService.bulkDeleteOrders(ids);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/orders/bulk-status")
  @Operation(summary = "Bulk update orders status")
  public ResponseEntity<Void> bulkUpdateOrderStatus(
      @RequestBody List<UUID> ids, @RequestParam String status) {
    orderService.bulkUpdateOrderStatus(ids, status);
    return ResponseEntity.noContent().build();
  }
}
