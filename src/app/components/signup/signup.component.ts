import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = { username: '', password: '', email: '', phone: '', role: 'USER' };
  message = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignup() {
    this.auth.signup(this.user).subscribe({
      next: () => {
        this.message = 'Signup successful! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error = err.error?.message || 'Signup failed. Try again.';
      }
    });
  }
}
