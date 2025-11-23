import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private http: HttpClient) { }

  getTodayIncome(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/income/today`,{
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }
  );
  }

  getWeeklyIncome(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/income/weekly`,{
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    });
  }

  getMonthlyIncome(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/income/monthly`,{
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    });
  }

  getIncomeInRange(start: string, end: string): Observable<number> {
    let params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<number>(`${environment.apiUrl}/range`, { params, 
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }   });
  }

  getLast7DaysDailyIncome(): Observable<{ [date: string]: number }> {
    return this.http.get<{ [date: string]: number }>(`${environment.apiUrl}/income/last7days`,{
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    });
  }
}
