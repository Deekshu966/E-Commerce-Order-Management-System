package com.ecommerce.order.service;

import com.ecommerce.order.dto.*;
import com.ecommerce.order.entity.*;
import com.ecommerce.order.enums.OrderStatus;
import com.ecommerce.order.exception.InsufficientStockException;
import com.ecommerce.order.exception.ResourceNotFoundException;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.repository.ProductRepository;
import com.ecommerce.order.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    private static final BigDecimal TAX_RATE = new BigDecimal("0.08");
    
    @Override
    public OrderResponse createOrder(OrderRequest orderRequest) {
        // Find user
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", orderRequest.getUserId()));
        
        // Create order
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PLACED)
                .shippingAddress(mapToShippingAddress(orderRequest.getShippingAddress()))
                .build();
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Process order items
        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", itemRequest.getProductId()));
            
            // Check stock
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new InsufficientStockException(product.getName(), 
                        itemRequest.getQuantity(), product.getStock());
            }
            
            // Create order item
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            
            order.addOrderItem(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());
            
            // Update stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }
        
        // Calculate tax and total
        BigDecimal taxAmount = totalAmount.multiply(TAX_RATE);
        order.setTotalAmount(totalAmount.add(taxAmount));
        order.setTaxAmount(taxAmount);
        
        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }
    
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return mapToResponse(order);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        
        order.setStatus(status);
        
        if (status == OrderStatus.SHIPPED) {
            order.setShippedDate(LocalDateTime.now());
        } else if (status == OrderStatus.DELIVERED) {
            order.setDeliveredDate(LocalDateTime.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }
    
    @Override
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        
        if (order.getStatus() == OrderStatus.SHIPPED || 
            order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel shipped or delivered orders");
        }
        
        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
    
    private ShippingAddress mapToShippingAddress(ShippingAddressDto dto) {
        return ShippingAddress.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .zipCode(dto.getZipCode())
                .country(dto.getCountry())
                .build();
    }
    
    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());
        
        ShippingAddressDto addressDto = null;
        if (order.getShippingAddress() != null) {
            ShippingAddress addr = order.getShippingAddress();
            addressDto = new ShippingAddressDto();
            addressDto.setFirstName(addr.getFirstName());
            addressDto.setLastName(addr.getLastName());
            addressDto.setEmail(addr.getEmail());
            addressDto.setPhone(addr.getPhone());
            addressDto.setAddress(addr.getAddress());
            addressDto.setCity(addr.getCity());
            addressDto.setState(addr.getState());
            addressDto.setZipCode(addr.getZipCode());
            addressDto.setCountry(addr.getCountry());
        }
        
        PaymentResponse paymentResponse = null;
        if (order.getPayment() != null) {
            Payment payment = order.getPayment();
            paymentResponse = PaymentResponse.builder()
                    .paymentId(payment.getPaymentId())
                    .orderId(order.getOrderId())
                    .amount(payment.getAmount())
                    .status(payment.getStatus())
                    .transactionId(payment.getTransactionId())
                    .paymentMethod(payment.getPaymentMethod())
                    .cardLastFour(payment.getCardLastFour())
                    .paymentDate(payment.getPaymentDate())
                    .build();
        }
        
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .customerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .status(order.getStatus())
                .items(itemResponses)
                .shippingAddress(addressDto)
                .totalAmount(order.getTotalAmount())
                .taxAmount(order.getTaxAmount())
                .orderDate(order.getOrderDate())
                .shippedDate(order.getShippedDate())
                .deliveredDate(order.getDeliveredDate())
                .payment(paymentResponse)
                .build();
    }
    
    private OrderItemResponse mapToItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .orderItemId(item.getOrderItemId())
                .productId(item.getProduct().getProductId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImage())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }
}