import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  fetchTripsSuccess,
  fetchTripsError,
  logIn,
  signUp,
  signUpSuccess,
  signUpError,
  logInSuccess,
  logInError,
  fetchAccountInfo,
  fetchAccountInfoError,
  fetchAccountInfoSuccess,
  fetchTrips,
} from '../actions/user.actions';
import { switchMap, withLatestFrom, catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { State } from '../reducers';
import { TripService } from '../services/trip.service';
import { selectUID, selectEmail, selectPassword } from '../reducers/user.reducer';
import { selectTrip } from '../reducers/search.reducer';
import { NavController } from '@ionic/angular';
import { PaymentsService } from '../services/payments.service';

@Injectable()
export class UserEffects {

    @Effect()
    signUp$: Observable<Action> = this.actions$.pipe(
      ofType(signUp),
      withLatestFrom(
        this.store.select(selectEmail),
        this.store.select(selectPassword),
      ),
      switchMap(([, email, password]) => this.authService.emailSignUp$(email, password).pipe(
        withLatestFrom(this.store.select(selectTrip)),
        tap(([_, trip]) => {
          if (trip) {
            this.navCtrl.navigateForward('/confirm-booking');
          } else {
            this.navCtrl.navigateBack('/search');
          }
        }),
        switchMap(([credential]) => [
          signUpSuccess({ uid: credential.user.uid }),
          fetchAccountInfo() // TODO: what account info is there to fetch for a new signup?
        ]),
        catchError(error => of(signUpError({ error })))
      ))
    );

    @Effect()
    logIn$: Observable<Action> = this.actions$.pipe(
      ofType(logIn),
      withLatestFrom(
        this.store.select(selectEmail),
        this.store.select(selectPassword),
      ),
      switchMap(([, email, password]) => this.authService.emailLogin$(email, password).pipe(
        withLatestFrom(this.store.select(selectTrip)),
        tap(([_, trip]) => {
          if (trip) {
            this.navCtrl.navigateForward('/confirm-booking');
          } else {
            this.navCtrl.navigateBack('/search');
          }
        }),
        switchMap(([credential]) => [
          logInSuccess({ uid: credential.user.uid }),
          fetchTrips(),
          fetchAccountInfo()
        ]),
        catchError(error => of(logInError({ error })))
      ))
    );

    @Effect()
    fetchTrips$: Observable<Action> = this.actions$.pipe(
      ofType(fetchTrips),
      withLatestFrom(this.store.select(selectUID)),
      switchMap(([_, userId]) => this.tripService.fetchTrips(userId).pipe(
        map(trips => fetchTripsSuccess({ trips })),
        catchError(error => of(fetchTripsError({ error })))
      ))
    );

    @Effect()
    fetchAccountInfo$: Observable<Action> = this.actions$.pipe(
      ofType(fetchAccountInfo),
      withLatestFrom(this.store.select(selectUID)),
      switchMap(([_, userId]) => this.paymentService.fetchAccountInfo(userId).pipe(
        map(accountInfo => fetchAccountInfoSuccess({ accountInfo })),
        catchError(error => of(fetchAccountInfoError({ error })))
      ))
    );

    constructor(
        private store: Store<State>,
        private navCtrl: NavController,
        private authService: AuthService,
        private tripService: TripService,
        private paymentService: PaymentsService,
        private actions$: Actions<Action>) {}
}
