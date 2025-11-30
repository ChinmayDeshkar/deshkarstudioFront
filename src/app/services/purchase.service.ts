import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private readonly tokenKey = 'auth_token';
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
    return this.http.get(
      `${environment.apiUrl}/customers/check?phoneNumber=${phoneNumber}`,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getTodayPurchases(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/purchases/today`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getMonthlyPurchases(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/purchases/month`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getPurchasesByRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/purchases/range`, {
      params: { startDate, endDate },
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  updatePurchase(id: number, data: any): Observable<any> {
    data.updatedBy = localStorage.getItem('username');
    return this.http.put<any>(
      `${environment.apiUrl}/purchases/update/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getPurchaseById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/purchases/${id}`, {
      headers: this.getHeaders(),
    });
  }

  addPurchase(body: any) {
    return this.http.post(`${environment.apiUrl}/purchases/add`, body, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getAllProducts() {
    return this.http.get<any[]>(`${environment.apiUrl}/products/all`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getNotesByPurchaseId(purchaseId: number) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/purchases/notes/${purchaseId}`,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  }

  getPurchasesByPhone(phone: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/purchases/phone-number/${phone}`,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  }

  generateInvoice(purchase: any) {
    this.http
      .post(
        `${environment.apiUrl}/invoice/generate/${purchase.purchaseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${this.getToken()}` },
        }
      )
      .subscribe(() => alert('Invoice Generated'));
  }

  downloadInvoice(purchaseId: number) {
    return this.http
      .get(`${environment.apiUrl}/invoice/download/${purchaseId}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
        responseType: 'blob',
      });
  }

  // Validate phone (must be 10 digits)
  validatePhone(phone: string): string | null {
    if (!phone) {
      return 'Phone number is required';
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      return 'Phone number must be exactly 10 digits';
    }

    return null; // valid
  }

  // Validate email (optional)
  validateEmail(email: string): string | null {
    if (!email || email.trim() === '') {
      return null; // email is OPTIONAL
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return 'Enter a valid email address';
    }

    return null; // valid
  }
}
