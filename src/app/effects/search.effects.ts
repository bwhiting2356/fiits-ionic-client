import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  SearchActionTypes,
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
  ChooseOriginLocation,
  ChooseDestinationLocation,
  ChangeTime
} from '../actions/search.actions';
import { map, catchError, tap, switchMap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { Observable, of, interval, SchedulerLike } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { GeocodeService } from '../services/geocode.service';
import { TripService } from '../services/trip.service';
import { StationService } from '../services/station.service';
import { NavController } from '@ionic/angular';
import { GeolocationService } from '../services/geolocation.service';
import { State } from '../reducers';
import { selectSearchTime, selectTrip } from '../reducers/search.reducer';
import { async } from 'rxjs/internal/scheduler/async';
import { FetchTrips } from '../actions/user.actions';
import { selectUID } from '../reducers/user.reducer';

const ONE_MINUTE = 60 * 1000;

export const SEARCH_EFFECTS_INTERVAL = new InjectionToken<number>('Test Interval');
export const SEARCH_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('SearchEffects Scheduler');

@Injectable()
export class SearchEffects {

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

  @Effect() // TODO: should this be in user effects?
  bookTrip$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.BookTripRequest),
    withLatestFrom(this.store.select(selectUID), this.store.select(selectTrip)),
    switchMap(([_, uid, trip]) => this.tripService.bookTrip(trip, uid).pipe(
      tap(() => this.navCtrl.navigateBack('/trips/upcoming')),
      switchMap(() => [new BookTripSuccess(), new FetchTrips()]),
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
    ofType(SearchActionTypes.ChooseCurrentLocationAsOrigin),
    switchMap(action => this.geocodeService.getAddressFromLatLng$(action.location).pipe(
      map(address => new ChooseOriginLocation(address)),
      catchError(error => of(new GeocodeError(error)))
    ))
  );

  @Effect()
  destinationReverseGeocode$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.ChooseCurrentLocationAsDestination),
    switchMap(action => this.geocodeService.getAddressFromLatLng$(action.location).pipe(
      map(address => new ChooseDestinationLocation(address)),
      catchError(error => of(new GeocodeError(error)))
    ))
  );

  @Effect()
  setTimeToPresent$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActionTypes.ActiveSearchTrue),
    switchMap(() => interval(this.timerInterval || ONE_MINUTE, this.scheduler || async).pipe(
      takeUntil(
        this.actions$.pipe(ofType(SearchActionTypes.ActiveSearchFalse))
      ),
      withLatestFrom(this.store.select(selectSearchTime)),
      map(([_, time]) => this.checkTimeIsNotPast(time)))
    )
  );

  getCurrentTime = () => new Date();

  checkTimeIsNotPast(time: Date) {
    const currentTime = this.getCurrentTime();
    if (time < currentTime) {
      return new ChangeTime(currentTime);
    } else {
      return new ChangeTime(time);
    }
  }

  constructor(
    private store: Store<State>,
    private actions$: Actions<SearchActions>,
    private geocodeService: GeocodeService,
    private geolocationService: GeolocationService,
    private tripService: TripService,
    private stationService: StationService,
    private navCtrl: NavController,

    @Optional()
    @Inject(SEARCH_EFFECTS_INTERVAL)
    private timerInterval: number,

    @Optional()
    @Inject(SEARCH_EFFECTS_SCHEDULER)
    private scheduler: SchedulerLike) {}
}
