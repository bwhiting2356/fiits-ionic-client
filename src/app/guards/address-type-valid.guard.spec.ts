import { Router } from '@angular/router';
import { TestBed, inject, async } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { initialSearchState } from '../reducers/search.reducer';
import { AddressTypeValidGuard } from './address-type-valid.guard';

describe('AddressTypeValidGuard', () => {
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressTypeValidGuard,
        { provide: Router, useValue: { navigate: () => {} }},
        provideMockStore({ initialState })
      ]
    });
    store = TestBed.get<Store<State>>(Store);
  }));

  it('should return true, not navigate away', inject(
    [Router, AddressTypeValidGuard],
    async (router: Router, guard: AddressTypeValidGuard) => {
      store.setState({
        ...initialState,
        search: {
            ...initialSearchState,
            searchAddressType: 'Origin'
        }
      });

      spyOn(router, 'navigate');
      guard.canActivate().subscribe(result => expect(result).toBeTruthy());
      expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should return false, navigate away', inject(
    [Router, AddressTypeValidGuard],
    async (router: Router, guard: AddressTypeValidGuard) => {
      store.setState({
        ...initialState,
        search: {
            ...initialSearchState,
            searchAddressType: undefined
        }
      });

      spyOn(router, 'navigate');
      guard.canActivate().subscribe(result => expect(result).toBeFalsy());
      expect(router.navigate).toHaveBeenCalledWith(['/search']);
  }));
});
