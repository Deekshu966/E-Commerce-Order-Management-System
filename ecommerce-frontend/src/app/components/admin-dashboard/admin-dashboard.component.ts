import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, DashboardStats, AdminOrder } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentOrders: AdminOrder[] = [];
  isLoading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load stats
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics';
        console.error(err);
      }
    });

    // Load recent orders
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 10); // Show last 10 orders
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.isLoading = false;
        console.error(err);
      }
    });
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
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
