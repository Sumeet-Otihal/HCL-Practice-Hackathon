import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  getByUser(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/user/${userId}`);
  }

  add(dto: any): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, dto);
  }
}
