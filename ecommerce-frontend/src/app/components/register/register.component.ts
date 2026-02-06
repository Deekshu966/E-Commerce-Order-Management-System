import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formData: RegisterRequest = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  };
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  // Validation error messages
  fieldErrors: { [key: string]: string } = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  };

  // Track if fields have been touched
  touched: { [key: string]: boolean } = {
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Real-time validation on blur
  onFieldBlur(field: string): void {
    this.touched[field] = true;
    this.validateField(field);
  }

  validateField(field: string): void {
    switch (field) {
      case 'firstName':
        if (!this.formData.firstName) {
          this.fieldErrors['firstName'] = 'First name is required';
        } else if (this.formData.firstName.length < 2) {
          this.fieldErrors['firstName'] = 'First name must be at least 2 characters';
        } else {
          this.fieldErrors['firstName'] = '';
        }
        break;

      case 'lastName':
        if (!this.formData.lastName) {
          this.fieldErrors['lastName'] = 'Last name is required';
        } else if (this.formData.lastName.length < 2) {
          this.fieldErrors['lastName'] = 'Last name must be at least 2 characters';
        } else {
          this.fieldErrors['lastName'] = '';
        }
        break;

      case 'username':
        if (!this.formData.username) {
          this.fieldErrors['username'] = 'Username is required';
        } else if (this.formData.username.length < 3) {
          this.fieldErrors['username'] = 'Username must be at least 3 characters';
        } else if (this.formData.username.length > 50) {
          this.fieldErrors['username'] = 'Username must be less than 50 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(this.formData.username)) {
          this.fieldErrors['username'] = 'Username can only contain letters, numbers, and underscores';
        } else {
          this.fieldErrors['username'] = '';
        }
        break;

      case 'email':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!this.formData.email) {
          this.fieldErrors['email'] = 'Email is required';
        } else if (!emailPattern.test(this.formData.email)) {
          this.fieldErrors['email'] = 'Please enter a valid email address';
        } else {
          this.fieldErrors['email'] = '';
        }
        break;

      case 'password':
        if (!this.formData.password) {
          this.fieldErrors['password'] = 'Password is required';
        } else if (this.formData.password.length < 6) {
          this.fieldErrors['password'] = 'Password must be at least 6 characters';
        } else if (!/[A-Z]/.test(this.formData.password)) {
          this.fieldErrors['password'] = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(this.formData.password)) {
          this.fieldErrors['password'] = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.formData.password)) {
          this.fieldErrors['password'] = 'Password must contain at least one symbol (!@#$%^&* etc.)';
        } else {
          this.fieldErrors['password'] = '';
        }
        // Re-validate confirm password if it was touched
        if (this.touched['confirmPassword']) {
          this.validateField('confirmPassword');
        }
        break;

      case 'confirmPassword':
        if (!this.confirmPassword) {
          this.fieldErrors['confirmPassword'] = 'Please confirm your password';
        } else if (this.confirmPassword !== this.formData.password) {
          this.fieldErrors['confirmPassword'] = 'Passwords do not match';
        } else {
          this.fieldErrors['confirmPassword'] = '';
        }
        break;

      case 'phone':
        if (this.formData.phone) {
          const phonePattern = /^[0-9]{10}$/;
          if (!phonePattern.test(this.formData.phone.replace(/[-\s]/g, ''))) {
            this.fieldErrors['phone'] = 'Please enter a valid 10-digit phone number';
          } else {
            this.fieldErrors['phone'] = '';
          }
        } else {
          this.fieldErrors['phone'] = '';
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

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.authService.register(this.formData)
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
  }
}
