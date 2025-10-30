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

  signup(payload: any) {
    return this.http.post(`${environment.apiUrl}/auth/signup`, payload);
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password })
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
  isLoggedIn() { return !!this.getToken(); 

  }

  requestOtp(phone: string) {
    console.log("Sending OTP to: " + phone);
    
  return this.http.post(`${environment.apiUrl}/auth/request-otp`, { phoneNumber: phone });
  }

  verifyOtp(phone: string, otp: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/verify-otp`, { phoneNumber: phone, otp });
  }
}

