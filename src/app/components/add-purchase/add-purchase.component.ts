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
  customerName = '';
  email = '';
  address = '';

  // Purchase details
  price = 0;
  paymentMethod = '';
  paymentStatus = 'PAID';
  balance = 0;
  remarks = '';

  username = '';
  customerId: number | null = null;


  constructor(private purchaseService: PurchaseService, private authService: AuthService) {}

  oninit() {
    this.getUserName();
  }
  checkCustomer() {
    if (!this.phoneNumber) {
      this.message = '⚠️ Please enter a phone number.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.purchaseService.checkCustomer(this.phoneNumber).subscribe({
      next: (res) => {
        if (res.exists === true) {
          this.customerExists = true;
          this.customerId = res.id;
          this.customerName = res.customerName;
          this.email = res.email;
          this.address = res.address;
          this.message = '✅ Existing customer found! Details are locked.';
        } else {
          this.customerExists = false;
          this.customerName = '';
          this.email = '';
          this.address = '';
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
    if (!this.phoneNumber || !this.price || !this.paymentMethod) {
      this.message = '⚠️ Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.message = '';

    const payload = {
      customerName: this.customerName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      address: this.address,
      price: this.price,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      balance: this.balance,
      remarks: this.remarks,
      updatedBy: this.username,
    };

    this.purchaseService.addPurchase(payload).subscribe({
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
    this.phoneNumber = '';
    this.customerName = '';
    this.email = '';
    this.address = '';
    this.price = 0;
    this.paymentMethod = '';
    this.paymentStatus = 'PAID';
    this.balance = 0;
    this.remarks = '';
    this.customerExists = false;
    this.customerId = null;
  }

  getUserName() {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        console.log('User Data:', data);
        this.username = data.username;
      },
      error: () => {
        this.message = 'Failed to load profile';
      }
    });
  }
}
