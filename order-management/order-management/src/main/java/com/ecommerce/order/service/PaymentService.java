package com.ecommerce.order.service;

import com.ecommerce.order.dto.PaymentRequest;
import com.ecommerce.order.dto.PaymentResponse;

public interface PaymentService {
    
    PaymentResponse processPayment(PaymentRequest paymentRequest);
    
    PaymentResponse getPaymentByOrderId(Long orderId);
    
    PaymentResponse refundPayment(Long paymentId);
}