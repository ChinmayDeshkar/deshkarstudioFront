import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  otpSent = false;
  otp = '';

  signupForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    role: ['USER']
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  requestOtp() {
    if (this.signupForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.auth.signupRequest(this.signupForm.value).subscribe({
      next: () => {
        this.otpSent = true;
        alert('OTP sent to your phone.');
      },
      error: err => {
        alert(err.error?.error || 'Failed to send OTP');
      }
    });
  }

  verifyOtp() {
    const phone = this.signupForm.value.phone!;
    this.auth.signupVerify(phone, this.otp).subscribe({
      next: () => {
        alert('Signup successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: err => {
        alert(err.error?.error || 'OTP verification failed');
      }
    });
  }
}
