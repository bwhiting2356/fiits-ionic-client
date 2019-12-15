import { Injectable } from '@angular/core';
import { Effect, Actions, ofType, createEffect } from '@ngrx/effects';
import { feedbackSuccess, feedbackError, sendFeedback } from '../actions/feedback.actions';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { FeedbackService } from '../services/feedback.service';
import { Action } from '@ngrx/store';

@Injectable()
export class FeedbackEffects {

    @Effect()
    feedback$ = createEffect(() => this.actions$.pipe(
      ofType(sendFeedback),
      map(action => action.feedback),
      switchMap(feedback => this.feedbackService.sendFeedback(feedback).pipe(
        map(() => feedbackSuccess()),
        catchError(error => of(feedbackError({ error })))
      ))
    ));

    constructor(
        private feedbackService: FeedbackService,
        private actions$: Actions<Action>) {}
}
