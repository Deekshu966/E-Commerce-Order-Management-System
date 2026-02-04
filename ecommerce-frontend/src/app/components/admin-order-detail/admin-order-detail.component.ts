import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-order-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-order-detail.component.html',
  styleUrl: './admin-order-detail.component.css'
})
export class AdminOrderDetailComponent implements OnInit {
  order: any = null;
  isLoading = true;
  error = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(+orderId);
    }
  }

  loadOrder(orderId: number): void {
    this.isLoading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateStatus(newStatus: string): void {
    if (!this.order) return;
    
    this.successMessage = '';
    this.error = '';
    
    this.adminService.updateOrderStatus(this.order.orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        this.order.status = updatedOrder.status;
        this.order.shippedDate = updatedOrder.shippedDate;
        this.order.deliveredDate = updatedOrder.deliveredDate;
        this.successMessage = `Order status updated to ${newStatus}`;
      },
      error: (err) => {
        this.error = 'Failed to update order status';
        console.error(err);
      }
    });
  }

  getNextStatus(): string | null {
    if (!this.order) return null;
    switch (this.order.status) {
      case 'PLACED': return 'PROCESSING';
      case 'PROCESSING': return 'SHIPPED';
      case 'SHIPPED': return 'DELIVERED';
      default: return null;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLACED': return 'status-placed';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatShippingAddress(address: any): string {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    const parts = [
      address.firstName && address.lastName ? `${address.firstName} ${address.lastName}` : '',
      address.address,
      address.city,
      address.state,
      address.zipCode
    ];
    return parts.filter(Boolean).join(', ') || 'No address provided';
  }
}
