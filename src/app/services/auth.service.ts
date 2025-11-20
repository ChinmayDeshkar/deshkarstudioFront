import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'role';
  private readonly usernameKey = 'username';

  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.roleKey));
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.usernameKey));

  role$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ---------------- LOGIN -------------------
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password });
  }

  // ---------------- SETTERS (IMPORTANT!) -------------------
  setLoginData(token: string, role: string, username: string) {
    console.log("Setting login data:", { token, role, username });
    
    // Save in localStorage
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
    localStorage.setItem(this.usernameKey, username);

    // Update navbar instantly
    this.roleSubject.next(role);
    this.usernameSubject.next(username);
  }

  // ---------------- LOGOUT -------------------
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.usernameKey);

    this.roleSubject.next(null);
    this.usernameSubject.next(null);
  }

  // ---------------- GETTERS -------------------
  getToken() { return localStorage.getItem(this.tokenKey); }
  getRole() { return localStorage.getItem(this.roleKey); }
  getUsername() { return localStorage.getItem(this.usernameKey); }

  // ---------------- TOKEN VALIDATION -------------------
  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    return this.http.post<any>(`${environment.apiUrl}/auth/validate-token`, { token }).pipe(
      map(res => res.isValid === true),
      catchError(err => {
        console.log('Token invalid:', err);
        this.logout();
        return of(false);
      })
    );
  }

  // ---------------- PROFILE APIs -------------------
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

  // ---------------- OTP -------------------
  resetPassword(username: string, oldPassword: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/auth/first-login`, { username, oldPassword, newPassword });
  }

  verifyOtp(username: string, otp: string) {
    return this.http.post(`${environment.apiUrl}/auth/verify-otp`, { username, otp });
  }
}
