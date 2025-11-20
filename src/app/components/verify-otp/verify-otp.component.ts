import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent implements OnInit {

  username = "";
  email: string = "des*********@gmail.com"; // you can pass this dynamically
  maskedEmail: string = "";

  otp: string = "";
  message: string = "";

  timer: number = 30;
  interval: any;

  ngOnInit(): void {
    this.maskEmail();
    this.startTimer();
  }

  constructor(private router: Router, private auth: AuthService) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.username = state?.['username'];
  }

  // Mask email for display
  maskEmail() {
    this.maskedEmail = this.email;
  }

  // Start countdown timer
  startTimer() {
    this.timer = 30;
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  // Verify OTP
  verifyOtp() {
    this.auth.verifyOtp(this.username, this.otp).subscribe({
      next: (res:any) => {
        this.auth.setLoginData(
          res.AuthToken,
          res.Role,
          res.Username
        );
        this.router.navigate(['/']);
      },
      error: (err:any) => {
        this.message = err.error?.message || "Invalid OTP";
      }
    });
  }

  // Resend OTP
  resendOtp() {
    this.message = "";
    console.log("Resending OTP...");
    this.startTimer();

    // You can also show a toast if needed
  }
}
