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
    cardHolderName: '',
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
    // Only allow digits
    let value = event.target.value.replace(/\D/g, '');
    this.paymentInfo.cvv = value.substring(0, 4);
  }

  validatePayment(): boolean {
    const cleanCardNumber = this.paymentInfo.cardNumber.replace(/\s/g, '');
    
    // Only check that card number contains digits and has minimum length
    if (!cleanCardNumber || cleanCardNumber.length < 13) {
      this.errorMessage = 'Please enter a card number (minimum 13 digits)';
      return false;
    }

    // Check if card number contains only digits
    if (!/^\d+$/.test(cleanCardNumber)) {
      this.errorMessage = 'Card number must contain only numbers';
      return false;
    }

    if (!this.paymentInfo.cardHolderName || this.paymentInfo.cardHolderName.trim().length < 2) {
      this.errorMessage = 'Please enter the cardholder name';
      return false;
    }

    if (!this.paymentInfo.expiryDate || this.paymentInfo.expiryDate.length < 5) {
      this.errorMessage = 'Please enter expiry date (MM/YY)';
      return false;
    }

    // CVV must be 3-4 digits
    if (!this.paymentInfo.cvv || !/^\d{3,4}$/.test(this.paymentInfo.cvv)) {
      this.errorMessage = 'Please enter a valid CVV (3-4 digits)';
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
      shippingAddress: `${this.shippingAddress.address}, ${this.shippingAddress.city}, ${this.shippingAddress.state} ${this.shippingAddress.zipCode}`,
      items: this.cartItems.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.orderId = order.orderId;
        this.orderPlaced = true;
        this.isProcessing = false;
        this.cartService.clearCart();
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.removeItem('shippingAddress');
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to place order. Please try again.';
        this.isProcessing = false;
      }
    });
  }
}
