import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  UserActionTypes,
  UserActions,
  LogInSuccessFromSearch,
  LogInErrorFromSearch,
  FetchTripsSuccess,
  FetchTripsError
} from '../actions/user.actions';
import { switchMap, withLatestFrom, catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { State } from '../reducers';
import { BookTripRequest } from '../actions/search.actions';
import { selectTrip } from '../reducers/search.reducer';
import { TripService } from '../services/trip.service';
import { selectUID } from '../reducers/user.reducer';

@Injectable()
export class UserEffects {

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

    @Effect()
    fetchTrips$: Observable<Action> = this.actions$.pipe(
      ofType(UserActionTypes.FetchTrips),
      withLatestFrom(this.store.select(selectUID)),
      switchMap(([_, userId]) => this.tripService.fetchTrips(userId).pipe(
        map(trips => new FetchTripsSuccess(trips)),
        catchError(error => of(new FetchTripsError(error)))
      ))
    );

    constructor(
        private store: Store<State>,
        private userService: UserService,
        private tripService: TripService,
        private actions$: Actions<UserActions>) {}
}
