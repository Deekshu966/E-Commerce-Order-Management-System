import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderStatus, ShippingAddress } from '../../models/order';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  selectedOrder: Order | null = null;
  filterStatus: OrderStatus | 'ALL' = 'ALL';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderService.getOrdersByUserId(user.userId).subscribe({
        next: (orders) => {
          this.orders = orders.sort((a, b) => 
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  get filteredOrders(): Order[] {
    if (this.filterStatus === 'ALL') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.filterStatus);
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: (updatedOrder) => {
          const index = this.orders.findIndex(o => o.orderId === orderId);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
          }
          if (this.selectedOrder?.orderId === orderId) {
            this.selectedOrder = updatedOrder;
          }
        }
      });
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'PLACED': return 'status-placed';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusIcon(status: OrderStatus): string {
    switch (status) {
      case 'PLACED': return '📋';
      case 'PROCESSING': return '⚙️';
      case 'SHIPPED': return '🚚';
      case 'DELIVERED': return '✅';
      case 'CANCELLED': return '❌';
      default: return '📦';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatShippingAddress(address: ShippingAddress): string {
    if (!address) return 'N/A';
    const parts = [
      `${address.firstName} ${address.lastName}`,
      address.address,
      `${address.city}, ${address.state} ${address.zipCode}`
    ];
    return parts.filter(Boolean).join(', ');
  }
}
