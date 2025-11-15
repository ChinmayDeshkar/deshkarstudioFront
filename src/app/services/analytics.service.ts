import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  constructor(private http: HttpClient) {}

  /** Utility: Build headers with token */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getRevenuePerYear(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/purchases/revenue-year`, {
      headers: this.getHeaders()
    });
  }

  getRevenuePerMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/purchases/revenue-month`, {
      headers: this.getHeaders()
    });
  }

  getRevenuePerDay(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/purchases/revenue-past-seven`, {
      headers: this.getHeaders()
    });
  }

  /** Optional: Revenue for custom range */
  getRevenueByRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/purchases/revenue-range?start=${startDate}&end=${endDate}`, {
      headers: this.getHeaders()
    });
  }
}
