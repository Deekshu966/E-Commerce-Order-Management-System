import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminOrder } from '../../services/admin.service';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];
  isLoading = true;
  error = '';
  successMessage = '';
  
  selectedStatus = 'ALL';
  statuses = ['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = '';
    
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilter(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.selectedStatus);
    }
  }

  onStatusFilterChange(): void {
    this.applyFilter();
  }

  updateOrderStatus(order: AdminOrder, newStatus: string): void {
    this.successMessage = '';
    this.error = '';
    
    this.adminService.updateOrderStatus(order.orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        order.status = updatedOrder.status;
        order.shippedDate = updatedOrder.shippedDate;
        order.deliveredDate = updatedOrder.deliveredDate;
        this.successMessage = `Order #${order.orderId} status updated to ${newStatus}`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = `Failed to update order #${order.orderId}`;
        console.error(err);
      }
    });
  }

  getNextStatus(currentStatus: string): string | null {
    switch (currentStatus) {
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
