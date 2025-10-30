import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  // private baseUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  checkCustomer(phone: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/customers/check?phoneNumber=${phone}`);
  }

  addPurchase(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/customers/purchase`, payload);
  }
}
