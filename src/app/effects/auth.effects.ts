import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AuthActionTypes, AuthActions, LogInSuccessFromSearch, LogInErrorFromSearch } from '../actions/auth.actions';
import { map, switchMap, tap, withLatestFrom, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { State } from '../reducers';
import { BookTripRequest } from '../actions/search.actions';


@Injectable()
export class AuthEffects {

    @Effect()
    logInFromSearch$: Observable<Action> = this.actions$.pipe(
      ofType(AuthActionTypes.LogInFromSearch),
      switchMap(() => this.authService.login$()),
      withLatestFrom(this.store.select(store => store.search.trip)),
      switchMap(([uid, trip]) => [
        new BookTripRequest(trip),
        new LogInSuccessFromSearch(uid),
      ]),
      catchError(error => of(new LogInErrorFromSearch(error)))
    );

    constructor(
        private store: Store<State>,
        private authService: AuthService,
        private actions$: Actions<AuthActions>) {}
}