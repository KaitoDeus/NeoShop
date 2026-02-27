package com.neoshop.service;

import com.neoshop.model.dto.request.ReviewRequest;
import com.neoshop.model.dto.response.ReviewResponse;
import com.neoshop.model.entity.Product;
import com.neoshop.model.entity.Review;
import com.neoshop.model.entity.User;
import com.neoshop.repository.ProductRepository;
import com.neoshop.repository.ReviewRepository;
import com.neoshop.repository.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByProduct(UUID productId, Pageable pageable) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable).map(this::mapToResponse);
    }

    @Transactional
    public ReviewResponse createReview(UUID productId, String username, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewRepository.findByProductIdAndUserId(productId, user.getId()).isPresent()) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);
        updateProductRating(product);

        return mapToResponse(savedReview);
    }

    private void updateProductRating(Product product) {
        Double avgRating = reviewRepository.getAverageRating(product.getId());
        Integer count = reviewRepository.getReviewCount(product.getId());

        product.setAverageRating(Math.round((avgRating != null ? avgRating : 0.0) * 10.0) / 10.0);
        product.setReviewCount(count != null ? count : 0);
        productRepository.save(product);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName() != null && !review.getUser().getFullName().isBlank()
                        ? review.getUser().getFullName()
                        : review.getUser().getUsername())
                .userAvatar(review.getUser().getAvatar())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
