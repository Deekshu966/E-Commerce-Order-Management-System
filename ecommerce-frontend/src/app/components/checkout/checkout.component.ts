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
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };
  errorMessage = '';

  // Validation error messages
  fieldErrors: { [key: string]: string } = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };

  // Track if fields have been touched
  touched: { [key: string]: boolean } = {
    firstName: false,
    lastName: false,
    email: false,
    address: false,
    city: false,
    state: false,
    zipCode: false
  };

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

  // Real-time validation on blur
  onFieldBlur(field: string): void {
    this.touched[field] = true;
    this.validateField(field);
  }

  validateField(field: string): void {
    switch (field) {
      case 'firstName':
        if (!this.shippingAddress.firstName) {
          this.fieldErrors['firstName'] = 'First name is required';
        } else if (this.shippingAddress.firstName.length < 2) {
          this.fieldErrors['firstName'] = 'First name must be at least 2 characters';
        } else {
          this.fieldErrors['firstName'] = '';
        }
        break;

      case 'lastName':
        if (!this.shippingAddress.lastName) {
          this.fieldErrors['lastName'] = 'Last name is required';
        } else if (this.shippingAddress.lastName.length < 2) {
          this.fieldErrors['lastName'] = 'Last name must be at least 2 characters';
        } else {
          this.fieldErrors['lastName'] = '';
        }
        break;

      case 'email':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!this.shippingAddress.email) {
          this.fieldErrors['email'] = 'Email is required';
        } else if (!emailPattern.test(this.shippingAddress.email)) {
          this.fieldErrors['email'] = 'Please enter a valid email address';
        } else {
          this.fieldErrors['email'] = '';
        }
        break;

      case 'address':
        if (!this.shippingAddress.address) {
          this.fieldErrors['address'] = 'Street address is required';
        } else if (this.shippingAddress.address.length < 5) {
          this.fieldErrors['address'] = 'Please enter a valid street address';
        } else {
          this.fieldErrors['address'] = '';
        }
        break;

      case 'city':
        if (!this.shippingAddress.city) {
          this.fieldErrors['city'] = 'City is required';
        } else if (this.shippingAddress.city.length < 2) {
          this.fieldErrors['city'] = 'Please enter a valid city name';
        } else {
          this.fieldErrors['city'] = '';
        }
        break;

      case 'state':
        if (!this.shippingAddress.state) {
          this.fieldErrors['state'] = 'State is required';
        } else if (this.shippingAddress.state.length < 2) {
          this.fieldErrors['state'] = 'Please enter a valid state';
        } else {
          this.fieldErrors['state'] = '';
        }
        break;

      case 'zipCode':
        const zipPattern = /^[0-9]{5,6}$/;
        if (!this.shippingAddress.zipCode) {
          this.fieldErrors['zipCode'] = 'ZIP code is required';
        } else if (!zipPattern.test(this.shippingAddress.zipCode)) {
          this.fieldErrors['zipCode'] = 'Please enter a valid 5-6 digit ZIP code';
        } else {
          this.fieldErrors['zipCode'] = '';
        }
        break;
    }
  }

  validateForm(): boolean {
    // Mark all fields as touched
    Object.keys(this.touched).forEach(key => {
      this.touched[key] = true;
      this.validateField(key);
    });

    // Check if there are any errors
    return !Object.values(this.fieldErrors).some(error => error !== '');
  }

  proceedToPayment(): void {
    this.errorMessage = '';
    
    if (!this.validateForm()) {
      this.errorMessage = 'Please fix the errors above before proceeding';
      return;
    }

    // Store shipping info in session storage for payment page
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('shippingAddress', JSON.stringify(this.shippingAddress));
    }
    this.router.navigate(['/payment']);
  }
}
