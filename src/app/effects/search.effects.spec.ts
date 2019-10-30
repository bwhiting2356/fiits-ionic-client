import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { hot } from 'jasmine-marbles';

import { SearchEffects } from './search.effects';
import { AutocompleteService } from '../services/autocomplete.service';
import { GeocodeService } from '../services/geocode.service';
import { TripService } from '../trips/trip.service';
import {
  FetchAutocompleteResults,
  SaveAutocompleteResults,
  FetchGeocodeOriginResult,
  SaveOriginLatLng,
  FetchGeocodeDestinationResult,
  SaveDestinationLatLng,
  TripSearchQuery,
  SaveTrip,
  FetchAllStations,
  SaveStations
} from '../actions/search.actions';
import { mockAutocompleteResults } from '../shared/maps/mock-autocomplete-results';
import { mockTrips } from '../../app/trips/mock-trips';
import { mockStations } from '../../app/trips/mock-stations';
import { SearchQuery } from '../shared/search-query';
import { StationService } from '../services/station.service';

describe('SearchEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;

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
            getLatLngFromAddress$: () => of({ lat: 0, lng: 0})
          }
        },
        {
          provide: TripService,
          useValue: {
            findBestTrip: () => of(mockTrips[0])
          }
        },
        {
          provide: StationService,
          useValue: {
            fetchAllStation$: () => of(mockStations)
          }
        }
      ]
    });

    effects = TestBed.get<SearchEffects>(SearchEffects);
  });

  it('should return SaveAutocompleteResults on success', () => {
    const action = new FetchAutocompleteResults('123 Main Street');
    const completion = new SaveAutocompleteResults(mockAutocompleteResults);
    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.fetchAutocompleteResults$).toBeObservable(expected);
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

  it('should return SaveTrip on success', () => {
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

  it('should return SaveStations on success', () => {
    const action = new FetchAllStations();
    const completion = new SaveStations(mockStations);

    actions$ = hot('--a-', { a: action });
    const expected = hot('--b', { b: completion });
    expect(effects.fetchAllStation$).toBeObservable(expected);

  })

  // it('should return SearchQuery error on error', () => {
  //   const action
  // })
});
