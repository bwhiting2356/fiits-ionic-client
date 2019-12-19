import { Router } from '@angular/router';
import { TestBed, inject, async } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { initialSearchState } from '../reducers/search.reducer';
import { TripValidGuard } from './trip-valid.guard';
import { mockTrips } from 'src/testing/mock-trips';

describe('TripValidGuard', () => {
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        TripValidGuard,
        { provide: Router, useValue: { navigate: () => {} }},
        provideMockStore({ initialState })
      ]
    });
    store = TestBed.get<Store<State>>(Store);
  }));

  it('should return true, not navigate away', inject(
    [Router, TripValidGuard],
    async (router: Router, guard: TripValidGuard) => {
      store.setState({
        ...initialState,
        search: {
            ...initialSearchState,
            trip: mockTrips[0]
        }
      });

      spyOn(router, 'navigate');
      guard.canActivate().subscribe(result => expect(result).toBeTruthy());
      expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should return false, navigate away', inject(
    [Router, TripValidGuard],
    async (router: Router, guard: TripValidGuard) => {
      store.setState({
        ...initialState,
        search: {
            ...initialSearchState,
            trip: undefined
        }
      });

      spyOn(router, 'navigate');
      guard.canActivate().subscribe(result => expect(result).toBeFalsy());
      expect(router.navigate).toHaveBeenCalledWith(['/search']);
  }));
});
