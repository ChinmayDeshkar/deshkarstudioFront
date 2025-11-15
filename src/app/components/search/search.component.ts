import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  customerForm: FormGroup;
  purchaseForm: FormGroup;
  customerResult: any[] = [];
  purchaseResult: any = null;
  purchaseSearched = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      customerId: ['', Validators.required]
    });

    this.purchaseForm = this.fb.group({
      purchaseId: ['', Validators.required]
    });
  }

  searchByCustomerId() {
    if (this.customerForm.invalid) return;
    this.loading = true;
    const id = this.customerForm.value.customerId;

    this.http.get<any[]>(`${environment.apiUrl}/purchases/cust-id/${id}`, {headers : this.getHeaders()}).subscribe({
      next: (res) => {
        this.customerResult = res;
        this.loading = false;
      },
      error: () => {
        this.customerResult = [];
        this.loading = false;
      }
    });
  }

  private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('auth_token'); // make sure token key matches your login
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
    }
    
  searchByPurchaseId() {
    if (this.purchaseForm.invalid) return;
    this.loading = true;
    this.purchaseSearched = true;
    const id = this.purchaseForm.value.purchaseId;

    this.http.get(`${environment.apiUrl}/purchases/cust-id/${id}`, {headers : this.getHeaders()}).subscribe({
      next: (res) => {
        this.purchaseResult = res;
        this.loading = false;
      },
      error: () => {
        this.purchaseResult = null;
        this.loading = false;
      }
    });
  }

  openPurchaseDetails(purchaseId: number) {
    this.router.navigate(['/purchase-details', purchaseId]);
  }
}
