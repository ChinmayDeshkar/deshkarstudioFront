import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  

  constructor(private http: HttpClient) { }

  // Update Order Status
  updateOrderStatus(purchaseId: number, updatedOrderStatus: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/purchases/update-order-status/${purchaseId}`, updatedOrderStatus, {
      headers: { 
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
       } // because backend expects String in requestBody
    });
  }

  // Update Payment Status
  updatePaymentStatus(purchaseId: number, updatedPaymentStatus: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/purchases/update-payment-status/${purchaseId}`, updatedPaymentStatus, {
      headers: { 
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
       }
    });
  }

  getRecentTasks() {
    return this.http.get<any[]>(`${environment.apiUrl}/purchases/recent-tasks`,
      {headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }}
    );
  }
}
