import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  phone = '';
  purchases: any[] = [];
  loading = false;
  isAdmin = false;
  customerName = '';
  searchMode: 'phone' | 'name' = 'phone'; // default mode

  constructor(
    private purchaseService: PurchaseService,
    private auth: AuthService,
    private router: Router
  ) {
    this.auth.role$.subscribe((role) => {
      this.isAdmin = role === 'ADMIN';
    });
  }

  searchByPhone() {
    if (!this.phone) return;
    this.loading = true;

    this.purchaseService.getPurchasesByPhone(this.phone).subscribe({
      next: (res) => {
        this.purchases = res.sort(
            (a: any, b: any) =>
              new Date(b.dte_created).getTime() -
              new Date(a.dte_created).getTime()
          );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  searchByName() {
    if (!this.customerName) return;
    this.loading = true;
    this.purchaseService.getPurchasesByName(this.customerName).subscribe({
      next: (res) => {
        this.purchases = res.sort(
            (a: any, b: any) =>
              new Date(b.dte_created).getTime() -
              new Date(a.dte_created).getTime()
          );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  openPurchaseDetails(id: number) {
    this.router.navigate(['/purchase-details', id]);
  }
}
