import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

export interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  placedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface AdminOrder {
  orderId: number;
  userId: number;
  username: string;
  status: string;
  totalAmount: number;
  taxAmount: number;
  orderDate: string;
  shippedDate: string | null;
  deliveredDate: string | null;
  shippingAddress: string;
  items?: AdminOrderItem[];
}

export interface AdminOrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Get dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  // Get all orders
  getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders`);
  }

  // Get orders by status
  getOrdersByStatus(status: string): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders/status/${status}`);
  }

  // Get single order details
  getOrderById(orderId: number): Observable<AdminOrder> {
    return this.http.get<AdminOrder>(`${this.apiUrl}/orders/${orderId}`);
  }

  // Update order status
  updateOrderStatus(orderId: number, status: string): Observable<AdminOrder> {
    return this.http.put<AdminOrder>(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
