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

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface CreateOrderRequest {
  userId: number;
  shippingAddress: ShippingAddress;
  items: {
    productId: number;
    quantity: number;
  }[];
}
