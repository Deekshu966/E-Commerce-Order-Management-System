package com.ecommerce.order.entity;

import com.ecommerce.order.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;
    
    private String transactionId;
    private String paymentMethod;
    private String cardLastFour;
    
    @Column(nullable = false)
    private LocalDateTime paymentDate;
    
    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
        if (status == null) {
            status = PaymentStatus.PENDING;
        }
    }
}