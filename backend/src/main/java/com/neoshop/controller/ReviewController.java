package com.neoshop.controller;

import com.neoshop.model.dto.request.ReviewRequest;
import com.neoshop.model.dto.response.ReviewResponse;
import com.neoshop.service.ReviewService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Review", description = "Đánh giá sản phẩm")
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId, pageable));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable UUID productId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.createReview(productId, userDetails.getUsername(), request));
    }
}
