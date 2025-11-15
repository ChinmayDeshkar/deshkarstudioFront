import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = 
    {
      username: '',
      password: '',
      email: '',
      phone: '',
      salary: ''
    }
    username = '';
    password = '';
    message = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(){    
    this.auth.login(this.username, this.password).subscribe({
      next: (res:any) => {        
        if(res.AuthToken != undefined){          
          localStorage.setItem('auth_token', res.AuthToken);
          localStorage.setItem('role', res.Role);
          this.auth.loginSuccess(res.AuthToken, res.Role, res.Username);
          this.router.navigate(['/']);
        } else if(res.Message != undefined && res.Message.includes('First Login detected')){
          console.log("First Login...");
          
          // send user to reset page with username and oldPassword
          this.router.navigate(['/reset'], { state: { username: this.username, oldPassword: this.password } });
        }
      },
      error: (err) => this.message = err.error?.Message || 'Login failed'
    });
  }
}
