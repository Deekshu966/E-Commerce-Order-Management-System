package com.ecommerce.order.service;

import com.ecommerce.order.dto.OrderRequest;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    
    OrderResponse createOrder(OrderRequest orderRequest);
    
    OrderResponse getOrderById(Long orderId);
    
    List<OrderResponse> getOrdersByUserId(Long userId);
    
    List<OrderResponse> getAllOrders();
    
    OrderResponse updateOrderStatus(Long orderId, OrderStatus status);
    
    void cancelOrder(Long orderId);
}