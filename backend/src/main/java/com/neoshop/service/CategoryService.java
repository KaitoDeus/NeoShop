package com.neoshop.service;

import com.neoshop.model.dto.response.CategoryResponse;
import com.neoshop.model.entity.Category;
import com.neoshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @org.springframework.cache.annotation.Cacheable(value = "categories")
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @org.springframework.cache.annotation.CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse createCategory(com.neoshop.model.dto.request.CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .parentId(request.getParentId())
                .iconUrl(request.getIconUrl())
                .build();
        return mapToResponse(categoryRepository.save(category));
    }

    @org.springframework.cache.annotation.CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse updateCategory(UUID id, com.neoshop.model.dto.request.CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setParentId(request.getParentId());
        category.setIconUrl(request.getIconUrl());
        return mapToResponse(categoryRepository.save(category));
    }

    @org.springframework.cache.annotation.CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .parentId(category.getParentId())
                .iconUrl(category.getIconUrl())
                .build();
    }
}
