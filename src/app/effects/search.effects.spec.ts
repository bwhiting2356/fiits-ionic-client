import * as sinon from 'sinon';
import { DateUtil } from '../shared/util/util';

import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';

import { SearchEffects, SEARCH_EFFECTS_SCHEDULER, SEARCH_EFFECTS_INTERVAL } from './search.effects';
import { GeocodeService } from '../services/geocode.service';
import { TripService } from '../services/trip.service';
import {
  fetchGeocodeOriginResult,
  saveOriginLatLng,
  fetchGeocodeDestinationResult,
  saveDestinationLatLng,
  searchQuery,
  searchQuerySuccess,
  fetchAllStations,
  fetchAllStationsSuccess,
  fetchAllStationsError,
  searchQueryError,
  geocodeError,
  bookTripRequest,
  bookTripSuccess,
  bookTripFailure,
  fetchGeolocation,
  geolocationChanged,
  geolocationError,
  chooseCurrentLocationAsDestination,
  chooseCurrentLocationAsOrigin,
  chooseOriginLocation,
  chooseDestinationLocation,
  activeSearchTrue,
  activeSearchFalse,
  changeTime,
  timeInPastError,
} from '../actions/search.actions';

import { StationService } from '../services/station.service';
import { NavController } from '@ionic/angular';
import { GeolocationService } from '../services/geolocation.service';
import { mockTrips } from 'src/testing/mock-trips';
import { mockStations } from 'src/testing/mock-stations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../reducers';
import { initialState } from '../reducers';
import { Store } from '@ngrx/store';
import { fetchTrips } from '../actions/user.actions';
import { initialSearchState } from '../reducers/search.reducer';

