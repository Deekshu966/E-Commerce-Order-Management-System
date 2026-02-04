package com.ecommerce.order.service;

import com.ecommerce.order.dto.ProductDto;
import com.ecommerce.order.entity.Product;
import com.ecommerce.order.exception.ResourceNotFoundException;
import com.ecommerce.order.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        return mapToDto(product);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = mapToEntity(productDto);
        Product saved = productRepository.save(product);
        return mapToDto(saved);
    }
    
    @Override
    public ProductDto updateProduct(Long productId, ProductDto productDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        
        product.setName(productDto.getName());
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setImage(productDto.getImage());
        product.setStock(productDto.getStock());
        
        Product updated = productRepository.save(product);
        return mapToDto(updated);
    }
    
    @Override
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }
        productRepository.deleteById(productId);
    }
    
    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .image(product.getImage())
                .stock(product.getStock())
                .build();
    }
    
    private Product mapToEntity(ProductDto dto) {
        return Product.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .image(dto.getImage())
                .stock(dto.getStock())
                .build();
    }
}