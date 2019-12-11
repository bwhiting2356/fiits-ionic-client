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

import { SearchQuery } from '../shared/search-query.model';
import { StationService } from '../services/station.service';
import { NavController } from '@ionic/angular';
import { GeolocationService } from '../services/geolocation.service';
import { mockTrips } from 'src/testing/mock-trips';
import { mockStations } from 'src/testing/mock-stations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../reducers';
import { initialState } from '../reducers';
import { Store } from '@ngrx/store';
import { FetchTrips } from '../actions/user.actions';



describe('SearchEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: GeocodeService, useValue: { getLatLngFromAddress$: () => {}, getAddressFromLatLng$: () => {} }},
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
  });

  it('should return SaveStations on success', inject(
    [StationService, SearchEffects],
    async (stationService: StationService, searchEffects: SearchEffects) => {
      spyOn(stationService, 'fetchAllStation$').and.returnValue(of(mockStations));

      const action = new FetchAllStations();
      actions$ = hot('--a-', { a: action });

      const completion = new SaveStations(mockStations);
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

      const action = new FetchAllStations();
      actions$ = hot('--a-', { a: action });

      const completion = new FetchAllStationsError(error);
      const expected = cold('--b)', { b: completion });
      expect(searchEffects.fetchAllStation$).toBeObservable(expected);
    }
  ));

  it('should return SaveGeocodingOriginResult on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getLatLngFromAddress$').and.returnValue(of({ lat: 0, lng: 0}));

      const action = new FetchGeocodeOriginResult('123 Main Street');
      actions$ = hot('--a-', { a: action });

      const completion = new SaveOriginLatLng({ lat: 0, lng: 0});
      const expected = hot('--b', { b: completion });
      expect(searchEffects.fetchGeocodeOriginResult$).toBeObservable(expected);
  }));

  it('should return GeocodeError on origin error', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(geocodeService, 'getLatLngFromAddress$').and.returnValue(errorResponse);

      const action = new FetchGeocodeOriginResult('123 Main Street');
      actions$ = hot('--a-', { a: action });

      const completion = new GeocodeError(error);
      const expected = cold('--b', { b: completion });
      expect(searchEffects.fetchGeocodeOriginResult$).toBeObservable(expected);
  }));

  it('should return SaveGeocodingDestinationResult on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getLatLngFromAddress$').and.returnValue(of({ lat: 0, lng: 0}));

      const action = new FetchGeocodeDestinationResult('123 Main Street');
      actions$ = hot('--a-', { a: action });

      const completion = new SaveDestinationLatLng({ lat: 0, lng: 0});
      const expected = hot('--b', { b: completion });
      expect(searchEffects.fetchGeocodeDestinationResult$).toBeObservable(expected);
  }));

  it('should return GeocodeError on destination error', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(geocodeService, 'getLatLngFromAddress$').and.returnValue(errorResponse);

      const action = new FetchGeocodeDestinationResult('123 Main Street');
      actions$ = hot('--a-', { a: action });

      const completion = new GeocodeError(error);
      const expected = cold('--b)', { b: completion });
      expect(searchEffects.fetchGeocodeDestinationResult$).toBeObservable(expected);
  }));

  it('should return SaveTrip on success, navigate to trip details', inject(
    [TripService, SearchEffects],
    async (tripService: TripService, searchEffects: SearchEffects) => {
      spyOn(tripService, 'findBestTrip').and.returnValue(of(mockTrips[0]));

      const seachQuery: SearchQuery = {
        originLatLng: { lat: 1, lng: 1 },
        originAddress: '123 Main Street',
        destinationLatLng: { lat: 0, lng: 0 },
        destinationAddress: '576 Main Street',
        timeTarget: 'ARRIVE_BY',
        time: new Date(),
      };

      const action = new TripSearchQuery(seachQuery);
      actions$ = hot('--a-', { a: action });

      const completion = new SaveTrip(mockTrips[0]);
      const expected = hot('--b', { b: completion });
      expect(searchEffects.tripSearchQuery$).toBeObservable(expected);
  }));

  it('should return TripSearchQueryError on error', inject(
    [TripService, SearchEffects],
    async (tripService: TripService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(tripService, 'findBestTrip').and.returnValue(errorResponse);
      const seachQuery: SearchQuery = {
        originLatLng: { lat: 1, lng: 1 },
        originAddress: '123 Main Street',
        destinationLatLng: { lat: 0, lng: 0 },
        destinationAddress: '576 Main Street',
        timeTarget: 'ARRIVE_BY',
        time: new Date(),
      };

      const action = new TripSearchQuery(seachQuery);
      actions$ = hot('--a-', { a: action });

      const completion = new TripSearchQueryError(error);
      const expected = cold('--b', { b: completion });
      expect(searchEffects.tripSearchQuery$).toBeObservable(expected);
  }));

  it('should return BookTripSuccess on success, navigate to /scan', inject(
    [NavController, TripService, SearchEffects],
    async (navCtrl: NavController, tripService: TripService, searchEffects: SearchEffects) => {
      spyOn(navCtrl, 'navigateBack');
      spyOn(tripService, 'bookTrip').and.returnValue(of({}));

      const action = new BookTripRequest();
      actions$ = hot('a', { a: action });

      const tripCompletion = new BookTripSuccess();
      const fetchTrips = new FetchTrips();
      const expected = hot('(bc)', { b: tripCompletion, c: fetchTrips });
      expect(searchEffects.bookTrip$).toBeObservable(expected);
      expect(navCtrl.navigateBack).toHaveBeenCalledWith('/trips/upcoming');
  }));

  it('should return BookTripFailure on error', inject(
    [TripService, SearchEffects],
    async (tripService: TripService, searchEffects: SearchEffects) => {
      const error = new Error();
      const errorResponse = cold('#|', {}, error);
      spyOn(tripService, 'bookTrip').and.returnValue(errorResponse);

      const action = new BookTripRequest();
      actions$ = hot('--a-', { a: action });

      const completion = new BookTripFailure(error);
      const expected = cold('--b', { b: completion });
      expect(searchEffects.bookTrip$).toBeObservable(expected);
  }));

  it('should return GeolocationChanged on success', inject(
    [GeolocationService, SearchEffects],
    async (geolocationService: GeolocationService, searchEffects: SearchEffects) => {
      spyOn(geolocationService, 'getCurrentPosition$').and.returnValue(of({ lat: 0, lng: 0 }));

      const action = new FetchGeolocation();
      actions$ = hot('a', { a: action });

      const completion = new GeolocationChanged({ lat: 0, lng: 0 });
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

      const action = new FetchGeolocation();
      actions$ = cold('--a-', { a: action });

      const completion = new GeolocationError(error);
      const expected = cold('--b', { b: completion });
      expect(searchEffects.geolocation$).toBeObservable(expected);
    }
  ));

  it('should return the origin address reverse geocoded on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getAddressFromLatLng$').and.returnValue(of('123 Main Street'));

      const action = new ChooseCurrentLocationAsOrigin({ lat: 0, lng: 0 });
      actions$ = hot('a', { a: action });

      const completion = new ChooseOriginLocation('123 Main Street');
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

      const action = new ChooseCurrentLocationAsOrigin({ lat: 0, lng: 0 });
      actions$ = hot('a', { a: action });

      const completion = new GeocodeError(error);
      searchEffects.originReverseGeocode$.subscribe(completionAction => {
        expect(completionAction).toEqual(completion);
      });
    }
  ));

  it('should return the destination address reverse geocoded on success', inject(
    [GeocodeService, SearchEffects],
    async (geocodeService: GeocodeService, searchEffects: SearchEffects) => {
      spyOn(geocodeService, 'getAddressFromLatLng$').and.returnValue(of('123 Main Street'));

      const action = new ChooseCurrentLocationAsDestination({ lat: 0, lng: 0 });

      actions$ = hot('a', { a: action });

      const completion = new ChooseDestinationLocation('123 Main Street');
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

      const action = new ChooseCurrentLocationAsDestination({ lat: 0, lng: 0 });
      actions$ = hot('a', { a: action });

      const completion = new GeocodeError(error);
      searchEffects.destinationReverseGeocode$.subscribe(completionAction => {
        expect(completionAction).toEqual(completion);
      });
    }
  ));

  it('should return an action to change time to the present if time is in the past', async () => {
    const now = new Date();
    sinon.stub(DateUtil, 'getCurrentTime').returns(now);
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
    const changeTime = new ChangeTime(new Date());
    spyOn(effects, 'checkTimeIsNotPast').and.returnValue(changeTime);

    const onAction = new ActiveSearchTrue();
    const offAction = new ActiveSearchFalse();
    actions$ = hot('--a----b-', { a: onAction, b: offAction });

    const expected = hot('---cccc', { c: changeTime });
    expect(effects.setTimeToPresent$).toBeObservable(expected);
  });
});
