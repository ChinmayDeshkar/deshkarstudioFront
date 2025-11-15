import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})
export class PurchaseDetailsComponent implements OnInit {
  purchase: any;

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.purchaseService.getPurchaseById(+id).subscribe({
        next: (data) => (this.purchase = data),
        error: (err) => console.error('Error fetching purchase:', err),
      });
    }
  }

  calculateBalance() {
    if (this.purchase.price && this.purchase.advancePaid !== undefined) {
      this.purchase.balance = this.purchase.price - this.purchase.advancePaid;
    }
  }

  updatePurchase() {
  
    if((this.purchase.paymentStatus === 'PAID' && this.purchase.balance > 0) ||
       (this.purchase.paymentStatus != 'PAID' && this.purchase.balance == 0)) {
      alert('❌ Inconsistent payment status and balance!');
      return;
    }
    this.purchaseService.updatePurchase(this.purchase.purchaseId, this.purchase).subscribe({
      next: () => {
        alert('✅ Purchase updated successfully!');
        this.router.navigate(['/purchases']);
      },
      error: (err) => {
        console.error('Error updating purchase:', err);
        alert('❌ Error updating purchase!');
      },
    });
  }

  resetForm() {
    this.ngOnInit();
  }

  goBack() {
    this.router.navigate(['/purchases']);
  }
}