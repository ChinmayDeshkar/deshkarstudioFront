import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'   // 👈 ensures it's globally injectable
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${environment.apiUrl}/admin/all-employee`, { headers });
  }

  updateEmployee(employee: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${environment.apiUrl}/admin/update-employee/${employee.id}`, employee, { headers });
  }
}
