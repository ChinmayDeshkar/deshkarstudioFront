import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  phone = '';
  otp = '';
  otpSent = false;

  constructor(private auth: AuthService, private router: Router) {}

  sendOtp() {
    if (!this.phone || this.phone.length !== 10) {
      alert('Enter a valid 10-digit phone number');
      return;
    }

    this.auth.loginRequest(this.phone).subscribe({
      next: () => {
        this.otpSent = true;
      },
      error: err => {
        alert(err.error?.error || 'Failed to send OTP');
      }
    });
  }

  verifyOtp() {
    this.auth.loginVerify(this.phone, this.otp).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        alert(err.error?.error || 'OTP verification failed');
      }
    });
  }
}
