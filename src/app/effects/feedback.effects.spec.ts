import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { FeedbackEffects } from './feedback.effects';
import { SendFeedback, FeedbackSuccess, FeedbackError } from '../actions/feedback.actions';
import { FeedbackService } from '../services/feedback.service';

describe('FeedbackEffects', () => {
  let actions$: Observable<any>;
  let effects: FeedbackEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackEffects,
        provideMockActions(() => actions$),
        { provide: FeedbackService, useValue: { sendFeedback: () => {} }}
      ]
    });

    effects = TestBed.get<FeedbackEffects>(FeedbackEffects);
  });

  it('should return FetchTripSuccess on success', inject(
    [FeedbackService, FeedbackEffects],
    async (feedbackService, feedbackEffects: FeedbackEffects) => {
      spyOn(feedbackService, 'sendFeedback').and.returnValue(of({}));

      const action = new SendFeedback({ comment: 'cool app' });
      const completion = new FeedbackSuccess();

      actions$ = hot('--a-', { a: action });
      const expected = hot('--b', { b: completion });
      expect(feedbackEffects.feedback$).toBeObservable(expected);
  }));

  it('should return FeedbackError on error', inject(
    [FeedbackService, FeedbackEffects],
    async (feedbackService, feedbackEffects: FeedbackEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(feedbackService, 'sendFeedback').and.returnValue(errorResponse);

      const action = new SendFeedback({ comment: 'cool app' });
      const completion = new FeedbackError(error);

      actions$ = hot('--a-', { a: action });
      const expected = hot('--b', { b: completion });
      expect(feedbackEffects.feedback$).toBeObservable(expected);
  }));

});
