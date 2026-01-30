import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Feedback {
  id?: number;
  phoneNumber: number;
  overallRating: number;
  serviceQuality: number;
  serviceType: string;
  comment: string;
  wouldRecommend: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  

  constructor(private http: HttpClient) {}

  // ✅ Check if phone number already submitted feedback
  checkPhoneNumber(phoneNumber: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.apiUrl}/check/phone-number/${phoneNumber}`
    );
  }

  // ✅ Add feedback
  addFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/add`,
      feedback
    );
  }
}
