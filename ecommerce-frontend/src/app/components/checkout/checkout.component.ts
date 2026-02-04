import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  cartItems: CartItem[] = [];
  shippingAddress = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  };
  sameAsBilling = true;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    // Pre-fill with user info
    const user = this.authService.getCurrentUser();
    if (user) {
      this.shippingAddress.firstName = user.firstName;
      this.shippingAddress.lastName = user.lastName;
      this.shippingAddress.email = user.email;
      this.shippingAddress.phone = user.phone;
      this.shippingAddress.address = user.address;
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

  validateForm(): boolean {
    if (!this.shippingAddress.firstName || !this.shippingAddress.lastName) {
      this.errorMessage = 'Please enter your full name';
      return false;
    }
    if (!this.shippingAddress.email) {
      this.errorMessage = 'Please enter your email';
      return false;
    }
    if (!this.shippingAddress.address) {
      this.errorMessage = 'Please enter your shipping address';
      return false;
    }
    if (!this.shippingAddress.city || !this.shippingAddress.state || !this.shippingAddress.zipCode) {
      this.errorMessage = 'Please complete your address details';
      return false;
    }
    return true;
  }

  proceedToPayment(): void {
    this.errorMessage = '';
    
    if (!this.validateForm()) {
      return;
    }

    // Store shipping info in session storage for payment page
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('shippingAddress', JSON.stringify(this.shippingAddress));
    }
    this.router.navigate(['/payment']);
  }
}
