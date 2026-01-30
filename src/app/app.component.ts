import { Component } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'crmfront';
  showNavbar: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        console.log('Current URL:', url);

        // ✅ GUARANTEED CHECK
        this.showNavbar = !url.includes('feedback');
      }
    });
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
