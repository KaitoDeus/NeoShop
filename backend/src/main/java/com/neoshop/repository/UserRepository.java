package com.neoshop.repository;

import com.neoshop.model.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUsername(String username);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE " +
      "(:query IS NULL OR :query = '' OR " +
      "LOWER(u.username) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR " +
      "LOWER(u.email) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR " +
      "LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR " +
      "LOWER(u.phoneNumber) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))")
  org.springframework.data.domain.Page<User> searchUsers(
      @org.springframework.data.repository.query.Param("query") String query,
      org.springframework.data.domain.Pageable pageable);
}
