import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = '';
  role: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
      this.username = localStorage.getItem('username') || '';
      this.role = localStorage.getItem('role') || '';
    
  }

  adminCards = [
  { title: 'Manage Employees', description: 'View, add or update employee records.', icon: 'bi bi-people-fill', route: '/admin', buttonText: 'Go' },
  { title: 'Purchases', description: 'Track and manage all purchase data.', icon: 'bi bi-cart-check', route: '/purchase-report', buttonText: 'View' },
  { title: 'Reports', description: 'View sales and performance metrics.', icon: 'bi bi-bar-chart-line', route: '/purchase-report', buttonText: 'Reports' },
  { title: 'Profile', description: 'View or edit your account details.', icon: 'bi bi-person-badge', route: '/profile', buttonText: 'Profile' }
];

employeeCards = [
  { title: 'Add Purchase', description: 'Create a new purchase entry.', icon: 'bi bi-cart-plus', route: '/add-purchase', buttonText: 'Add' },
  { title: 'Purchase Reports', description: 'Track your recent purchases.', icon: 'bi bi-bar-chart', route: '/purchase-report', buttonText: 'View' },
  { title: 'My Profile', description: 'Update your personal details.', icon: 'bi bi-person-circle', route: '/profile', buttonText: 'Profile' }
];

navigate(route: string) {
  this.router.navigate([route]);
}

}
