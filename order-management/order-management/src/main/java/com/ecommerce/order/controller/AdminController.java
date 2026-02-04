package com.ecommerce.order.controller;

import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.dto.UserDto;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.ShippingAddress;
import com.ecommerce.order.enums.OrderStatus;
import com.ecommerce.order.entity.User;
import com.ecommerce.order.exception.ResourceNotFoundException;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.repository.UserRepository;
import com.ecommerce.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class AdminController {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;
    
    // Get all orders (admin view)
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> response = orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    // Get orders by status
    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable String status) {
        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        List<Order> orders = orderRepository.findByStatus(orderStatus);
        List<OrderResponse> response = orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    // Get single order details
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
    
    // Update order status
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, newStatus));
    }
    
    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> response = users.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    // Get dashboard statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long placedOrders = orderRepository.countByStatus(OrderStatus.PLACED);
        long processingOrders = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long shippedOrders = orderRepository.countByStatus(OrderStatus.SHIPPED);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);
        
        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("placedOrders", placedOrders);
        stats.put("processingOrders", processingOrders);
        stats.put("shippedOrders", shippedOrders);
        stats.put("deliveredOrders", deliveredOrders);
        stats.put("cancelledOrders", cancelledOrders);
        
        return ResponseEntity.ok(stats);
    }
    
    private OrderResponse mapToOrderResponse(Order order) {
        String fullAddress = "";
        if (order.getShippingAddress() != null) {
            ShippingAddress sa = order.getShippingAddress();
            fullAddress = String.format("%s, %s, %s %s, %s",
                sa.getAddress() != null ? sa.getAddress() : "",
                sa.getCity() != null ? sa.getCity() : "",
                sa.getState() != null ? sa.getState() : "",
                sa.getZipCode() != null ? sa.getZipCode() : "",
                sa.getCountry() != null ? sa.getCountry() : "");
        }
        
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .customerName(order.getUser().getUsername())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .taxAmount(order.getTaxAmount())
                .orderDate(order.getOrderDate())
                .shippedDate(order.getShippedDate())
                .deliveredDate(order.getDeliveredDate())
                .build();
    }
    
    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole())
                .build();
    }
}
