package com.ecommerce.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotBlank(message = "Card number is required")
    private String cardNumber;
    
    private String cardHolderName;  // Optional
    
    @NotBlank(message = "Expiry date is required")
    private String expiryDate;
    
    @NotBlank(message = "CVV is required")
    private String cvv;
}