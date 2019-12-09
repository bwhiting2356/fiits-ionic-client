import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { FeedbackEffects } from './feedback.effects';
import { SendFeedback, FeedbackSuccess, FeedbackError } from '../actions/feedback.actions';
import { FeedbackService } from '../services/feedback.service';

describe('FeedbackEffects', () => {
  let actions$: Observable<any>;
  let effects: FeedbackEffects;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackEffects,
        { provide: FeedbackService, useValue: { sendFeedback: () => {} }},
        provideMockActions(() => actions$),
        provideMockStore({ initialState })
      ]
    });

    effects = TestBed.get<FeedbackEffects>(FeedbackEffects);
    store = TestBed.get<Store<State>>(Store);
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
