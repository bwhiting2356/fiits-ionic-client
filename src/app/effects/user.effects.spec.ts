import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { UserEffects } from './user.effects';
import {
  FetchTrips,
  FetchTripsSuccess,
  FetchTripsError,
  LogIn,
  LogInSuccess,
  SignUp,
  SignUpSuccess,
  SignUpError,
  LogInError,
  FetchAccountInfo
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

      const action = new FetchTrips();
      const completion = new FetchTripsSuccess(mockTrips);

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

      const action = new FetchTrips();
      const completion = new FetchTripsError(error);

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

        const action = new SignUp();
        actions$ = hot('a', { a: action });

        const signUpSuccess = new SignUpSuccess('mock-uid');
        const fetchAccountInfo = new FetchAccountInfo();

        const expected = hot('(bc)', { b: signUpSuccess, c: fetchAccountInfo });

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

        const action = new SignUp();
        actions$ = hot('a', { a: action });

        const fetchAccountInfo = new FetchAccountInfo();
        const signUpSuccess = new SignUpSuccess('mock-uid');
        const expected = hot('(bc)', { b: signUpSuccess, c: fetchAccountInfo });

        expect(userEffects.signUp$).toBeObservable(expected);
        expect(navCtrl.navigateForward).toHaveBeenCalledWith('/confirm-booking');
  }));

  it('should dispatch signup error', inject(
    [AuthService, UserEffects],
    async (authService: AuthService, userEffects: UserEffects) => {
        const error = new Error();
        const errorResponse = cold('#|', {}, error);
        spyOn(authService, 'emailSignUp$').and.returnValue(errorResponse);

        const action = new SignUp();
        actions$ = hot('a', { a: action });

        const completion = new SignUpError(error);
        const expected = hot('b', { b: completion });

        expect(userEffects.signUp$).toBeObservable(expected);
  }));

  it('should dispatch login error', inject(
    [AuthService, UserEffects],
    async (authService: AuthService, userEffects: UserEffects) => {
        const error = new Error();
        const errorResponse = cold('#|', {}, error);
        spyOn(authService, 'emailLogin$').and.returnValue(errorResponse);

        const action = new LogIn();
        actions$ = hot('a', { a: action });

        const completion = new LogInError(error);
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

        const action = new LogIn();
        actions$ = hot('a', { a: action });

        const fetchAccountInfo = new FetchAccountInfo();
        const signUpSuccess = new LogInSuccess('mock-uid');
        const expected = hot('(bc)', { b: signUpSuccess, c: fetchAccountInfo });
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

        const action = new LogIn();
        actions$ = hot('a', { a: action });

        const fetchAccountInfo = new FetchAccountInfo();
        const signUpSuccess = new LogInSuccess('mock-uid');
        const expected = hot('(bc)', { b: signUpSuccess, c: fetchAccountInfo });

        expect(userEffects.logIn$).toBeObservable(expected);
        expect(navCtrl.navigateForward).toHaveBeenCalledWith('/confirm-booking');
  }));

});
