import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { ConfirmBookingPage } from './confirm-booking.page';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState, State } from '../../reducers';
import { Store } from '@ngrx/store';
import { initialSearchState } from '../../reducers/search.reducer';
import { mockTrips } from 'src/testing/mock-trips';
import { hot } from 'jasmine-marbles';
import { initialUserState } from '../../reducers/user.reducer';
import { mockAccountInfo } from 'src/testing/mock-account-info';
import { By } from '@angular/platform-browser';
import { bookTripRequest } from '../../actions/search.actions';
import { NavController } from '@ionic/angular';

describe('ConfirmBookingPage', () => {
  let component: ConfirmBookingPage;
  let fixture: ComponentFixture<ConfirmBookingPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState }),
        { provide: NavController, useValue: { navigateBack: () => {} }}
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('canBook should be true if the account balance has enough funds for the trip', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        accountInfo: { ...mockAccountInfo, balance: 10.00 }
      },
      search: {
        ...initialSearchState,
        trip: { ...mockTrips[0], totalPrice: -3.00, totalDistance: 0, totalDuration: 0, status: 'Upcoming' }
      }
    });
    fixture.detectChanges();
    expect(component.canBook).toBeObservable(hot('a', { a: true }));
  });

  it('canBook should be false if the account balance does not have enough funds for the trip', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        accountInfo: { ...mockAccountInfo, balance: 1.00 }
      },
      search: {
        ...initialSearchState,
        trip: { ...mockTrips[0], totalPrice: -2.00, totalDistance: 0, totalDuration: 0, status: 'Upcoming' }
      }
    });
    fixture.detectChanges();
    expect(component.canBook).toBeObservable(hot('a', { a: false }));
  });

  it('canBook should be false if accountInfo is undefined', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        accountInfo: undefined
      },
      search: {
        ...initialSearchState,
        trip: { ...mockTrips[0], totalPrice: -3.00, totalDistance: 0, totalDuration: 0, status: 'Upcoming' }
      }
    });
    fixture.detectChanges();
    expect(component.canBook).toBeObservable(hot('a', { a: false }));
  });

  it('canBook should be false if trip is undefined', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        accountInfo: mockAccountInfo
      },
      search: {
        ...initialSearchState,
        trip: undefined
      }
    });
    fixture.detectChanges();
    expect(component.canBook).toBeObservable(hot('a', { a: false }));
  });

  it('should show the spinner if accountInfoFetching is true', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        accountInfoFetching: true
      },
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#fetching'))).toBeTruthy();
  });

  it('should show can-book section if not fetching and user can book', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        accountInfoFetching: false,
        accountInfo: { ...mockAccountInfo, balance: 10.00 }
      },
      search: {
        ...initialSearchState,
        trip: { ...mockTrips[0], totalPrice: -3.00, totalDistance: 0, totalDuration: 0, status: 'Upcoming' }
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#can-book'))).toBeTruthy();
  });

  it('should show no-book section if not fetching and user cannot book', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialUserState,
        accountInfoFetching: false,
        accountInfo: { ...mockAccountInfo, balance: 2.00 }
      },
      search: {
        ...initialSearchState,
        trip: { ...mockTrips[0], totalPrice: -3.00, totalDistance: 0, totalDuration: 0, status: 'Completed' }
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#no-book'))).toBeTruthy();
  });

  it('should dispatch an action to book the trip', () => {
    spyOn(store, 'dispatch');
    component.bookTrip();
    expect(store.dispatch).toHaveBeenCalledWith(bookTripRequest());
  });

  it('hould navigate back to /trip-details', inject(
    [NavController],
    async (navCtrl: NavController) => {
      spyOn(navCtrl, 'navigateBack');
      component.backToTripDetails();
      expect(navCtrl.navigateBack).toHaveBeenCalledWith('/trip-details');
  }));
});
