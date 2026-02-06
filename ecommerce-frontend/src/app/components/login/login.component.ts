import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  // Validation error messages
  fieldErrors = {
    username: '',
    password: ''
  };

  // Track if fields have been touched
  touched = {
    username: false,
    password: false
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Real-time validation on blur
  onFieldBlur(field: 'username' | 'password'): void {
    this.touched[field] = true;
    this.validateField(field);
  }

  validateField(field: 'username' | 'password'): void {
    if (field === 'username') {
      if (!this.username) {
        this.fieldErrors.username = 'Username is required';
      } else if (this.username.length < 3) {
        this.fieldErrors.username = 'Username must be at least 3 characters';
      } else {
        this.fieldErrors.username = '';
      }
    }

    if (field === 'password') {
      if (!this.password) {
        this.fieldErrors.password = 'Password is required';
      } else if (this.password.length < 6) {
        this.fieldErrors.password = 'Password must be at least 6 characters';
      } else {
        this.fieldErrors.password = '';
      }
    }
  }

  validateForm(): boolean {
    this.touched.username = true;
    this.touched.password = true;
    
    this.validateField('username');
    this.validateField('password');

    return !this.fieldErrors.username && !this.fieldErrors.password;
  }

  onSubmit(): void {
    this.errorMessage = '';
    
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Login failed. Please try again.';
          this.isLoading = false;
        }
      });
  }
}
