package com.ecommerce.order.repository;

import com.ecommerce.order.entity.Payment;
import com.ecommerce.order.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByOrderOrderId(Long orderId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    Optional<Payment> findByTransactionId(String transactionId);
}