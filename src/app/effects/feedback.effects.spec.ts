import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { FeedbackEffects } from './feedback.effects';
import { sendFeedback, feedbackSuccess, feedbackError } from '../actions/feedback.actions';
import { FeedbackService } from '../services/feedback.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../reducers';
import { initialState } from '../reducers';
import { Store } from '@ngrx/store';
import { initialFeedbackState } from '../reducers/feedback.reducer';
import { initialUserState } from '../reducers/user.reducer';

describe('FeedbackEffects', () => {
  let actions$: Observable<any>;
  let effects: FeedbackEffects;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: FeedbackService, useValue: { sendFeedback: () => {} }}
      ]
    });

    effects = TestBed.get<FeedbackEffects>(FeedbackEffects);
    store = TestBed.get<Store<State>>(Store);
  });

  it('should return FetchTripSuccess on success', inject(
    [FeedbackService, FeedbackEffects],
    async (feedbackService, feedbackEffects: FeedbackEffects) => {
      spyOn(feedbackService, 'sendFeedback').and.returnValue(of({}));
      store.setState({
        ...initialState,
        user: {
          ...initialUserState,
          email: 'test@testy.com'
        },
        feedback: {
          ...initialFeedbackState,
          comment: 'cool app'
        }
      });

      const action = sendFeedback();
      const completion = feedbackSuccess();

      actions$ = hot('--a-', { a: action });
      const expected = hot('--b', { b: completion });
      expect(feedbackEffects.feedback$).toBeObservable(expected);
      expect(feedbackService.sendFeedback).toHaveBeenCalledWith({
        comment: 'cool app',
        email: 'test@testy.com'
      });
  }));

  it('should return feedbackError on error', inject(
    [FeedbackService, FeedbackEffects],
    async (feedbackService, feedbackEffects: FeedbackEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(feedbackService, 'sendFeedback').and.returnValue(errorResponse);
      store.setState({
        ...initialState,
        feedback: {
          ...initialFeedbackState,
          comment: 'cool app'
        }
      });

      const action = sendFeedback();
      const completion = feedbackError({ error });

      actions$ = hot('--a-', { a: action });
      const expected = hot('--b', { b: completion });
      expect(feedbackEffects.feedback$).toBeObservable(expected);
  }));

});
