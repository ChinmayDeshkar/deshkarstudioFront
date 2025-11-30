import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  loading: boolean = false;

  user = {
    username: '',
    password: '',
    email: '',
    phone: '',
    salary: '',
  };
  username = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true; // SHOW LOADER

    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {

        this.loading = false; // HIDE LOADER
        // FIRST LOGIN CASE (your existing logic)
        if (res.Message?.includes('First Login detected')) {
          this.router.navigate(['/reset'], {
            state: { username: this.username, oldPassword: this.password },
          });
          return;
        }

        // 2FA CASE
        if (res.otpSent) {
          // alert("OTP is: " + res.otp);
          this.router.navigate(['/verify-otp'], {
            state: { username: this.username },
          });
          return;
        }
      },
      error: (err) => (this.message = err.error?.Message || 'Login failed'),
    });
  }
}
