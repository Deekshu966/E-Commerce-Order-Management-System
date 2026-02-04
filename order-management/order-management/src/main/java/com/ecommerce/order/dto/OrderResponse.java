package com.ecommerce.order.dto;

import com.ecommerce.order.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private String customerName;
    private OrderStatus status;
    private List<OrderItemResponse> items;
    private ShippingAddressDto shippingAddress;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private LocalDateTime orderDate;
    private LocalDateTime shippedDate;
    private LocalDateTime deliveredDate;
    private PaymentResponse payment;
}