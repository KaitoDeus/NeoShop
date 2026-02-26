package com.neoshop.controller;

import com.neoshop.model.dto.response.ProductResponse;
import com.neoshop.service.ProductService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Product Catalog", description = "Quản lý và tra cứu thông tin sản phẩm")
public class ProductController {
  private final ProductService productService;

  @GetMapping
  public ResponseEntity<Page<ProductResponse>> getAllProducts(
      @RequestParam(required = false) String query,
      @RequestParam(required = false) UUID categoryId,
      @RequestParam(required = false) Double minPrice,
      @RequestParam(required = false) Double maxPrice,
      @RequestParam(required = false) String sort,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    org.springframework.data.domain.Sort sortObj = org.springframework.data.domain.Sort.unsorted();
    if (sort != null) {
      switch (sort) {
        case "price_asc":
          sortObj = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC,
              "price");
          break;
        case "price_desc":
          sortObj = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
              "price");
          break;
        case "newest":
          sortObj = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
              "created_at");
          break;
        default:
          break;
      }
    }
    Pageable pageable = PageRequest.of(page, size, sortObj);
    return ResponseEntity.ok(
        productService.getFilteredProducts(query, categoryId, minPrice, maxPrice, pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductResponse> getProductById(@PathVariable UUID id) {
    return ResponseEntity.ok(productService.getProductById(id));
  }

  @GetMapping("/category/{categoryId}")
  public ResponseEntity<Page<ProductResponse>> getProductsByCategory(
      @PathVariable UUID categoryId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(productService.getProductsByCategory(categoryId, pageable));
  }

  @GetMapping("/search")
  public ResponseEntity<Page<ProductResponse>> searchProducts(
      @RequestParam String query,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(productService.searchProducts(query, pageable));
  }
}
