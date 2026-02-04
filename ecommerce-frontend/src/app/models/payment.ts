export interface PaymentRequest {
  orderId: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  status: PaymentStatus;
  transactionId: string;
  amount: number;
  paymentDate: Date;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
