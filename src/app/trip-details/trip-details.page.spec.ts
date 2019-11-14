import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsPage } from './trip-details.page';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../reducers';
import { initialState } from '../reducers';
import { initialSearchState } from '../reducers/search.reducer';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';

import { BookTripRequest } from '../actions/search.actions';
import { mockTrips } from 'src/testing/mock-trips';

describe('TripDetailPage', () => {
  let component: TripDetailsPage;
  let fixture: ComponentFixture<TripDetailsPage>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title \'Trip Details\'', () => {
    expect(fixture.debugElement
        .query(By.css('ion-title'))
        .nativeElement.innerText)
      .toBe('Trip Details');
  });

  it('should change showMap from false to true when ionViewDidEnter is called', () => {
    expect(component.showMap).toBeFalsy();
    component.ionViewDidEnter();
    expect(component.showMap).toBeTruthy();
  });

  it('should not show the map, should show the placeholder, if showMap is false', async () => {
    component.showMap = false;
    fixture.detectChanges();
    expect(fixture.debugElement
      .query(By.css('app-google-map')))
    .toBeFalsy();

    expect(fixture.debugElement
      .query(By.css('#placeholder')))
    .toBeTruthy();
  });

  it('should show the map, should not show the placeholder, if showMap is false', async () => {
    component.showMap = true;
    fixture.detectChanges();
    expect(fixture.debugElement
      .query(By.css('app-google-map')))
    .toBeTruthy();

    expect(fixture.debugElement
      .query(By.css('#placeholder')))
    .toBeFalsy();
  });

  it('should contain the value of bookTripFetching from state', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        bookTripFetching: false
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.bookTripFetching).toBeObservable(expected);
  });

  it('should render \'Book this trip\' if bookTripFetching is false', async () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        bookTripFetching: false
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#book-trip')).nativeElement.innerText)
      .toBe('Book this trip');
    expect(fixture.debugElement.query(By.css('#book-trip-fetching')))
      .toBeFalsy();
  });

  it('should render \'Booking your trip...\' if bookTripFetching is false', async () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        bookTripFetching: true
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#book-trip')))
      .toBeFalsy();
    expect(fixture.debugElement.query(By.css('#book-trip-fetching')).nativeElement.innerText)
      .toBe('Booking your trip...');
  });

  it('should dispatch an action to book the trip', async () => {
    spyOn(store, 'dispatch');
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        trip: mockTrips[0],
        bookTripFetching: false
      }
    });
    fixture.detectChanges();
    component.bookTrip();
    expect(store.dispatch).toHaveBeenCalledWith(new BookTripRequest(mockTrips[0]));
  });

  it('should not dispatch an action to book the trip if a request is already fetching', () => {
    spyOn(store, 'dispatch');
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        bookTripFetching: true,
        trip: mockTrips[0]
      }
    });
    fixture.detectChanges();
    component.bookTrip();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should call bookTrip when the button is clicked', () => {
    spyOn(component, 'bookTrip');
    const button = fixture.debugElement.query(By.css('ion-button')).nativeElement;
    button.click();
    expect(component.bookTrip).toHaveBeenCalled();
  });

  it('should have the button disabled if the trip booking request is fetching', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        bookTripFetching: true
      }
    });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should have the button not disabled if the trip booking request is not fetching', () => {
    store.setState({
      ...initialState,
      search: {
        ...initialSearchState,
        bookTripFetching: false
      }
    });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button')).nativeElement;
    expect(button.disabled).toBeFalsy();
  });
});
