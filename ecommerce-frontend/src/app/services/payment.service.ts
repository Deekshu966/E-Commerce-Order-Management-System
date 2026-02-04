import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest, PaymentResponse } from '../models/payment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  // Process payment
  processPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.apiUrl, paymentRequest);
  }

  // Get payment by order ID
  getPaymentByOrderId(orderId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/order/${orderId}`);
  }

  // Get payment by ID
  getPaymentById(paymentId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/${paymentId}`);
  }

  // Refund payment
  refundPayment(paymentId: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/${paymentId}/refund`, {});
  }

  // Validate card number - accepts any 13-19 digit number (mock validation)
  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    // Only check if it's all digits and has valid length
    return /^\d{13,19}$/.test(cleaned);
  }

  // Validate expiry date - accepts any valid format MM/YY (mock validation)
  validateExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/').map(s => parseInt(s, 10));
    if (!month || !year) return false;
    // Only check valid month range, accept any year
    if (month < 1 || month > 12) return false;
    return true;
  }

  // Validate CVV - accepts any 3-4 digit number
  validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }
}
