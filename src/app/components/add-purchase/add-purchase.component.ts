import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from 'src/app/services/auth.service';

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
    address: '',
    purchaseCount: 0
  };

  payload: any = {
    customer: this.customer,
    items: [],
    price: 0,
    advancePaid: 0,
    balance: 0,
    paymentMethod: '',
    paymentStatus: '',
    remarks: '',
    updatedBy: localStorage.getItem('username')
  };

  amountError: string = '';

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
  const phone = this.customer.phoneNumber?.trim();

  if (!phone) {
    this.message = "Enter phone number";
    return;
  }

  // 🔍 Validate 10-digit number
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    this.message = "Enter a valid 10-digit mobile number";
    return;
  }

  this.loading = true;

  this.purchaseService.checkCustomer(phone).subscribe({
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


  // ---------------------------------------------------------
  // ✔ ADD NEW ITEM ROW
  // ---------------------------------------------------------
  addItem(): void {
    const newItem = {
      product: { productId: null, productName: '' },
      quantity: 1,
      itemPrice: 0
    };

    this.payload.items.push(newItem);
  }

  removeItem(index: number): void {
    this.payload.items.splice(index, 1);
    this.updateTotal();
  }

  // ---------------------------------------------------------
  // ✔ When product is selected
  // ---------------------------------------------------------
  onProductSelect(item: any): void {
    const selected = this.products.find(p => p.productId === item.product.productId);
    console.log(item);
    
    if (selected) {
      console.log("Selected: " +selected);
      
      item.product.productName = selected.productName;
      item.itemPrice = selected.price;
    }

    this.updateTotal();
  }

  // ---------------------------------------------------------
  // ✔ UPDATE TOTAL PRICE & BALANCE
  // ---------------------------------------------------------
  updateTotal(): void {
    this.total = this.payload.items.reduce(
      (sum: number, item: any) => sum + (item.itemPrice || 0) * (item.quantity || 0),
      0
    );

    this.payload.price = this.total;
    this.updateBalance();
  }

  updateBalance(): void {
    if (this.payload.advancePaid > this.payload.price) {
      this.amountError = "Amount paid cannot be more than total price!";
      this.payload.balance = 0; // keep balance safe
    } else {
      this.amountError = "";
      this.payload.balance = this.payload.price - (this.payload.advancePaid || 0);
      if (this.payload.balance === 0) {
        this.payload.paymentStatus = 'PAID';
      } else {
        this.payload.paymentStatus = 'PENDING';
      }
    }
  }

  // ---------------------------------------------------------
  // ✔ SUBMIT
  // ---------------------------------------------------------
  submit(): void {
    this.payload.updatedBy = localStorage.getItem('username');

    this.purchaseService.addPurchase(this.payload).subscribe({
      next: () => {
        console.log("FINAL PAYLOAD: ", this.payload);
        alert("Purchase added successfully!");
        this.resetForm();
      },
      error: () => {
        alert("Error submitting purchase");
      }
    });
  }

  resetForm(): void {
    this.customer = {
      id: 0,
      customerName: '',
      phoneNumber: '',
      email: '',
      address: '',
      purchaseCount: 0
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
