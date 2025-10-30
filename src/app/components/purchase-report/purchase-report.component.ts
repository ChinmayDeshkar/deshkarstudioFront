import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  purchases: any[] = [];
  loading = false;
  startDate: string = '';
  endDate: string = '';
  selectedFilter: string = 'today';

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadTodayPurchases();
  }

  loadTodayPurchases() {
    this.loading = true;
    this.purchaseService.getTodayPurchases().subscribe({
      next: (data) => {
        this.purchases = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadMonthlyPurchases() {
    this.loading = true;
    this.purchaseService.getMonthlyPurchases().subscribe({
      next: (data) => {
        this.purchases = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadRangePurchases() {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates');
      return;
    }
    this.loading = true;
    this.purchaseService.getPurchasesByRange(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.purchases = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'today') this.loadTodayPurchases();
    else if (filter === 'month') this.loadMonthlyPurchases();
  }
}
