import { Component } from '@angular/core';
import { Feedback, FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent {
  phoneNumber!: number;
  step: number = 1; // 👈 THIS IS REQUIRED
  errorMessage = '';

  feedback: Feedback = {
    phoneNumber: 0,
    overallRating: 0,
    serviceQuality: 0,
    serviceType: '',
    comment: '',
    wouldRecommend: true,
  };

  constructor(private feedbackService: FeedbackService) {}

  checkPhone() {
    this.errorMessage = '';

    this.feedbackService.checkPhoneNumber(this.phoneNumber).subscribe({
      next: (exists) => {
        if (exists) {
          this.errorMessage = 'Feedback already submitted for this number';
        } else {
          this.feedback.phoneNumber = this.phoneNumber;
          this.step = 2;
        }
      },
      error: () => (this.errorMessage = 'Unable to check phone number'),
    });
  }

  selectRating(type: 'overall' | 'quality', value: number) {
    if (type === 'overall') this.feedback.overallRating = value;
    if (type === 'quality') this.feedback.serviceQuality = value;
  }

  isFormValid(): boolean {
    return (
      this.feedback.phoneNumber !== 0 &&
      this.feedback.phoneNumber.toString().length === 10 &&
      this.feedback.overallRating > 0 &&
      this.feedback.serviceQuality > 0 &&
      this.feedback.serviceType.trim() !== '' &&
      this.feedback.wouldRecommend !== null
    );
  }

  submitFeedback() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.errorMessage = '';

    this.feedbackService.addFeedback(this.feedback).subscribe({
      next: () => (this.step = 3),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to submit feedback';
      },
    });
  }
}
