import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = '';
  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    
      this.username = localStorage.getItem('username') || '';
      this.role = localStorage.getItem('role') || '';
    
  }
}
