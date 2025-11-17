import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';

declare var bootstrap: any;

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  purchases: any[] = [];
  loading = false;

  // Filters
  selectedFilter: string = 'today';
  startDate: string = '';
  endDate: string = '';

  // Roles
  isAdmin = false;
  isEmployee = false;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';
    this.isEmployee = localStorage.getItem('role') === 'ROLE_EMPLOYEE';

    this.loadTodayPurchases();
  }

  /** Convert backend date "dd-MM-yyyy HH:mm:ss" to JS date */
  formatDate(dateStr: string): Date {
    if (!dateStr) return new Date();

    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minutes, seconds] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minutes, seconds);
  }

  /** Convert all dates in list */
  normalizeDates(list: any[]) {
    return list.map(p => ({
      ...p,
      createdDate: this.formatDate(p.createdDate),
      updatedDate: this.formatDate(p.updatedDate)
    }));
  }

  /** Today API */
  loadTodayPurchases() {
    this.loading = true;
    this.purchaseService.getTodayPurchases().subscribe({
      next: (data) => {
        this.purchases = this.normalizeDates(data);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  /** Monthly API */
  loadMonthlyPurchases() {
    this.loading = true;
    this.purchaseService.getMonthlyPurchases().subscribe({
      next: (data) => {
        this.purchases = this.normalizeDates(data);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  /** Custom Range API */
  loadRangePurchases() {
    if (!this.startDate || !this.endDate) {
      alert('Please select start and end date');
      return;
    }

    this.loading = true;
    this.purchaseService.getPurchasesByRange(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.purchases = this.normalizeDates(data);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  /** Filter Change */
  onFilterChange(filter: string) {
    this.selectedFilter = filter;

    if (filter === 'today') this.loadTodayPurchases();
    else if (filter === 'month') this.loadMonthlyPurchases();
  }
}
