import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getToken() { return localStorage.getItem('auth_token'); }

  getAllProducts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/all`,{
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/products/add`, product,
      { headers: { Authorization: `Bearer ${this.getToken()}` }
    }
    );
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/products/update/${product.productId}`, product,{
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/products/delete/${productId}`,{
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }
}
