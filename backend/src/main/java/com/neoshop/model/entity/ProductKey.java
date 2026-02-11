package com.neoshop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "product_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductKey {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "key_code", nullable = false)
    private String keyCode;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private KeyStatus status = KeyStatus.AVAILABLE;

    @Column(name = "order_id")
    private UUID orderId;

    public enum KeyStatus {
        AVAILABLE, SOLD
    }
}
