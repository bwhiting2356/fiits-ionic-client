import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  SearchActionTypes,
  SaveAutocompleteResults,
  AutocompleteResultsError,
  FetchAutocompleteResults,
  FetchGeocodeOriginResult,
  FetchGeocodeDestinationResult,
  SaveOriginLatLng,
  SaveDestinationLatLng,
  TripSearchQuery,
  SaveTrip,
  SearchActions,
  TripSearchQueryError,
  SaveStations,
  FetchAllStationsError,
  GeocodeError
} from '../actions/search.actions';
import { exhaustMap, map, catchError, tap, switchMap, mergeMap } from 'rxjs/operators';
import { AutocompleteService } from '../services/autocomplete.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { GeocodeService } from '../services/geocode.service';
import { TripService } from '../trips/trip.service';
import { StationService } from '../services/station.service';
import { NavController } from '@ionic/angular';

@Injectable()
export class SearchEffects {

  @Effect()
  fetchAutocompleteResults$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchAutocompleteResults),
    map(action => action.input),
    switchMap(input => this.autocompleteService.getPlacePredictions$(input).pipe(
      map(autocompleteResults => new SaveAutocompleteResults(autocompleteResults)),
      catchError(error => of(new AutocompleteResultsError(error)))
    ))
  );

  @Effect()
  fetchGeocodeOriginResult$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchGeocodeOriginResult),
    map(action => action.address),
    switchMap(address => this.geocodeService.getLatLngFromAddress$(address).pipe(
      map(geocodeResult => new SaveOriginLatLng(geocodeResult)),
      catchError(error => of(new GeocodeError(error)))
    ))
  );

  @Effect()
  fetchGeocodeDestinationResult$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchGeocodeDestinationResult),
    map(action => action.address),
    switchMap(address => this.geocodeService.getLatLngFromAddress$(address).pipe(
      map(geocodeResult => new SaveDestinationLatLng(geocodeResult)),
      catchError(error => of(new GeocodeError(error)))
    ))
  );

  @Effect()
  tripSearchQuery$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.TripSearchQuery),
    map(action => action.searchQuery),
    switchMap(searchQuery => this.tripService.findBestTrip(searchQuery).pipe(
      tap(() => this.navCtrl.navigateForward('/trip-details')),
      map(trip => new SaveTrip(trip)),
      catchError(error => of(new TripSearchQueryError(error)))
    ))
  );

  @Effect()
  fetchAllStation$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchAllStations),
    switchMap(() => this.stationService.fetchAllStation$().pipe(
      map(stations => new SaveStations(stations)),
      catchError(error => of(new FetchAllStationsError(error)))
    ))
  );

  constructor(
    private actions$: Actions<SearchActions>,
    private geocodeService: GeocodeService,
    private tripService: TripService,
    private stationService: StationService,
    private autocompleteService: AutocompleteService,
    private navCtrl: NavController) {}
}
