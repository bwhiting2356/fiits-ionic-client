import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../shared/feedback.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  FEEDBACK_API_URL = `${environment.backendURL}/feedback`;

  constructor(private http: HttpClient) { }

  sendFeedback(feedback: Feedback) {
    return this.http.post(this.FEEDBACK_API_URL, feedback);
  }
}
