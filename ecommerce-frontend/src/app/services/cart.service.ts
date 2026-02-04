import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'shopping_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private platformId = inject(PLATFORM_ID);
  
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadCartFromStorage(): void {
    if (!this.isBrowser()) return;
    const cartJson = localStorage.getItem(this.cartKey);
    if (cartJson) {
      const items = JSON.parse(cartJson);
      this.cartItemsSubject.next(items);
    }
  }

  private saveCartToStorage(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItemsSubject.value));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = [...this.cartItemsSubject.value];
    const existingItemIndex = currentItems.findIndex(
      item => item.product.productId === product.productId
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex] = {
        ...currentItems[existingItemIndex],
        quantity: currentItems[existingItemIndex].quantity + quantity
      };
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value.map(item =>
      item.product.productId === productId
        ? { ...item, quantity }
        : item
    );

    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(
      item => item.product.productId !== productId
    );
    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    if (this.isBrowser()) {
      localStorage.removeItem(this.cartKey);
    }
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  isInCart(productId: number): boolean {
    return this.cartItemsSubject.value.some(
      item => item.product.productId === productId
    );
  }
}
