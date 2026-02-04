package com.ecommerce.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotEmpty(message = "Order must have at least one item")
    @Valid
    private List<OrderItemRequest> items;
    
    @NotNull(message = "Shipping address is required")
    @Valid
    private ShippingAddressDto shippingAddress;
}