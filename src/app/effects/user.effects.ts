import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { UserActionTypes, UserActions, LogInSuccessFromSearch, LogInErrorFromSearch } from '../actions/user.actions';
import { switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { State } from '../reducers';
import { BookTripRequest } from '../actions/search.actions';
import { selectTrip } from '../reducers/search.reducer';

@Injectable()
export class AuthEffects {

    @Effect()
    logInFromSearch$: Observable<Action> = this.actions$.pipe(
      ofType(UserActionTypes.LogInFromSearch),
      switchMap(() => this.userService.login$()),
      withLatestFrom(this.store.select(selectTrip)),
      switchMap(([uid, trip]) => [
        new BookTripRequest(trip, uid),
        new LogInSuccessFromSearch(uid),
      ]),
      catchError(error => of(new LogInErrorFromSearch(error)))
    );

    constructor(
        private store: Store<State>,
        private userService: UserService,
        private actions$: Actions<UserActions>) {}
}
