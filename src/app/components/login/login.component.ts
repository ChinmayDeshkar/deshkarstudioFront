import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.error = '';
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: res => {
        this.isLoading = false;
        if (res && res.accessToken) {
          // Redirect based on role (optional)
          const role = res.role || localStorage.getItem('auth_role');
          console.log('Logged in user role:', role);
          if (role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
          else if (role === 'ROLE_EMPLOYEE') this.router.navigate(['/employee']);
          else this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Login failed. Invalid credentials.';
        }
      },
      error: err => {
        this.isLoading = false;
        this.error = err.error?.message || 'Invalid username or password.';
      }
    });
  }

  otpSent = false;
phone = '';
otp = '';

sendOtp() {
  this.authService.requestOtp(this.phone).subscribe({
    next: (res) => { 
      this.otpSent = true;
      console.log('OTP sent response:', res);
    },
    error: err => {
      alert('Failed to send OTP');
      console.error('Error sending OTP:', err);
    }
  });
}

verifyOtp() {
  this.authService.verifyOtp(this.phone, this.otp).subscribe({
    next: res => {
      console.log('OTP verified response:', res);
      localStorage.setItem('token', res.token);
      this.router.navigate(['/employee']);
    },
    error: () => alert('Invalid OTP')
  });
}
}
