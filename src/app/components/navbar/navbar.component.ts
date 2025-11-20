import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { log } from 'console';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userRole: string | null = null;
  username: string | null = null;

  currentRoute: string = '';
  
  constructor(private router: Router, private auth: AuthService) {
    this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.currentRoute = event.urlAfterRedirects;
    }
  });
  }

  ngOnInit(): void {
    this.auth.role$.subscribe(role => this.userRole = role);
    this.auth.username$.subscribe(username => this.username = username);
  }

  logout() {
    // localStorage.removeItem('auth_token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.userRole === 'ROLE_ADMIN';
  }

  isEmployee(): boolean {
    return this.userRole === 'ROLE_EMPLOYEE' || this.isAdmin();
  }
}
