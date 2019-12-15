import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { UserEffects } from './user.effects';
import {
  fetchTrips,
  fetchTripsSuccess,
  fetchTripsError,
  logIn,
  logInSuccess,
  signUp,
  signUpSuccess,
  signUpError,
  logInError,
  fetchAccountInfo
} from '../actions/user.actions';
import { mockTrips } from 'src/testing/mock-trips';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { AuthService } from '../services/auth.service';
import { TripService } from '../services/trip.service';
import { Store } from '@ngrx/store';
import { NavController } from '@ionic/angular';
import { initialSearchState } from '../reducers/search.reducer';
import { PaymentsService } from '../services/payments.service';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        { provide: NavController, useValue: { navigateForward: () => {}, navigateBack: () => {} }},
        { provide: AuthService, useValue: { emailSignUp$: () => {}, emailLogin$: () => {} }},
        { provide: TripService, useValue: { fetchTrips: () => {} }},
        { provide: PaymentsService, useValue: { fetchAccountInfo: () => { }}},
        provideMockActions(() => actions$),
        provideMockStore({ initialState })
      ]
    });

    effects = TestBed.get<UserEffects>(UserEffects);
    store = TestBed.get<Store<State>>(Store);
  });

  it('should return FetchTripSuccess on success', inject(
    [TripService, UserEffects],
    async (tripService: TripService, userEffects: UserEffects) => {
      spyOn(tripService, 'fetchTrips').and.returnValue(of(mockTrips));

      const action = fetchTrips();
      const completion = fetchTripsSuccess({ trips: mockTrips });

      actions$ = hot('--a-', { a: action });
      const expected = hot('--b', { b: completion });
      expect(userEffects.fetchTrips$).toBeObservable(expected);
  }));

  it('should return FetchTripError on error', inject(
    [TripService, UserEffects],
    async (tripService: TripService, userEffects: UserEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(tripService, 'fetchTrips').and.returnValue(errorResponse);

      const action = fetchTrips();
      const completion = fetchTripsError({ error });

      actions$ = hot('--a-', { a: action });
      const expected = hot('--b', { b: completion });
      expect(userEffects.fetchTrips$).toBeObservable(expected);
  }));

  it('no trip search in progress: should call auth service to sign up with email and password, navigate back to /search', inject(
    [AuthService, NavController, UserEffects],
    async (authService: AuthService, navCtrl: NavController, userEffects: UserEffects) => {
        store.setState({
          ...initialState,
          search: {
            ...initialSearchState,
            trip: undefined
          }
        });
        spyOn(authService, 'emailSignUp$')
          .and.returnValue(of({ user: { uid: 'mock-uid' }} as firebase.auth.UserCredential));
        spyOn(navCtrl, 'navigateBack');

        const action = signUp();
        actions$ = hot('a', { a: action });

        const signUpSuccessAction = signUpSuccess({ uid: 'mock-uid' });
        const fetchAccountInfoAction = fetchAccountInfo();

        const expected = hot('(bc)', { b: signUpSuccessAction, c: fetchAccountInfoAction });

        expect(userEffects.signUp$).toBeObservable(expected);
        expect(navCtrl.navigateBack).toHaveBeenCalledWith('/search');
  }));

  it('trip search in progress: should call auth service to sign up with email and password, navigate forward to /confirm-booking', inject(
    [AuthService, NavController, UserEffects],
    async (authService: AuthService, navCtrl: NavController, userEffects: UserEffects) => {
        store.setState({
          ...initialState,
          search: {
            ...initialSearchState,
            trip: mockTrips[0]
          }
        });
        spyOn(authService, 'emailSignUp$')
          .and.returnValue(of({ user: { uid: 'mock-uid' }} as firebase.auth.UserCredential));
        spyOn(navCtrl, 'navigateForward');

        const action = signUp();
        actions$ = hot('a', { a: action });

        const fetchAccountInfoAction = fetchAccountInfo();
        const signUpSuccessAction = signUpSuccess({ uid: 'mock-uid' });
        const expected = hot('(bc)', { b: signUpSuccessAction, c: fetchAccountInfoAction });

        expect(userEffects.signUp$).toBeObservable(expected);
        expect(navCtrl.navigateForward).toHaveBeenCalledWith('/confirm-booking');
  }));

  it('should dispatch signup error', inject(
    [AuthService, UserEffects],
    async (authService: AuthService, userEffects: UserEffects) => {
        const error = new Error();
        const errorResponse = cold('#|', {}, error);
        spyOn(authService, 'emailSignUp$').and.returnValue(errorResponse);

        const action = signUp();
        actions$ = hot('a', { a: action });

        const completion = signUpError({ error });
        const expected = hot('b', { b: completion });

        expect(userEffects.signUp$).toBeObservable(expected);
  }));

  it('should dispatch login error', inject(
    [AuthService, UserEffects],
    async (authService: AuthService, userEffects: UserEffects) => {
        const error = new Error();
        const errorResponse = cold('#|', {}, error);
        spyOn(authService, 'emailLogin$').and.returnValue(errorResponse);

        const action = logIn();
        actions$ = hot('a', { a: action });

        const completion = logInError({ error });
        const expected = hot('b', { b: completion });

        expect(userEffects.logIn$).toBeObservable(expected);
  }));

  it('no trip search in progress: should call auth service to log in with email and password, navigate back to /search', inject(
    [AuthService, NavController, UserEffects],
    async (authService: AuthService, navCtrl: NavController, userEffects: UserEffects) => {
        store.setState({
          ...initialState,
          search: {
            ...initialSearchState,
            trip: undefined
          }
        });
        spyOn(authService, 'emailLogin$')
          .and.returnValue(of({ user: { uid: 'mock-uid' }} as firebase.auth.UserCredential));
        spyOn(navCtrl, 'navigateBack');

        const action = logIn();
        actions$ = hot('a', { a: action });

        const logInSuccessAction = logInSuccess({ uid: 'mock-uid' });
        const fetchTripsAction = fetchTrips();
        const fetchAccountInfoAction = fetchAccountInfo();
        const expected = hot('(bcd)', { b: logInSuccessAction, c: fetchTripsAction, d: fetchAccountInfoAction });
        expect(userEffects.logIn$).toBeObservable(expected);
        expect(navCtrl.navigateBack).toHaveBeenCalledWith('/search');
  }));

  it('trip search in progress: should call auth service to log in with email and password, navigate forward to /confirm-booking', inject(
    [AuthService, NavController, UserEffects],
    async (authService: AuthService, navCtrl: NavController, userEffects: UserEffects) => {
        store.setState({
          ...initialState,
          search: {
            ...initialSearchState,
            trip: mockTrips[0]
          }
        });
        spyOn(authService, 'emailLogin$')
          .and.returnValue(of({ user: { uid: 'mock-uid' }} as firebase.auth.UserCredential));
        spyOn(navCtrl, 'navigateForward');

        const action = logIn();
        actions$ = hot('a', { a: action });

        const logInSuccessAction = logInSuccess({ uid: 'mock-uid' });
        const fetchTripsAction = fetchTrips();
        const fetchAccountInfoAction = fetchAccountInfo();
        const expected = hot('(bcd)', { b: logInSuccessAction, c: fetchTripsAction, d: fetchAccountInfoAction });

        expect(userEffects.logIn$).toBeObservable(expected);
        expect(navCtrl.navigateForward).toHaveBeenCalledWith('/confirm-booking');
  }));

});
