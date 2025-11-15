import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {

    const expectedRoles: string[] = route.data['roles'];
    const role = this.auth.getRole(); // e.g. ROLE_ADMIN
    if (!expectedRoles || !role || !expectedRoles.includes(role)) {
      this.router.navigate(['/restricted']);
      return false;
    }
    return true;
  }
}
