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

  validatePayment(): boolean {
    const cleanCardNumber = this.paymentInfo.cardNumber.replace(/\s/g, '');
    
    if (!cleanCardNumber || cleanCardNumber.length < 13) {
      this.errorMessage = 'Please enter a valid card number';
      return false;
    }

    if (!this.paymentService.validateCardNumber(cleanCardNumber)) {
      this.errorMessage = 'Invalid card number';
      return false;
    }

    if (!this.paymentInfo.cardHolderName) {
      this.errorMessage = 'Please enter the cardholder name';
      return false;
    }

    if (!this.paymentInfo.expiryDate) {
      this.errorMessage = 'Please enter the expiry date';
      return false;
    }

    if (!this.paymentService.validateExpiryDate(this.paymentInfo.expiryDate)) {
      this.errorMessage = 'Invalid or expired card';
      return false;
    }

    if (!this.paymentInfo.cvv || !this.paymentService.validateCVV(this.paymentInfo.cvv)) {
      this.errorMessage = 'Please enter a valid CVV';
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
