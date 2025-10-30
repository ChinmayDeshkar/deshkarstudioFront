import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'auth_role';

  constructor(private http: HttpClient) {}

  // STEP 1: Send OTP for signup
  signupRequest(payload: any) {
    return this.http.post(`${environment.apiUrl}/auth/signup-request`, payload);
  }

  // STEP 2: Verify OTP & create user
  signupVerify(phone: string, otp: string) {
    return this.http.post(`${environment.apiUrl}/auth/signup-verify`, { phoneNumber: phone, otp });
  }

  // LOGIN OTP FLOW
  loginRequest(phone: string) {
    return this.http.post(`${environment.apiUrl}/auth/login-request`, { phoneNumber: phone });
  }

  loginVerify(phone: string, otp: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login-verify`, { phoneNumber: phone, otp })
      .pipe(map(res => {
        if (res?.accessToken) {
          localStorage.setItem(this.tokenKey, res.accessToken);
          localStorage.setItem(this.roleKey, res.role);
        }
        return res;
      }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  getToken() { return localStorage.getItem(this.tokenKey); }
  getRole() { return localStorage.getItem(this.roleKey); }
  isLoggedIn() { return !!this.getToken(); }

  getProfile() {
    return this.http.get(`${environment.apiUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  updateProfile(payload: any) {
    return this.http.put(`${environment.apiUrl}/user/profile`, payload, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

}