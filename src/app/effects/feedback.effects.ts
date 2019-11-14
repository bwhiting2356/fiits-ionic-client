import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { FeedbackActionTypes, FeedbackActions, FeedbackSuccess, FeedbackError } from '../actions/feedback.actions';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { FeedbackService } from '../services/feedback.service';
import { Action } from '@ngrx/store';

@Injectable()
export class FeedbackEffects {

    @Effect()
    tripSearchQuery$: Observable<Action> = this.actions$.pipe(
      ofType(FeedbackActionTypes.SendFeedback),
      map(action => action.feedback),
      switchMap(feedback => this.feedbackService.sendFeedback(feedback).pipe(
        map(() => new FeedbackSuccess()),
        catchError(error => of(new FeedbackError(error)))
      ))
    );

    constructor(
        private feedbackService: FeedbackService,
        private actions$: Actions<FeedbackActions>) {}
}
