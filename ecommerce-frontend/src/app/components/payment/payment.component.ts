import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  cartItems: CartItem[] = [];
  shippingAddress: any = null;
  
  paymentInfo = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };
  
  isProcessing = false;
  errorMessage = '';
  orderPlaced = false;
  orderId: number | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const storedAddress = sessionStorage.getItem('shippingAddress');
      if (!storedAddress) {
        this.router.navigate(['/checkout']);
        return;
      }
      this.shippingAddress = JSON.parse(storedAddress);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.08;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.substring(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    this.paymentInfo.cardNumber = formatted;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentInfo.expiryDate = value;
  }

  formatCVV(event: any): void {
    // Only allow digits, max 3
    let value = event.target.value.replace(/\D/g, '');
    this.paymentInfo.cvv = value.substring(0, 3);
  }

  validatePayment(): boolean {
    const cleanCardNumber = this.paymentInfo.cardNumber.replace(/\s/g, '');
    
    // Check if card number contains only digits (no alphabets)
    if (!/^\d+$/.test(cleanCardNumber)) {
      this.errorMessage = 'Card number must contain only numbers no alphabets and symbols';
      return false;
    }

    // Card number must be exactly 16 digits
    if (!cleanCardNumber || cleanCardNumber.length < 16) {
      this.errorMessage = 'Card number must be 16 digits';
      return false;
    }

    if (cleanCardNumber.length !== 16) {
      this.errorMessage = 'Card number must be exactly 16 digits';
      return false;
    }

    // Validate expiry date format
    if (!this.paymentInfo.expiryDate || this.paymentInfo.expiryDate.length < 5) {
      this.errorMessage = 'Please enter expiry date (MM/YY)';
      return false;
    }

    // Check expiry date format and validate future date
    const expiryParts = this.paymentInfo.expiryDate.split('/');
    if (expiryParts.length !== 2) {
      this.errorMessage = 'Invalid expiry date format. Use MM/YY';
      return false;
    }

    const month = parseInt(expiryParts[0], 10);
    const year = parseInt(expiryParts[1], 10);

    // Validate month is between 1-12
    if (isNaN(month) || month < 1 || month > 12) {
      this.errorMessage = 'Invalid expiry month. Must be between 01-12';
      return false;
    }

    // Validate year is numeric
    if (isNaN(year)) {
      this.errorMessage = 'Invalid expiry year';
      return false;
    }

    // Check if expiry date is in the future
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // 0-indexed

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      this.errorMessage = 'Card has expired. Please use a card with a future expiry date';
      return false;
    }

    // CVV must be exactly 3 digits only (no alphabets)
    if (!this.paymentInfo.cvv || !/^\d{3}$/.test(this.paymentInfo.cvv)) {
      this.errorMessage = 'CVV must be exactly 3 digits';
      return false;
    }

    return true;
  }

  placeOrder(): void {
    this.errorMessage = '';
    
    if (!this.validatePayment()) {
      return;
    }

    this.isProcessing = true;

    const user = this.authService.getCurrentUser();
    const orderRequest = {
      userId: user?.userId || 0,
      shippingAddress: {
        firstName: this.shippingAddress.firstName,
        lastName: this.shippingAddress.lastName,
        email: this.shippingAddress.email,
        phone: this.shippingAddress.phone || '',
        address: this.shippingAddress.address,
        city: this.shippingAddress.city,
        state: this.shippingAddress.state,
        zipCode: this.shippingAddress.zipCode,
        country: this.shippingAddress.country || 'India'
      },
      items: this.cartItems.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity
      }))
    };

    // Step 1: Create the order
    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.orderId = order.orderId;
        
        // Step 2: Process payment
        const paymentRequest = {
          orderId: order.orderId,
          cardNumber: this.paymentInfo.cardNumber.replace(/\s/g, ''),
          expiryDate: this.paymentInfo.expiryDate,
          cvv: this.paymentInfo.cvv
        };

        this.paymentService.processPayment(paymentRequest).subscribe({
          next: (paymentResponse) => {
            console.log('Payment successful:', paymentResponse);
            this.orderPlaced = true;
            this.isProcessing = false;
            this.cartService.clearCart();
            if (isPlatformBrowser(this.platformId)) {
              sessionStorage.removeItem('shippingAddress');
            }
          },
          error: (paymentError) => {
            console.error('Payment failed:', paymentError);
            this.errorMessage = paymentError.error?.message || 'Payment failed. Please try again.';
            this.isProcessing = false;
          }
        });
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        this.errorMessage = error.error?.message || 'Failed to place order. Please try again.';
        this.isProcessing = false;
      }
    });
  }
}
