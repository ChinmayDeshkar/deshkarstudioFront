import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})
export class PurchaseDetailsComponent implements OnInit {
  purchase: any;
  
  amountError: string = '';
  paymentError: string = '';

  notes: any[] = [];
  purchaseId: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private router: Router
  ) {}

  
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.purchaseService.getPurchaseById(+id).subscribe({
          next: (data) => {
            this.purchase = data;
            if (this.purchase?.purchaseId) {
              this.loadNotes();
            } else {
              console.error("purchaseId missing in API response:", this.purchase);
            }
          },
          error: (err) => console.error('Error fetching purchase:', err),
        });
      }
      // this.loadNotes();
    }

  loadNotes() {
    console.log("Loading notes!!!");
    
  if (!this.purchase?.purchaseId) {
   console.log("Null");
   
    return;
  }

  this.purchaseService.getNotesByPurchaseId(this.purchase?.purchaseId).subscribe({
    next: (res) => {
      this.notes = res,
      console.log("Notes loaded: ", this.notes);
    },
    error: () => this.notes = []
  });
}

  calculateBalance() {
    if (!this.purchase) return;

    const price = this.purchase.price || 0;
    const paid = this.purchase.advancePaid || 0;

    if (paid > price) {
      this.amountError = "Amount paid cannot be more than total price!";
      this.purchase.balance = 0; 
    } else {
      this.amountError = "";
      this.purchase.balance = price - paid;
    }
  }

  updatePurchase() {
    console.log("Update: " + this.purchase);
    
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

  validatePaymentStatus() {
    if (!this.purchase) return;

    const balance = this.purchase.balance || 0;
    const status = this.purchase.paymentStatus;

    if (status === 'PAID' && balance > 0) {
      this.paymentError = "Payment status cannot be PAID when balance is pending!";
    } 
    else if (status === 'PENDING' && balance === 0) {
      this.paymentError = "Payment status cannot be PENDING when balance is zero!";
    } 
    else {
      this.paymentError = "";
    }
  }

}