import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  UserActionTypes,
  UserActions,
  FetchTripsSuccess,
  FetchTripsError,
  SignUpSuccess,
  SignUpError,
  LogInSuccess,
  LogInError,
  FetchAccountInfo,
  FetchAccountInfoError,
  FetchAccountInfoSuccess,
  FetchTrips
} from '../actions/user.actions';
import { switchMap, withLatestFrom, catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { State } from '../reducers';
import { TripService } from '../services/trip.service';
import { selectUID, selectEmail, selectPassword } from '../reducers/user.reducer';
import { selectTrip } from '../reducers/search.reducer';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PaymentsService } from '../services/payments.service';

@Injectable()
export class UserEffects {

    @Effect()
    signUp$: Observable<Action> = this.actions$.pipe(
      ofType(UserActionTypes.SignUp),
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
          new SignUpSuccess(credential.user.uid),
          new FetchAccountInfo() // what account info is there to fetch for a new signup?
        ]),
        catchError(error => of(new SignUpError(error)))
      ))
    );

    @Effect()
    logIn$: Observable<Action> = this.actions$.pipe(
      ofType(UserActionTypes.LogIn),
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
          new LogInSuccess(credential.user.uid),
          new FetchTrips(),
          new FetchAccountInfo()
        ]),
        catchError(error => of(new LogInError(error)))
      ))
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

    @Effect()
    fetchAccountInfo$: Observable<Action> = this.actions$.pipe(
      ofType(UserActionTypes.FetchAccountInfo),
      withLatestFrom(this.store.select(selectUID)),
      switchMap(([_, userId]) => this.paymentService.fetchAccountInfo(userId).pipe(
        map(accountInfo => new FetchAccountInfoSuccess(accountInfo)),
        catchError(error => of(new FetchAccountInfoError(error)))
      ))
    );

    constructor(
        private store: Store<State>,
        private navCtrl: NavController,
        private authService: AuthService,
        private tripService: TripService,
        private paymentService: PaymentsService,
        private actions$: Actions<UserActions>) {}
}
