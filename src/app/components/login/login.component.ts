import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
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
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        // FIRST LOGIN CASE (your existing logic)
        if (res.Message?.includes('First Login detected')) {
          this.router.navigate(['/reset'], {
            state: { username: this.username, oldPassword: this.password },
          });
          return;
        }

        // 2FA CASE
        if (res.otpSent) {
          this.router.navigate(['/verify-otp'], {
            state: { username: this.username },
          });
          return;
        }

        // NORMAL SUCCESS
        if (res.AuthToken) {
          localStorage.setItem('auth_token', res.AuthToken);
          localStorage.setItem('role', res.Role);
          this.auth.loginSuccess(res.AuthToken, res.Role, res.Username);
          this.router.navigate(['/']);
        }
      },
      error: (err) => (this.message = err.error?.Message || 'Login failed'),
    });
  }
}
