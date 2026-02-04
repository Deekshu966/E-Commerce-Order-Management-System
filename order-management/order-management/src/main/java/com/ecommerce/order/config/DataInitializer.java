package com.ecommerce.order.config;

import com.ecommerce.order.entity.Product;
import com.ecommerce.order.entity.User;
import com.ecommerce.order.repository.ProductRepository;
import com.ecommerce.order.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    @Override
    public void run(String... args) {
        // Ensure admin user exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .password("admin123")
                    .email("admin@example.com")
                    .firstName("Admin")
                    .lastName("User")
                    .phone("000-000-0000")
                    .address("Admin Office")
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: admin / admin123");
        }
        
        // Update existing users without role to have USER role
        userRepository.findAll().forEach(user -> {
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
                userRepository.save(user);
                System.out.println("Updated role for user: " + user.getUsername());
            }
        });
        
        // Create sample users if none exist (except admin)
        if (userRepository.count() <= 1) {
            User user1 = User.builder()
                    .username("john_doe")
                    .password("password123")
                    .email("john@example.com")
                    .firstName("John")
                    .lastName("Doe")
                    .phone("123-456-7890")
                    .address("123 Main St, New York, NY 10001")
                    .role("USER")
                    .build();
            
            User user2 = User.builder()
                    .username("jane_smith")
                    .password("password123")
                    .email("jane@example.com")
                    .firstName("Jane")
                    .lastName("Smith")
                    .phone("987-654-3210")
                    .address("456 Oak Ave, Los Angeles, CA 90001")
                    .role("USER")
                    .build();
            
            userRepository.saveAll(Arrays.asList(user1, user2));
        }
        
        // Create sample products
        if (productRepository.count() == 0) {
            Product[] products = {
                Product.builder()
                    .name("Wireless Bluetooth Headphones")
                    .price(new BigDecimal("79.99"))
                    .description("High-quality wireless headphones with noise cancellation")
                    .image("https://via.placeholder.com/300x300?text=Headphones")
                    .stock(50)
                    .build(),
                Product.builder()
                    .name("Smart Watch Pro")
                    .price(new BigDecimal("199.99"))
                    .description("Advanced smartwatch with health monitoring features")
                    .image("https://via.placeholder.com/300x300?text=Smart+Watch")
                    .stock(30)
                    .build(),
                Product.builder()
                    .name("Laptop Stand")
                    .price(new BigDecimal("45.99"))
                    .description("Ergonomic aluminum laptop stand for better posture")
                    .image("https://via.placeholder.com/300x300?text=Laptop+Stand")
                    .stock(100)
                    .build(),
                Product.builder()
                    .name("Mechanical Keyboard")
                    .price(new BigDecimal("129.99"))
                    .description("RGB mechanical keyboard with Cherry MX switches")
                    .image("https://via.placeholder.com/300x300?text=Keyboard")
                    .stock(25)
                    .build(),
                Product.builder()
                    .name("Wireless Mouse")
                    .price(new BigDecimal("39.99"))
                    .description("Ergonomic wireless mouse with precision tracking")
                    .image("https://via.placeholder.com/300x300?text=Mouse")
                    .stock(75)
                    .build(),
                Product.builder()
                    .name("USB-C Hub")
                    .price(new BigDecimal("59.99"))
                    .description("7-in-1 USB-C hub with HDMI and SD card reader")
                    .image("https://via.placeholder.com/300x300?text=USB+Hub")
                    .stock(40)
                    .build()
            };
            
            productRepository.saveAll(Arrays.asList(products));
        }
        
        System.out.println("Sample data initialized successfully!");
    }
}