import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';

import { SearchEffects, SEARCH_EFFECTS_SCHEDULER, SEARCH_EFFECTS_INTERVAL } from './search.effects';
import { AutocompleteService } from '../services/autocomplete.service';
import { GeocodeService } from '../services/geocode.service';
import { TripService } from '../services/trip.service';
import {
  FetchGeocodeOriginResult,
  SaveOriginLatLng,
  FetchGeocodeDestinationResult,
  SaveDestinationLatLng,
  TripSearchQuery,
  SaveTrip,
  FetchAllStations,
  SaveStations,
  FetchAllStationsError,
  TripSearchQueryError,
  GeocodeError,
  BookTripRequest,
  BookTripSuccess,
  BookTripFailure,
  FetchGeolocation,
  GeolocationChanged,
  GeolocationError,
  ChooseCurrentLocationAsDestination,
  ChooseCurrentLocationAsOrigin,
  ChooseOriginLocation,
  ChooseDestinationLocation,
  ActiveSearchTrue,
  ActiveSearchFalse,
  ChangeTime
} from '../actions/search.actions';
import { mockAutocompleteResults } from '../../testing/mock-autocomplete-results';

import { SearchQuery } from '../shared/search-query';
import { StationService } from '../services/station.service';
import { NavController } from '@ionic/angular';
import { GeolocationService } from '../services/geolocation.service';
import { mockTrips } from 'src/testing/mock-trips';
import { mockStations } from 'src/testing/mock-stations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../reducers';
import { initialState } from '../reducers';
import { Store } from '@ngrx/store';

describe('SearchEffects success', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        {
          provide: AutocompleteService,
          useValue: {
            getPlacePredictions$: () => of(mockAutocompleteResults)
          }
        },
        {
          provide: GeocodeService,
          useValue: {
            getLatLngFromAddress$: () => of({ lat: 0, lng: 0}),
            getAddressFromLatLng$: () => of('123 Main Street')
          }
        },
        {
          provide: GeolocationService,
          useValue: {
            getCurrentPosition$: () => of({ lat: 0, lng: 0 })
          }
        },
        {
          provide: TripService,
          useValue: {
            findBestTrip: () => of(mockTrips[0]),
            bookTrip: () => of({})
          }
        },
        {
          provide: StationService,
          useValue: {
            fetchAllStation$: () => of(mockStations)
          }
        },
        {
          provide: NavController,
          useValue: {
            navigateForward: () => {}
          }
        },
        { provide: SEARCH_EFFECTS_SCHEDULER, useFactory: getTestScheduler },
        { provide: SEARCH_EFFECTS_INTERVAL, useValue: 10 },
        provideMockStore({ initialState })
      ]
    });

    effects = TestBed.get<SearchEffects>(SearchEffects);
    store = TestBed.get<Store<State>>(Store);
  });

  it('should return SaveGeocodingOritinResult on success', () => {
    const action = new FetchGeocodeOriginResult('123 Main Street');
    const completion = new SaveOriginLatLng({ lat: 0, lng: 0});
    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.fetchGeocodeOriginResult$).toBeObservable(expected);
  });

  it('should return SaveGeocodingDestinationResult on success', () => {
    const action = new FetchGeocodeDestinationResult('123 Main Street');
    const completion = new SaveDestinationLatLng({ lat: 0, lng: 0});
    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.fetchGeocodeDestinationResult$).toBeObservable(expected);
  });

  it('should return SaveTrip on success, navigate to trip details', () => {
    const seachQuery: SearchQuery = {
      originLatLng: { lat: 1, lng: 1 },
      originAddress: '123 Main Street',
      destinationLatLng: { lat: 0, lng: 0 },
      destinationAddress: '576 Main Street',
      timeTarget: 'ARRIVE_BY',
      time: new Date(),
    };
    const action = new TripSearchQuery(seachQuery);
    const completion = new SaveTrip(mockTrips[0]);
    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });

    expect(effects.tripSearchQuery$).toBeObservable(expected);
  });

  it('should return SaveTrip on success, navigate to trip details', inject(
    [NavController, SearchEffects],
    async (navCtrl: NavController, searchEffects: SearchEffects) => {
        spyOn(navCtrl, 'navigateForward');

        const seachQuery: SearchQuery = {
          originLatLng: { lat: 1, lng: 1 },
          originAddress: '123 Main Street',
          destinationLatLng: { lat: 0, lng: 0 },
          destinationAddress: '576 Main Street',
          timeTarget: 'ARRIVE_BY',
          time: new Date(),
        };
        const action = new TripSearchQuery(seachQuery);
        const completion = new SaveTrip(mockTrips[0]);
        actions$ = hot('--a-', { a: action });
        const expected = hot('--b', { b: completion });

        expect(searchEffects.tripSearchQuery$).toBeObservable(expected);
        expect(navCtrl.navigateForward).toHaveBeenCalledWith('/trip-details');
  }));

  it('should return SaveStations on success', () => {
    const action = new FetchAllStations();
    const completion = new SaveStations(mockStations);

    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.fetchAllStation$).toBeObservable(expected);
  });

  it('should return success response from booking a trip', () => {
    const action = new BookTripRequest(mockTrips[0], 'mock-uid');
    const completion = new BookTripSuccess();

    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.bookTrip$).toBeObservable(expected);
  });

  it('should return GeolocationChanged on success', async () => {
    const action = new FetchGeolocation();
    const completion = new GeolocationChanged({ lat: 0, lng: 0 });

    actions$ = hot('a', { a: action });
    effects.geolocation$.subscribe(completionAction => {
      expect(completionAction).toEqual(completion);
    });
  });

  it('should return the origin address reverse geocoded on success', async () => {
    const action = new ChooseCurrentLocationAsOrigin({ lat: 0, lng: 0 });
    const completion = new ChooseOriginLocation('123 Main Street');
    actions$ = hot('a', { a: action });
    effects.originReverseGeocode$.subscribe(completionAction => {
      expect(completionAction).toEqual(completion);
    });
  });

  it('should return the destination address reverse geocoded on success', async () => {
    const action = new ChooseCurrentLocationAsDestination({ lat: 0, lng: 0 });
    const completion = new ChooseDestinationLocation('123 Main Street');
    actions$ = hot('a', { a: action });
    effects.destinationReverseGeocode$.subscribe(completionAction => {
      expect(completionAction).toEqual(completion);
    });
  });

  it('should return an action to change time to the present if time is in the past', () => {
    const dateInThePast = new Date(0);
    const newAction = effects.checkTimeIsNotPast(dateInThePast);
    expect(newAction.time).toEqual(new Date());
  });

  it('should return an action to change time to the same time if time is not in the past', () => {
    const later = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10);
    const newAction = effects.checkTimeIsNotPast(later);
    expect(newAction.time).toEqual(later);
  });

  it('should dispatch an action four times to check the time and then stop when search is no longer active', async () => {
    const onAction = new ActiveSearchTrue();
    const offAction = new ActiveSearchFalse();
    const changeTime = new ChangeTime(new Date());
    spyOn(effects, 'checkTimeIsNotPast').and.returnValue(changeTime);

    actions$ = hot('--a----b-', { a: onAction, b: offAction });

    const expected = hot('---cccc', { c: changeTime });
    expect(effects.setTimeToPresent$).toBeObservable(expected);
  });
});

