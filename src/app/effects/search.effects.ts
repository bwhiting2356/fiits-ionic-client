import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  SearchActionTypes,
  SaveAutocompleteResults,
  AutocompleteResultsError,
  SaveOriginLatLng,
  SaveDestinationLatLng,
  SaveTrip,
  SearchActions,
  TripSearchQueryError,
  SaveStations,
  FetchAllStationsError,
  GeocodeError,
  BookTripSuccess,
  BookTripFailure,
  GeolocationChanged,
  GeolocationError,
  ChooseOriginLocation
} from '../actions/search.actions';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { AutocompleteService } from '../services/autocomplete.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { GeocodeService } from '../services/geocode.service';
import { TripService } from '../services/trip.service';
import { StationService } from '../services/station.service';
import { NavController } from '@ionic/angular';
import { GeolocationService } from '../services/geolocation.service';

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

  @Effect()
  bookTrip$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.BookTripRequest),
    switchMap(action => this.tripService.bookTrip(action.trip).pipe(
      map(() => new BookTripSuccess()),
      catchError(error => of(new BookTripFailure(error)))
    ))
  );

  @Effect()
  geolocation$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.FetchGeolocation),
    switchMap(() => this.geolocationService.getCurrentPosition$().pipe(
      map(position => new GeolocationChanged(position)),
      catchError(error => of(new GeolocationError(error)))
    ))
  );

  @Effect()
  originReverseGeocode$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.ChooseCurrentLocation),
    switchMap(action => this.geocodeService.getAddressFromLatLng$(action.location).pipe(
      map(address => new ChooseOriginLocation(address)),
      catchError(error => of(new GeocodeError(error)))
    ))
  );

  constructor(
    private actions$: Actions<SearchActions>,
    private geocodeService: GeocodeService,
    private geolocationService: GeolocationService,
    private tripService: TripService,
    private stationService: StationService,
    private autocompleteService: AutocompleteService,
    private navCtrl: NavController) {}
}
