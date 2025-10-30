import { Component } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'crmfront';
  constructor(private authService : AuthService, private router: Router) {}

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);

  }
}
