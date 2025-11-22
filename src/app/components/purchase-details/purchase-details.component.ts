import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css'],
})
export class PurchaseDetailsComponent implements OnInit {
  purchase: any;
  originalCustomer: any = {}; // for detecting changes
  
  jobActive = true;
  editMode = false;
  amountError: string = '';
  paymentError: string = '';
  products: any[] = [];

  notes: any[] = [];
  purchaseId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadProducts();
    this.loadPurchase(id);
  }

  // Load purchase details
  loadPurchase(id: string | null) {
    if (id) {
      this.purchaseService.getPurchaseById(+id).subscribe({
        next: (data) => {
          this.purchase = data;
          this.jobActive = this.purchase.orderStatus !== 'CANCELLED';
          // Store original customer for comparison
          this.originalCustomer = { ...data.customer };

          if (this.purchase?.purchaseId) {
            this.loadNotes();
          }
        },
        error: (err) => console.error('Error fetching purchase:', err),
      });
    }
  }

  // Load notes
  loadNotes() {
    if (!this.purchase?.purchaseId) return;

    this.purchaseService
      .getNotesByPurchaseId(this.purchase.purchaseId)
      .subscribe({
        next: (res) => (this.notes = res),
        error: () => (this.notes = []),
      });
  }

  // Calculate balance
  calculateBalance() {
    const price = this.purchase.price || 0;
    const paid = this.purchase.advancePaid || 0;

    if (paid > price) {
      this.amountError = 'Amount paid cannot be more than total price!';
      this.purchase.balance = 0;
    } else {
      this.amountError = '';
      this.purchase.balance = price - paid;
    }
  }

  // --- 🎯 CHECK IF CUSTOMER UPDATED ---
  isCustomerUpdated(): boolean {
    const c = this.purchase.customer;
    const o = this.originalCustomer;

    if (!c || !o) return false;

    return (
      c.name !== o.name ||
      c.phoneNumber !== o.phoneNumber ||
      c.email !== o.email ||
      c.address !== o.address
    );
  }

  // --- ✔ UPDATE PURCHASE ---
  updatePurchase() {
    if (!this.isFormValid()) return;

    const payload = {
      ...this.purchase,
      customerUpdated: this.isCustomerUpdated(), // <-- Correct check
    };

    // Payment validation
    if (
      (this.purchase.paymentStatus === 'PAID' && this.purchase.balance > 0) ||
      (this.purchase.paymentStatus !== 'PAID' && this.purchase.balance === 0)
    ) {
      alert('❌ Inconsistent payment status and balance!');
      return;
    }

    this.purchaseService
      .updatePurchase(this.purchase.purchaseId, payload)
      .subscribe({
        next: () => {
          console.log('UPDATED PAYLOAD: ', payload);
          alert('✅ Purchase updated successfully!');
          this.router.navigate(['/purchases']);
        },
        error: (err) => {
          console.error('Error updating purchase:', err);
          alert('❌ Error updating purchase!');
        },
      });
  }

  // Payment status validation
  validatePaymentStatus() {
    const balance = this.purchase.balance || 0;
    const status = this.purchase.paymentStatus;

    if (status === 'PAID' && balance > 0) {
      this.paymentError =
        'Payment status cannot be PAID when balance is pending!';
    } else if (status === 'PENDING' && balance === 0) {
      this.paymentError =
        'Payment status cannot be PENDING when balance is zero!';
    } else {
      this.paymentError = '';
    }
  }

  goBack() {
    this.location.back();
  }

  enableEdit() {
    this.editMode = true;
  }

  disableEdit() {
    this.editMode = false;
    this.loadPurchase(this.purchase.purchaseId); // reload original
  }

  // --- ✔ TOTAL RECALCULATION (WORKS FOR PRICE + QTY CHANGES) ---
  recalculateTotalPrice() {
    this.purchase.items.forEach((i: any) => {
      const price = Number(i.itemPrice || 0);
      const qty = Number(i.quantity || 0);
      i.total = price * qty;
    });

    this.purchase.price = this.purchase.items.reduce(
      (sum: number, i: any) => sum + (i.total || 0),
      0
    );

    this.calculateBalance();
  }

  onProductSelect(item: any) {
    const selected = this.products.find(
      (p) => p.productId === item.product.productId
    );

    if (selected) {
      item.product.productName = selected.productName;
      item.itemPrice = selected.price;
    }

    this.recalculateTotalPrice();
  }

  loadProducts(): void {
    this.purchaseService.getAllProducts().subscribe((res) => {
      this.products = res;
    });
  }

  addItem() {
    this.purchase.items.push({
      product: { productId: null },
      quantity: 1,
      itemPrice: 0,
      total: 0,
    });
    this.recalculateTotalPrice();
  }

  removeItem(index: number) {
    this.purchase.items.splice(index, 1);
    this.recalculateTotalPrice();
  }

  // ----------------------------
  // VALIDATION METHODS
  // ----------------------------

  // Email Validation
  isValidEmail(email: string): boolean {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Phone Validation (10 digits)
  isValidPhone(phone: string): boolean {
    return /^[0-9]{10}$/.test(phone || '');
  }

  // Check orderStatus + balance rule
  validateOrderStatus(): string | null {
    if (
      this.purchase.orderStatus === 'DELIVERED' ||
      this.purchase.orderStatus === 'COMPLETED'
    ) {
      if (this.purchase.balance > 0) {
        return 'Order cannot be marked as COMPLETED or DELIVERED while balance is pending!';
      }
    }
    return null;
  }

  // Final submit validation
  isFormValid(): boolean {
    if (!this.isValidEmail(this.purchase.customer.email)) {
      alert('❌ Invalid Email Format');
      return false;
    }

    if (!this.isValidPhone(this.purchase.customer.phoneNumber)) {
      alert('❌ Phone number must be exactly 10 digits');
      return false;
    }

    if (this.purchase.paymentStatus === 'PAID' && this.purchase.balance > 0) {
      alert('❌ Payment cannot be PAID while balance is pending!');
      return false;
    }

    if (
      this.purchase.paymentStatus === 'PENDING' &&
      this.purchase.balance === 0
    ) {
      alert('❌ Payment cannot be PENDING when balance is 0!');
      return false;
    }

    const orderError = this.validateOrderStatus();
    if (orderError) {
      alert('❌ ' + orderError);
      return false;
    }

    return true;
  }
}
