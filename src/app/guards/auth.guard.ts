import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.auth.isLoggedIn().pipe(
      tap((isValid) => {
        console.log('AuthGuard - isLoggedIn:', isValid);
        
        if (!isValid) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
