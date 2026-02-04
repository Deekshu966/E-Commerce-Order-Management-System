package com.ecommerce.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductDto {
    private Long productId;
    private String name;
    private BigDecimal price;
    private String description;
    private String image;
    private Integer stock;
}