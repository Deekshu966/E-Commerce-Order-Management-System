package com.ecommerce.order.service;

import com.ecommerce.order.dto.PaymentRequest;
import com.ecommerce.order.dto.PaymentResponse;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.Payment;
import com.ecommerce.order.enums.OrderStatus;
import com.ecommerce.order.enums.PaymentStatus;
import com.ecommerce.order.exception.PaymentFailedException;
import com.ecommerce.order.exception.ResourceNotFoundException;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    
    @Override
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        // Find order
        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", paymentRequest.getOrderId()));
        
        // Check if payment already exists
        if (order.getPayment() != null && 
            order.getPayment().getStatus() == PaymentStatus.COMPLETED) {
            throw new PaymentFailedException("Payment already completed for this order");
        }
        
        // Validate card (basic validation - in real app, integrate with payment gateway)
        if (!validateCard(paymentRequest)) {
            throw new PaymentFailedException("Invalid card details");
        }
        
        // Create payment
        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.COMPLETED)
                .transactionId(generateTransactionId())
                .paymentMethod("CREDIT_CARD")
                .cardLastFour(getLastFourDigits(paymentRequest.getCardNumber()))
                .build();
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update order status to PROCESSING
        order.setPayment(savedPayment);
        order.setStatus(OrderStatus.PROCESSING);
        orderRepository.save(order);
        
        return mapToResponse(savedPayment);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for order", orderId));
        return mapToResponse(payment);
    }
    
    @Override
    public PaymentResponse refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", paymentId));
        
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new PaymentFailedException("Can only refund completed payments");
        }
        
        payment.setStatus(PaymentStatus.REFUNDED);
        Payment updatedPayment = paymentRepository.save(payment);
        
        // Cancel the order
        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        return mapToResponse(updatedPayment);
    }
    
    private boolean validateCard(PaymentRequest request) {
        String cardNumber = request.getCardNumber().replaceAll("\\s", "");
        
        // TEST MODE: Accept any card number with 13+ digits
        if (cardNumber.length() < 13 || cardNumber.length() > 19) {
            return false;
        }
        
        // Check if all characters are digits
        for (char c : cardNumber.toCharArray()) {
            if (!Character.isDigit(c)) {
                return false;
            }
        }
        
        // In test mode, accept all valid-looking card numbers
        return true;
    }
    
    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private String getLastFourDigits(String cardNumber) {
        String cleaned = cardNumber.replaceAll("\\s", "");
        return cleaned.substring(cleaned.length() - 4);
    }
    
    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrder().getOrderId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod())
                .cardLastFour(payment.getCardLastFour())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}