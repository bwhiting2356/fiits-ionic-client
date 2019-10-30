import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPage } from './search.page';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { mockStations } from '../../app/trips/mock-stations';
import { State } from '../reducers';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { SetSearchAddressType, ChangeTimeTarget, ChangeTime, TripSearchQuery, FetchAllStations } from '../actions/search.actions';
import { initialSearchState } from '../reducers/search.reducer';
import { TimeTarget } from '../shared/time-target';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let store: MockStore<State>;

  const initialState = {
    search: initialSearchState
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: () => {}
          }
        },
        provideMockStore({ initialState })
    ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to fetch all stations when the component loads', () => {
    spyOn(store, 'dispatch');
    (component as any).ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchAllStations());
  });

  it('should have the list of stations', () => {
    store.setState({
      search: {
        ...initialState.search,
        stations: mockStations
      }
    });

    const expected = cold('a', { a: mockStations } );

    expect(component.stations).toBeObservable(expected);
  });

  it('should render a spinner if showSpinner is true', () => {
    component.showSpinner = of(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#spinner'))).toBeTruthy();

  })

  it('should set showSpinner true if geocoding is fetching', () => {
    store.setState({
      search: {
        ...initialState.search,
        geocodeFetching: true
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.showSpinner).toBeObservable(expected);
  });

  it('should set showSpinner true if search query is fetching', () => {
    store.setState({
      search: {
        ...initialState.search,
        searchQueryFetching: true
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.showSpinner).toBeObservable(expected);
  });

  it('should show spinner over map if stations are fetching', () => {
    store.setState({
      search: {
        ...initialState.search,
        stationsFetching: true
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.showSpinner).toBeObservable(expected);
  });

  it('should navigate to address input, set searchAddressType to \'Origin\'', () => {
    spyOn(store, 'dispatch');
    component.navigateToAddressInput('Origin');
    expect(store.dispatch)
        .toHaveBeenCalledWith(new SetSearchAddressType('Origin'));
  });

  it('should navigate to address input, set searchAddressType to \'Destination\'', () => {
    spyOn(store, 'dispatch');
    component.navigateToAddressInput('Destination');
    expect(store.dispatch)
        .toHaveBeenCalledWith(new SetSearchAddressType('Destination'));
  });

  it('should show the spinner if geocoding is fetching', async () => {
    store.setState({
      search: {
        ...initialState.search,
        geocodeFetching: true,
      }
    });
    const expected = cold('a', { a: true } );

    expect(component.showSpinner).toBeObservable(expected);
  });

  it('should show the spinner if trip search query is fetching', () => {
    store.setState({
      search: {
        ...initialState.search,
        searchQueryFetching: true,
      }
    });
    const expected = cold('a', { a: true } );

    expect(component.showSpinner).toBeObservable(expected);

  })

  it('should have rental button disabled if there is no origin', () => {
    store.setState({
      search: {
        ...initialState.search,
        originLatLng: undefined,
        destinationLatLng: { lat: 1, lng: 1}
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.rentalButtonDisabled).toBeObservable(expected);
  });

  it('should have rental button disabled if there is no destination', () => {
    store.setState({
      search: {
        ...initialState.search,
        originLatLng: { lat: 1, lng: 1},
        destinationLatLng: undefined
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.rentalButtonDisabled).toBeObservable(expected);
  });

  it('should have rental button not disabled if there are both origin and destination, no query fetching', async () => {
    store.setState({
      search: {
        ...initialState.search,
        originLatLng: { lat: 1, lng: 1},
        destinationLatLng: { lat: 1, lng: 1},
        searchQueryFetching: false
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: false } );
    expect(component.rentalButtonDisabled).toBeObservable(expected);
  });

  it('should disabled the rental button if a trip search query is fetching', async () => {
    store.setState({
      search: {
        ...initialState.search,
        originLatLng: { lat: 1, lng: 1},
        destinationLatLng: { lat: 1, lng: 1},
        searchQueryFetching: true
      }
    });
    fixture.detectChanges();
    const expected = cold('a', { a: true } );
    expect(component.rentalButtonDisabled).toBeObservable(expected);
  });

  it('should dispatch an action to change timeTarget to ARRIVE_BY', () => {
    spyOn(store, 'dispatch');
    component.timeTargetChange({ target: { value: { value: 'ARRIVE_BY' }}});
    expect(store.dispatch).toHaveBeenCalledWith(new ChangeTimeTarget('ARRIVE_BY'));
  });

  it('should dispatch an action to change timeTarget to DEPART_AT', () => {
    spyOn(store, 'dispatch');
    component.timeTargetChange({ target: { value: { value: 'DEPART_AT' }}});
    expect(store.dispatch).toHaveBeenCalledWith(new ChangeTimeTarget('DEPART_AT'));
  });

  it('should dispatch an action to change the time', () => {
    spyOn(store, 'dispatch');
    const timeString = '2018-12-31T21:00:40.000+0000';
    const date = new Date(timeString);
    component.timeChange({ target: { value: timeString }});
    expect(store.dispatch).toHaveBeenCalledWith(new ChangeTime(date));
  });

  it('should dispatch an action to send a trip search query', () => {
    store.setState({
      search: {
        ...initialSearchState,
        timeTarget: 'ARRIVE_BY' as TimeTarget,
        time: new Date('2018-12-31T21:00:40.000+0000'),
        originAddress: '123 Main Street',
        originLatLng: { lat: 0, lng: 0 },
        destinationAddress: '576 Main Street',
        destinationLatLng: { lat: 1, lng: 1 }
      }
    });
    fixture.detectChanges();
    spyOn(store, 'dispatch');
    component.findBikeRentals();
    expect(store.dispatch).toHaveBeenCalledWith(
      new TripSearchQuery({
        timeTarget: 'ARRIVE_BY' as TimeTarget,
        time: new Date('2018-12-31T21:00:40.000+0000'),
        originAddress: '123 Main Street',
        originLatLng: { lat: 0, lng: 0 },
        destinationAddress: '576 Main Street',
        destinationLatLng: { lat: 1, lng: 1 }
      })
    );
  });
});
