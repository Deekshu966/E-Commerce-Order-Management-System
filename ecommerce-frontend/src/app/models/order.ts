export interface Order {
  orderId: number;
  userId: number;
  orderDate: Date;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface CreateOrderRequest {
  userId: number;
  shippingAddress: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}
