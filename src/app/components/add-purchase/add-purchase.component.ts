import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from 'src/app/services/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {

  loading = false;
  message = '';
  customerExists = false;

  products: any[] = [];
  total = 0;
  username = '';

  customer = {
    id: 0,
    customerName: '',
    phoneNumber: '',
    email: '',
    address: ''
  };

  payload: any = {
    customer: this.customer,
    items: [],
    price: 0,
    advancePaid: 0,
    balance: 0,
    paymentMethod: '',
    paymentStatus: 'PENDING',
    remarks: '',
    updatedBy: localStorage.getItem('username')
  };

  constructor(
    private purchaseService: PurchaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserName();
    this.loadProducts();
    this.addItem();
  }

  getUserName(): void {
    this.authService.getProfile().subscribe({
      next: (data: any) => this.username = data.username,
      error: () => this.message = 'Failed to load profile'
    });
  }

  loadProducts(): void {
    this.purchaseService.getAllProducts().subscribe(res => {
      this.products = res;
    });
  }

  checkCustomer(): void {
    if (!this.customer.phoneNumber) {
      this.message = 'Enter phone number';
      return;
    }
    this.loading = true;
    this.purchaseService.checkCustomer(this.customer.phoneNumber).subscribe({
      next: (res: any) => {
        if (res.exists) {
          this.customerExists = true;
          this.customer = res;
          this.payload.customer = this.customer;
          this.message = "Existing customer found";
        } else {
          this.customerExists = false;
          this.message = "New customer – enter details";
        }
        this.loading = false;
      },
      error: () => {
        this.message = "Error checking customer";
        this.loading = false;
      }
    });
  }

 addItem(): void {
  const newItem = {
    productId: null,
    productName: '',
    quantity: 1,
    price: 0
  };

  this.payload.items = [...this.payload.items, newItem];
}

    getEmptyItem() {
      return {
        productId: null,
        productName: '',
        quantity: 1,
        price: 0
      };
    }

  removeItem(index: number): void {
    this.payload.items.splice(index, 1);
    this.updateTotal();
  }

  onProductSelect(item: any): void {
    const selected = this.products.find(p => p.productId === item.productId);
    if (selected) {
      item.productName = selected.productName;
      item.price = selected.price;
    }
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.payload.items.reduce((sum: number, item: any) =>
      sum + (item.price || 0) * (item.quantity || 0), 0
    );
    this.payload.price = this.total;
    this.updateBalance();
  }

  updateBalance(): void {
    this.payload.balance = this.payload.price - (this.payload.advancePaid || 0);
  }

  submit(): void {
    this.payload.updatedBy = localStorage.getItem('username') ;
    this.purchaseService.addPurchase(this.payload).subscribe({
      next: () => {
        this.message = "Purchase added successfully!";
        alert(this.message);
        this.resetForm();
      },
      error: () => {
        this.message = "Error submitting purchase";
        alert(this.message);
      }
    });
  }

  resetForm(): void {
    this.customer = {
      id: 0,
      customerName: '',
      phoneNumber: '',
      email: '',
      address: ''
    };
    this.payload = {
      customer: this.customer,
      items: [],
      price: 0,
      advancePaid: 0,
      balance: 0,
      paymentMethod: '',
      paymentStatus: 'PENDING',
      remarks: '',
      updatedBy: ''
    };
    this.total = 0;
    this.addItem();
  }
  
}