describe('SearchEffects errors', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let store: MockStore<State>;
  const error = new Error();

  beforeEach(() => {
    const errorResponse = cold('#|', {}, error);

    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        {
          provide: AutocompleteService,
          useValue: {
            getPlacePredictions$: () => errorResponse
          }
        },
        {
          provide: GeocodeService,
          useValue: {
            getLatLngFromAddress$: () => errorResponse,
            getAddressFromLatLng$: () => errorResponse
          }
        },
        {
          provide: GeolocationService,
          useValue: {
            getCurrentPosition$: () => errorResponse
          }
        },
        {
          provide: TripService,
          useValue: {
            findBestTrip: () => errorResponse,
            bookTrip: () => errorResponse
          }
        },
        {
          provide: StationService,
          useValue: {
            fetchAllStation$: () => errorResponse
          }
        },
        {
          provide: NavController,
          useValue: {
            navigateForward: () => {}
          }
        },
        provideMockStore({ initialState })
      ]
    });

    effects = TestBed.get<SearchEffects>(SearchEffects);
    store = TestBed.get<Store<State>>(Store);
  });

  it('should return FetchAllStationsError on error', () => {
    const action = new FetchAllStations();
    const completion = new FetchAllStationsError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b)', { b: completion });
    expect(effects.fetchAllStation$).toBeObservable(expected);
  });

  it('should return GeocodeError on origin error', () => {
    const action = new FetchGeocodeOriginResult('123 Main Street');
    const completion = new GeocodeError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expect(effects.fetchGeocodeOriginResult$).toBeObservable(expected);
  });

  it('should return GeocodeError on destination error', () => {
    const action = new FetchGeocodeDestinationResult('123 Main Street');
    const completion = new GeocodeError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b)', { b: completion });
    expect(effects.fetchGeocodeDestinationResult$).toBeObservable(expected);
  });

  it('should return TripSearchQueryError on error', () => {
    const seachQuery: SearchQuery = {
      originLatLng: { lat: 1, lng: 1 },
      originAddress: '123 Main Street',
      destinationLatLng: { lat: 0, lng: 0 },
      destinationAddress: '576 Main Street',
      timeTarget: 'ARRIVE_BY',
      time: new Date(),
    };
    const action = new TripSearchQuery(seachQuery);
    const completion = new TripSearchQueryError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expect(effects.tripSearchQuery$).toBeObservable(expected);
  });

  it('should return BookTripFailure on error', () => {
    const action = new BookTripRequest(mockTrips[0], 'mock-uid');
    const completion = new BookTripFailure(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expect(effects.bookTrip$).toBeObservable(expected);
  });

  it('should return GeolocationError on error', () => {
    const action = new FetchGeolocation();
    const completion = new GeolocationError(error);

    actions$ = cold('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expect(effects.geolocation$).toBeObservable(expected);
  });

  it('should return GeocodeError on reverse geocoding error (destination)', () => {
    const action = new ChooseCurrentLocationAsDestination({ lat: 0, lng: 0 });
    const completion = new GeocodeError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b)', { b: completion });
    expect(effects.destinationReverseGeocode$).toBeObservable(expected);
  });

  it('should return GeocodeError on reverse geocoding error (origin)', () => {
    const action = new ChooseCurrentLocationAsOrigin({ lat: 0, lng: 0 });
    const completion = new GeocodeError(error);
    actions$ = hot('--a-', { a: action });
    const expected = cold('--b)', { b: completion });
    expect(effects.originReverseGeocode$).toBeObservable(expected);
  });
});
