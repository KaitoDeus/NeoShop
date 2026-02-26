package com.neoshop.controller;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.neoshop.model.dto.response.OrderResponse;
import com.neoshop.model.dto.response.ProductResponse;
import com.neoshop.model.dto.response.UserResponse;
import com.neoshop.service.CategoryService;
import com.neoshop.service.OrderService;
import com.neoshop.service.ProductKeyService;
import com.neoshop.service.ProductService;
import com.neoshop.service.UserService;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for this pure unit test
class AdminControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private OrderService orderService;

  @MockBean
  private ProductService productService;

  @MockBean
  private UserService userService;

  @MockBean
  private ProductKeyService productKeyService;

  @MockBean
  private CategoryService categoryService;

  @Test
  void testGetAllOrders() throws Exception {
    OrderResponse response = new OrderResponse();
    response.setId(java.util.UUID.randomUUID());
    Page<OrderResponse> page = new PageImpl<>(Collections.singletonList(response));

    when(orderService.getAllOrdersManaged(any(), any(), any(), any(), any(Pageable.class))).thenReturn(page);

    mockMvc
        .perform(
            get("/api/admin/orders")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()", is(1)));
  }

  @Test
  void testGetAllProducts() throws Exception {
    ProductResponse response = new ProductResponse();
    response.setId(java.util.UUID.randomUUID());
    Page<ProductResponse> page = new PageImpl<>(Collections.singletonList(response));

    when(productService.getAllProductsAdmin(any(), any(), any(), any(Pageable.class))).thenReturn(page);

    mockMvc
        .perform(
            get("/api/admin/products")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()", is(1)));
  }

  @Test
  void testGetAllUsers() throws Exception {
    UserResponse response = new UserResponse();
    response.setId(java.util.UUID.randomUUID());
    Page<UserResponse> page = new PageImpl<>(Collections.singletonList(response));

    when(userService.getAllUsers(any(Pageable.class))).thenReturn(page);

    mockMvc
        .perform(
            get("/api/admin/users")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()", is(1)));
  }
}
