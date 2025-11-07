import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'   // 👈 ensures it's globally injectable
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/api/admin'; // adjust if needed

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/all-employee`, { headers });
  }

  updateEmployee(employee: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.baseUrl}/update-employee/${employee.id}`, employee, { headers });
  }
}