describe('SearchEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let store: MockStore<State>;
  const now = new Date();
  let sandbox;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: GeocodeService, useValue: { getLatLngFromPlaceId$: () => {}, getAddressFromLatLng$: () => {} }},
        { provide: GeolocationService, useValue: { getCurrentPosition$: () => {}} },
        { provide: TripService, useValue: { findBestTrip: () => {}, bookTrip: () => {} }},
        { provide: StationService, useValue: { fetchAllStation$: () => {} }},
        { provide: NavController, useValue: { navigateForward: () => {}, navigateBack: () => {} }},
        { provide: SEARCH_EFFECTS_SCHEDULER, useFactory: getTestScheduler },
        { provide: SEARCH_EFFECTS_INTERVAL, useValue: 10 },
      ]
    });

    effects = TestBed.get<SearchEffects>(SearchEffects);
    store = TestBed.get<Store<State>>(Store);
    sandbox = sinon.createSandbox();
    sandbox.stub(DateUtil, 'getCurrentTime').returns(now);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return SaveStations on success', inject(
    [StationService, SearchEffects],
    async (stationService: StationService, searchEffects: SearchEffects) => {
      spyOn(stationService, 'fetchAllStation$').and.returnValue(of(mockStations));

      const action = fetchAllStations();
      actions$ = hot('--a-', { a: action });

      const completion = fetchAllStationsSuccess({ stations: mockStations });
      const expected = hot('--b', { b: completion });
      expect(searchEffects.fetchAllStation$).toBeObservable(expected);
    }
  ));

  it('should return FetchAllStationsError on error', inject(
    [StationService, SearchEffects],
    async (stationService: StationService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(stationService, 'fetchAllStation$').and.returnValue(errorResponse);

      const action = fetchAllStations();
      actions$ = hot('--a-', { a: action });

      const completion = fetchAllStationsError({ error });
      const expected = cold('--b)', { b: completion });
      expect(searchEffects.fetchAllStation$).toBeObservable(expected);
    }
  ));

  it('should return SaveGeocodingOriginResult on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getLatLngFromPlaceId$').and.returnValue(of({ lat: 0, lng: 0}));

      const action = fetchGeocodeOriginResult({ placeId: '123 Main Street' });
      actions$ = hot('--a-', { a: action });

      const completion = saveOriginLatLng({ latlng: { lat: 0, lng: 0 }});
      const expected = hot('--b', { b: completion });
      expect(searchEffects.fetchGeocodeOriginResult$).toBeObservable(expected);
  }));

  it('should return GeocodeError on origin error', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(geocodeService, 'getLatLngFromPlaceId$').and.returnValue(errorResponse);

      const action = fetchGeocodeOriginResult({ placeId: '123 Main Street' });
      actions$ = hot('--a-', { a: action });

      const completion = geocodeError({ error });
      const expected = cold('--b', { b: completion });
      expect(searchEffects.fetchGeocodeOriginResult$).toBeObservable(expected);
  }));

  it('should return SaveGeocodingDestinationResult on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getLatLngFromPlaceId$').and.returnValue(of({ lat: 0, lng: 0}));

      const action = fetchGeocodeDestinationResult({ placeId: '123 Main Street' });
      actions$ = hot('--a-', { a: action });

      const completion = saveDestinationLatLng({ latlng: { lat: 0, lng: 0 }});
      const expected = hot('--b', { b: completion });
      expect(searchEffects.fetchGeocodeDestinationResult$).toBeObservable(expected);
  }));

  it('should return geocodeError on destination error', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(geocodeService, 'getLatLngFromPlaceId$').and.returnValue(errorResponse);

      const action = fetchGeocodeDestinationResult({ placeId: '123 Main Street' });
      actions$ = hot('--a-', { a: action });

      const completion = geocodeError({ error });
      const expected = cold('--b)', { b: completion });
      expect(searchEffects.fetchGeocodeDestinationResult$).toBeObservable(expected);
  }));

  it('should return saveTrip on success, navigate to trip details', inject(
    [TripService, SearchEffects],
    async (tripService: TripService, searchEffects: SearchEffects) => {
      store.setState({
        ...initialState,
        search: {
          ...initialSearchState,
          originLatLng: { lat: 1, lng: 1 },
          originAddress: '123 Main Street',
          destinationLatLng: { lat: 0, lng: 0 },
          destinationAddress: '576 Main Street',
          timeTarget: 'ARRIVE_BY',
          time: new Date(),
        }
      });

      spyOn(tripService, 'findBestTrip').and.returnValue(of(mockTrips[0]));
      const action = searchQuery();
      actions$ = hot('--a-', { a: action });

      const completion = searchQuerySuccess({ trip: mockTrips[0] });
      const expected = hot('--b', { b: completion });
      expect(searchEffects.tripSearchQuery$).toBeObservable(expected);
  }));

  it('should return timeInPastError if the time was too far in the past', inject(
    [TripService, SearchEffects],
    async (tripService: TripService, searchEffects: SearchEffects) => {
      spyOn(searchEffects, 'dateTooFarInPast').and.returnValue(true);
      store.setState({
        ...initialState,
        search: {
          ...initialSearchState,
          originLatLng: { lat: 1, lng: 1 },
          originAddress: '123 Main Street',
          destinationLatLng: { lat: 0, lng: 0 },
          destinationAddress: '576 Main Street',
          timeTarget: 'ARRIVE_BY',
          time: new Date(),
        }
      });

      spyOn(tripService, 'findBestTrip').and.returnValue(of(mockTrips[0]));
      const action = searchQuery();
      actions$ = hot('--a-', { a: action });

      const completion = timeInPastError();
      const expected = hot('--b', { b: completion });
      expect(searchEffects.tripSearchQuery$).toBeObservable(expected);
  }));

  it('should return searchQueryError on error', inject(
    [TripService, SearchEffects],
    async (tripService: TripService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(tripService, 'findBestTrip').and.returnValue(errorResponse);
      store.setState({
        ...initialState,
        search: {
          ...initialSearchState,
          originLatLng: { lat: 1, lng: 1 },
          originAddress: '123 Main Street',
          destinationLatLng: { lat: 0, lng: 0 },
          destinationAddress: '576 Main Street',
          timeTarget: 'ARRIVE_BY',
          time: new Date(),
        }
      });

      const action = searchQuery();
      actions$ = hot('--a-', { a: action });

      const completion = searchQueryError({ error });
      const expected = cold('--b', { b: completion });
      expect(searchEffects.tripSearchQuery$).toBeObservable(expected);
  }));

  it('should return BookTripSuccess on success, navigate to /scan', inject(
    [NavController, TripService, SearchEffects],
    async (navCtrl: NavController, tripService: TripService, searchEffects: SearchEffects) => {
      spyOn(navCtrl, 'navigateBack');
      spyOn(tripService, 'bookTrip').and.returnValue(of({}));

      const action = bookTripRequest();
      actions$ = hot('a', { a: action });

      const tripCompletion = bookTripSuccess();
      const fetchTripsAction = fetchTrips();
      const expected = hot('(bc)', { b: tripCompletion, c: fetchTripsAction });
      expect(searchEffects.bookTrip$).toBeObservable(expected);
      expect(navCtrl.navigateBack).toHaveBeenCalledWith('/trips/upcoming');
  }));

  it('should return BookTripFailure on error', inject(
    [TripService, SearchEffects],
    async (tripService: TripService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(tripService, 'bookTrip').and.returnValue(errorResponse);

      const action = bookTripRequest();
      actions$ = hot('--a-', { a: action });

      const completion = bookTripFailure({ error });
      const expected = cold('--b', { b: completion });
      expect(searchEffects.bookTrip$).toBeObservable(expected);
  }));

  it('should return GeolocationChanged on success', inject(
    [GeolocationService, SearchEffects],
    async (geolocationService: GeolocationService, searchEffects: SearchEffects) => {
      spyOn(geolocationService, 'getCurrentPosition$').and.returnValue(of({ lat: 0, lng: 0 }));

      const action = fetchGeolocation();
      actions$ = hot('a', { a: action });

      const completion = geolocationChanged({ position: { lat: 0, lng: 0 }});
      searchEffects.geolocation$.subscribe(completionAction => {
        expect(completionAction).toEqual(completion);
      });
    }
  ));

  it('should return GeolocationError on error', inject(
    [GeolocationService, SearchEffects],
    async (geolocationService: GeolocationService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(geolocationService, 'getCurrentPosition$').and.returnValue(errorResponse);

      const action = fetchGeolocation();
      actions$ = cold('--a-', { a: action });

      const completion = geolocationError({ error });
      const expected = cold('--b', { b: completion });
      expect(searchEffects.geolocation$).toBeObservable(expected);
    }
  ));

  it('should return the origin address reverse geocoded on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getAddressFromLatLng$').and.returnValue(of('123 Main Street'));

      const action = chooseCurrentLocationAsOrigin({ location: { lat: 0, lng: 0 }});
      actions$ = hot('a', { a: action });

      const completion = chooseOriginLocation({ location: '123 Main Street' });
      searchEffects.originReverseGeocode$.subscribe(completionAction => {
        expect(completionAction).toEqual(completion);
      });
    }
  ));

  it('should return the geocode error from origin', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(geocodeService, 'getAddressFromLatLng$').and.returnValue(errorResponse);

      const action = chooseCurrentLocationAsOrigin({ location: { lat: 0, lng: 0 }});
      actions$ = hot('a', { a: action });

      const completion = geocodeError({ error });
      searchEffects.originReverseGeocode$.subscribe(completionAction => {
        expect(completionAction).toEqual(completion);
      });
    }
  ));

  it('should return the destination address reverse geocoded on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getAddressFromLatLng$').and.returnValue(of('123 Main Street'));

      const action = chooseCurrentLocationAsDestination({ location: { lat: 0, lng: 0 }});

      actions$ = hot('a', { a: action });

      const completion = chooseDestinationLocation({ location: '123 Main Street' });
      searchEffects.destinationReverseGeocode$.subscribe(completionAction => {
        expect(completionAction).toEqual(completion);
      });
    }
  ));

  it('should return the geocode error from destination', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(geocodeService, 'getAddressFromLatLng$').and.returnValue(errorResponse);

      const action = chooseCurrentLocationAsDestination({ location: { lat: 0, lng: 0 }});
      actions$ = hot('a', { a: action });

      const completion = geocodeError({ error });
      searchEffects.destinationReverseGeocode$.subscribe(completionAction => {
        expect(completionAction).toEqual(completion);
      });
    }
  ));

  it('should return an action to change time to the present if time is in the past', async () => {
    const dateInThePast = new Date(0);
    const newAction = effects.checkTimeIsNotPast(dateInThePast);
    expect(newAction.time).toEqual(now);
  });

  it('should return an action to change time to the same time if time is not in the past', async () => {
    const later = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10);
    const newAction = effects.checkTimeIsNotPast(later);
    expect(newAction.time).toEqual(later);
  });

  it('should dispatch an action four times to check the time and then stop when search is no longer active', async () => {
    const changeTimeAction = changeTime({ time: new Date()});
    spyOn(effects, 'checkTimeIsNotPast').and.returnValue(changeTimeAction);

    const onAction = activeSearchTrue();
    const offAction = activeSearchFalse();
    actions$ = hot('--a----b-', { a: onAction, b: offAction });

    const expected = hot('---cccc', { c: changeTimeAction });
    expect(effects.setTimeToPresent$).toBeObservable(expected);
  });

  it('should return false if the time is in the past but only less than 2 minutes', () => {
    const targetTime = DateUtil.subtractSeconds(DateUtil.getCurrentTime(), 100);
    const result = effects.dateTooFarInPast(targetTime);
    expect(result).toBeFalsy();
  });

  it('should return false if the time is in the future', () => {
    const targetTime = DateUtil.addSeconds(DateUtil.getCurrentTime(), 100);
    const result = effects.dateTooFarInPast(targetTime);
    expect(result).toBeFalsy();
  });

  it('shluld return true if the time is more than two minutes in the past', () => {
    const targetTime = DateUtil.subtractSeconds(DateUtil.getCurrentTime(), 1000 * 60 * 3);
    const result = effects.dateTooFarInPast(targetTime);
    expect(result).toBeTruthy();
  });
});
