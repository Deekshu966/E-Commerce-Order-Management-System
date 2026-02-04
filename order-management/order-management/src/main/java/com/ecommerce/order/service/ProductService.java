package com.ecommerce.order.service;

import com.ecommerce.order.dto.ProductDto;

import java.util.List;

public interface ProductService {
    
    List<ProductDto> getAllProducts();
    
    ProductDto getProductById(Long productId);
    
    List<ProductDto> searchProducts(String keyword);
    
    ProductDto createProduct(ProductDto productDto);
    
    ProductDto updateProduct(Long productId, ProductDto productDto);
    
    void deleteProduct(Long productId);
}