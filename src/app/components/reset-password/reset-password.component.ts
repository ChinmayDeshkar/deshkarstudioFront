import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  username = history.state.username || '';
    oldPassword = history.state.oldPassword || '';
    newPassword = '';
    message = '';

    constructor(private auth: AuthService, private router: Router){}

      
    onReset(){
      this.auth.resetPassword(this.username, this.oldPassword, this.newPassword).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => this.message = err.error?.Message || 'Reset failed'
      });
    }
}
