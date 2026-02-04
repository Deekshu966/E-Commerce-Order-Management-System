package com.ecommerce.order.dto;

import com.ecommerce.order.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long paymentId;
    private Long orderId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String transactionId;
    private String paymentMethod;
    private String cardLastFour;
    private LocalDateTime paymentDate;
}