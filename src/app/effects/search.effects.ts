import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  SearchActionTypes,
  SaveAutocompleteResults,
  AutocompleteResultsError,
  FetchAutocompleteResults,
  FetchGeocodeOriginResult,
  FetchGeocodeDestinationResult,
  SaveGeocodeOriginResult,
  SaveGeocodeDestinationResult,
  TripSearchQuery,
  SaveTrip,
  SearchActions,
  TripSearchQueryError
} from '../actions/search.actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { AutocompleteService } from '../services/autocomplete.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { GeocodeService } from '../services/geocode.service';
import { TripService } from '../trips/trip.service';


// TODO: rename search effects?
@Injectable()
export class SearchEffects {

  @Effect()
  fetchAutocompleteResults$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchAutocompleteResults),
    map(action => action.input),
    exhaustMap(input => this.autocompleteService.getPlacePredictions$(input)),
    map(autocompleteResults => new SaveAutocompleteResults(autocompleteResults)),
    catchError(error => of(new AutocompleteResultsError(error)))
    // TODO: debounce?
  );

  @Effect()
  fetchGeocodeOriginResult$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchGeocodeOriginResult),
    map(action => action.address),
    exhaustMap(address => this.geocodeService.getLatLngFromAddress$(address)),
    map(geocodeResult => new SaveGeocodeOriginResult(geocodeResult)),
    // TODO: error?
  );

  @Effect()
  fetchGeocodeDestinationResult$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchGeocodeDestinationResult),
    map(action => action.address),
    exhaustMap(address => this.geocodeService.getLatLngFromAddress$(address)),
    map(geocodeResult => new SaveGeocodeDestinationResult(geocodeResult)),
    // TODO: error?
    // catchError(err => console.error(`error ${err}`))
  );

  @Effect()
  tripSearchQuery$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.TripSearchQuery),
    map(action => action.searchQuery),
    exhaustMap(searchQuery => this.tripService.findBestTrip(searchQuery)),
    map(trip => new SaveTrip(trip)),
    catchError(error => of(new TripSearchQueryError(error)))
  );

  constructor(
    private actions$: Actions<SearchActions>,
    private geocodeService: GeocodeService,
    private tripService: TripService,
    private autocompleteService: AutocompleteService) {}
}
