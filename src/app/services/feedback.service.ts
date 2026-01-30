import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private baseUrl = 'http://localhost:8080/feedback';

  constructor(private http: HttpClient) {}

  // ✅ Check if phone number already submitted feedback
  checkPhoneNumber(phoneNumber: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/check/phone-number/${phoneNumber}`
    );
  }

  // ✅ Add feedback
  addFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/add`,
      feedback
    );
  }
}
