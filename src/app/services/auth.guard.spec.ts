import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { mock } from 'ts-mockito';
import { TestBed, inject, async } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../reducers';
import { Store } from '@ngrx/store';
import { initialUserState } from '../reducers/user.reducer';

describe('AuthGuard', () => {
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: { navigate: () => {}} },
        provideMockStore({ initialState })
      ]
    });
    store = TestBed.get<Store<State>>(Store);
  }));

  it('should return true, not navigate away', inject(
    [Router, AuthGuard],
    async (router: Router, authGuard: AuthGuard) => {
      store.setState({
        ...initialState,
        user: {
          ...initialUserState,
          uid: 'mock-uid'
        }
      });

      spyOn(router, 'navigate');
      authGuard.canActivate().subscribe(result => expect(result).toBeTruthy());
      expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should return false, navigate away', inject(
    [Router, AuthGuard],
    async (router: Router, authGuard: AuthGuard) => {
      store.setState({
        ...initialState,
        user: {
          ...initialUserState,
          uid: ''
        }
      });

      spyOn(router, 'navigate');
      authGuard.canActivate().subscribe(result => expect(result).toBeFalsy());
      expect(router.navigate).toHaveBeenCalled();
  }));
});
