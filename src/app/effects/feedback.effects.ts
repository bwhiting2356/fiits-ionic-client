import { Injectable } from '@angular/core';
import { Effect, Actions, ofType, createEffect } from '@ngrx/effects';
import { feedbackSuccess, feedbackError, sendFeedback } from '../actions/feedback.actions';
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { FeedbackService } from '../services/feedback.service';
import { Action, Store } from '@ngrx/store';
import { selectFeedbackComment } from '../reducers/feedback.reducer';
import { State } from '../reducers';
import { selectEmail } from '../reducers/user.reducer';

@Injectable()
export class FeedbackEffects {

    @Effect()
    feedback$ = createEffect(() => this.actions$.pipe(
      ofType(sendFeedback),
      withLatestFrom(this.store.select(selectFeedbackComment), this.store.select(selectEmail)),
      switchMap(([_, comment, email]) => this.feedbackService.sendFeedback({ comment, email }).pipe(
        map(() => feedbackSuccess()),
        catchError(error => of(feedbackError({ error })))
      ))
    ));

    constructor(
        private store: Store<State>,
        private feedbackService: FeedbackService,
        private actions$: Actions<Action>) {}
}
