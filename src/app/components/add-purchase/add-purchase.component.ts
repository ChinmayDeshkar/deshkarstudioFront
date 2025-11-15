import { Component } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent {
  phoneNumber = '';
  customerExists = false;
  loading = false;
  message = '';

  // Customer details
  customer = {
    id: 0,
    customerName: '',
    phoneNumber: '',
    email: '',
    address: ''
  }
  payload = {
    customer:this.customer,
    price: 0,
    advancePaid: 0,
    paymentMethod: '',
    paymentStatus: 'PAID',
    remarks: '',
    updatedBy: ''    
  }

  // Purchase details
  price = 0;
  paymentMethod = '';
  paymentStatus = 'PAID';
  advance = 0;
  remarks = '';

  username = localStorage.getItem('username') || '';
  customerId: number | null = null;


  constructor(private purchaseService: PurchaseService, private authService: AuthService) {}

  oninit() {
    this.getUserName();
  }
  checkCustomer() {
    if (!this.customer.phoneNumber) {
      this.message = '⚠️ Please enter a phone number.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.purchaseService.checkCustomer(this.customer.phoneNumber).subscribe({
      next: (res) => {
        if (res.exists === true) {
          this.customerExists = true;
          this.customer.id = res.id;
          this.customer.customerName = res.customerName;
          this.customer.email = res.email;
          this.customer.address = res.address;
          this.message = '✅ Existing customer found! Details are locked.';
        } else {
          this.customerExists = false;
          this.customer.customerName = '';
          this.customer.email = '';
          this.customer.address = '';
          this.message = '🆕 New customer — please fill details.';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.customerExists = false;
        this.message = '❌ Error checking customer.';
      },
    });
  }

  /** 💾 Submit purchase */
  submit() {  
    if (!this.customer.phoneNumber || !this.payload.price || !this.payload.paymentMethod) {
      this.message = '⚠️ Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.payload.updatedBy = this.username;
    
    this.purchaseService.addPurchase(this.payload).subscribe({
      next: () => {
        this.message = '✅ Purchase added successfully!';
        this.resetForm();
        this.loading = false;
      },
      error: () => {
        this.message = '❌ Error adding purchase.';
        this.loading = false;
      },
    });
  }

  /** 🧹 Reset form fields */
  resetForm() {
    this.customer = {
      id: 0,
      customerName: '',
      phoneNumber: '',
      email: '',
      address: ''
    }
    this.payload = {
      customer:this.customer,
      price: 0,
      advancePaid: 0,
      paymentMethod: '',
      paymentStatus: 'PAID',
      remarks: '',
      updatedBy: ''    
    }
  }

  getUserName() {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        this.username = data.username;
      },
      error: () => {
        this.message = 'Failed to load profile';
      }
    });
  }
}
