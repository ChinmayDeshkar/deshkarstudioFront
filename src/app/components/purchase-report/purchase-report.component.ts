import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var bootstrap: any; 

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
  selectedPurchase: any = null;
  isAdmin: boolean = false;
  isEmployee: boolean = false;
  editData: any = {
    extraPaid: 0
  };

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadTodayPurchases();
    this.isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';
    this.isEmployee = localStorage.getItem('role') === 'ROLE_EMPLOYEE';
    console.log("Role is " + this.isEmployee);
    
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
        console.log(data);
        
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

  openEditModal(purchase: any) {
    this.selectedPurchase = purchase;
    this.editData = { ...purchase };
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }

  updatePurchase() {
    if (!this.selectedPurchase) return;

    this.purchaseService
      .updatePurchase(this.selectedPurchase.purchaseId, this.editData)
      .subscribe({
        next: (res) => {
          const index = this.purchases.findIndex(
            (p) => p.purchaseId === res.purchaseId
          );
          if (index > -1) this.purchases[index] = res;

          const modalInstance = bootstrap.Modal.getInstance(
            document.getElementById('editModal')
          );
          modalInstance?.hide();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating purchase:', err);
        }
      });
  }
}
