import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'role';

  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  role$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password });
  }

   loginSuccess(token: string, role: string, username: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    this.roleSubject.next(role);
    this.usernameSubject.next(username);
  }

  resetPassword(username: string, oldPassword: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/auth/first-login`, { username, oldPassword, newPassword });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  getToken() { return localStorage.getItem(this.tokenKey); }
  getRole() { return localStorage.getItem(this.roleKey); }
  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return of(false);
    }

    return this.http.post<any>(`${environment.apiUrl}/auth/validate-token`, { token }).pipe(
      map((res) => {
        console.log('Token valid:', res);
        return res.isValid === true;
      }),
      catchError((err) => {
        console.log('Token invalid:', err);
        this.logout();
        return of(false);
      })
    );
  }
    // return !!this.getToken(); 
  

  getProfile() {
    console.log(this.getToken());
    
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