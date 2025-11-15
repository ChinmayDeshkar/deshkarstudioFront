import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private readonly tokenKey = 'auth_token'
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // make sure token key matches your login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
  
  /** ✅ Check if customer exists by phone */
  checkCustomer(phoneNumber: string): Observable<any> {
    console.log('Headers:', `Bearer ${this.getToken()}`);
    console.log('Sending to backend:', {
      url: `${environment.apiUrl}/customers/check?phoneNumber=${phoneNumber}`,
      headers: this.getHeaders(),
    });
    return this.http.get(`${environment.apiUrl}/customers/check?phoneNumber=${phoneNumber}`, {
      headers: { Authorization: `Bearer ${this.getToken()}`},
    });
  }
  getToken() { return localStorage.getItem(this.tokenKey); }

  /** ✅ Add purchase for a customer */
  addPurchase(payload: any): Observable<any> {
    console.log("Payload: " + payload.toString());
    
    return this.http.post(`${environment.apiUrl}/purchases/add`, payload, {
      headers: { Authorization: `Bearer ${this.getToken()}`},
    });
  }

  getTodayPurchases(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/purchases/today`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  getMonthlyPurchases(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/purchases/month`,{
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

 getPurchasesByRange(startDate: string, endDate: string): Observable<any> {
  return this.http.get(`${environment.apiUrl}/purchases/range`, {
    params: { startDate, endDate },
    headers: { Authorization: `Bearer ${this.getToken()}` }
  });
}

updatePurchase(id: number, data: any): Observable<any> {
  data.updatedBy = localStorage.getItem('username');
    return this.http.put<any>(`${environment.apiUrl}/purchases/update/${id}`, data, { headers: this.getHeaders() });
  }

   getPurchaseById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/purchases/${id}`,
      { headers: this.getHeaders() }
    );
  }

//   updatePurchase(purchase: any) {
//     return this.http.put(`${environment.apiUrl}/update/${purchase.purchaseId}`, purchase);
//   }
//   updatePurchase(id: number, data: any) {
//   return this.http.put(`${this.baseUrl}/update/${id}`, data);
// }

}
