import { TestBed, inject } from '@angular/core/testing';

import { FeedbackService } from './feedback.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Feedback } from '../shared/feedback.model';

describe('FeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [FeedbackService]
  }));

  it('should be created', () => {
    const service: FeedbackService = TestBed.get(FeedbackService);
    expect(service).toBeTruthy();
  });

  it('should make a request to post the feedback', inject(
    [HttpTestingController, FeedbackService],
    (httpMock: HttpTestingController, feedbackService: FeedbackService) => {
      const feedback: Feedback = {
        comment: 'cool app',
      };

      feedbackService.sendFeedback(feedback).subscribe(response => {
        expect(response).toEqual(200);
      });

      const mockReq = httpMock.expectOne(feedbackService.FEEDBACK_API_URL);
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(200);

      httpMock.verify();
  }));
});
