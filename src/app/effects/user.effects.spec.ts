import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { UserEffects } from './user.effects';
import { FetchTrips, FetchTripsSuccess, FetchTripsError } from '../actions/user.actions';
import { mockTrips } from 'src/testing/mock-trips';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../reducers';
import { UserService } from '../services/user.service';
import { TripService } from '../services/trip.service';

describe('UserEffects success', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        { provide: UserService, useValue: { login: () => of('mock-uid')} },
        { provide: TripService, useValue: { fetchTrips: () => of(mockTrips)} },
        provideMockActions(() => actions$),
        provideMockStore({ initialState })
      ]
    });

    effects = TestBed.get<UserEffects>(UserEffects);
  });

  it('should return FetchTripSuccess on success', () => {
    const action = new FetchTrips();
    const completion = new FetchTripsSuccess(mockTrips);

    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.fetchTrips$).toBeObservable(expected);
  });

});

describe('UserEffects error', () => {
    let actions$: Observable<any>;
    let effects: UserEffects;
    const error = new Error();

    beforeEach(() => {
        const errorResponse = cold('#|', {}, error);
        TestBed.configureTestingModule({
            providers: [
            UserEffects,
            { provide: UserService, useValue: { login: () => errorResponse }},
            { provide: TripService, useValue: { fetchTrips: () => errorResponse }},
            provideMockActions(() => actions$),
            provideMockStore({ initialState })
            ]
        });

        effects = TestBed.get<UserEffects>(UserEffects);
    });

    it('should return FetchTripError on error', () => {
      const action = new FetchTrips();
      const completion = new FetchTripsError(error);

      actions$ = hot('--a-', { a: action });
      const expected = hot('--b', { b: completion });
      expect(effects.fetchTrips$).toBeObservable(expected);
    });

  });
