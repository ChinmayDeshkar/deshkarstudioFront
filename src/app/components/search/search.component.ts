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

  constructor(
    private purchaseService: PurchaseService,
    private auth: AuthService,
    private router: Router
  ) {
    this.auth.role$.subscribe((role) => {
      this.isAdmin = role === 'ADMIN';
    });
  }

  search() {
    if (!this.phone) return;
    this.loading = true;

    this.purchaseService.getPurchasesByPhone(this.phone).subscribe({
      next: (res) => {
        this.purchases = res;
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
