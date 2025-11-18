import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent {
  otp = "";
  username = "";
  message = "";

  constructor(private router: Router, private auth: AuthService) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.username = state?.['username'];
  }

  verifyOtp() {
    this.auth.verifyOtp(this.username, this.otp).subscribe({
      next: (res:any) => {
        localStorage.setItem('auth_token', res.AuthToken);
        localStorage.setItem('role', res.Role);
        this.router.navigate(['/']);
      },
      error: (err:any) => {
        this.message = err.error?.message || "Invalid OTP";
      }
    });
  }
}
