import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import {
  saveOriginLatLng,
  saveDestinationLatLng,
  searchQuerySuccess,
  searchQueryError,
  fetchAllStationsSuccess,
  fetchAllStationsError,
  geocodeError,
  bookTripSuccess,
  bookTripFailure,
  geolocationChanged,
  geolocationError,
  chooseOriginLocation,
  chooseDestinationLocation,
  changeTime,
  fetchGeocodeOriginResult,
  fetchGeocodeDestinationResult,
  searchQuery,
  fetchAllStations,
  bookTripRequest,
  fetchGeolocation,
  chooseCurrentLocationAsOrigin,
  chooseCurrentLocationAsDestination,
  activeSearchTrue,
  activeSearchFalse,
  timeInPastError
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
import { selectSearchTime, selectTrip, selectSearchParams } from '../reducers/search.reducer';
import { async } from 'rxjs/internal/scheduler/async';
import { fetchTrips } from '../actions/user.actions';
import { selectUID } from '../reducers/user.reducer';
import { DateUtil } from '../shared/util/util';

const ONE_MINUTE = 60 * 1000;

export const SEARCH_EFFECTS_INTERVAL = new InjectionToken<number>('Test Interval');
export const SEARCH_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('SearchEffects Scheduler');

@Injectable()
export class SearchEffects {

  constructor(
    private store: Store<State>,
    private actions$: Actions<Action>,
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

  fetchGeocodeOriginResult$ = createEffect(() => this.actions$.pipe(
    ofType(fetchGeocodeOriginResult),
    map(action => action.placeId),
    switchMap(placeId => this.geocodeService.getLatLngFromPlaceId$(placeId).pipe(
      map(latlng => saveOriginLatLng({ latlng })),
      catchError(error => of(geocodeError({ error })))
    ))
  ));

  fetchGeocodeDestinationResult$ = createEffect(() => this.actions$.pipe(
    ofType(fetchGeocodeDestinationResult),
    map(action => action.placeId),
    switchMap(placeId => this.geocodeService.getLatLngFromPlaceId$(placeId).pipe(
      map(latlng => saveDestinationLatLng({ latlng })),
      catchError(error => of(geocodeError({ error })))
    ))
  ));

  tripSearchQuery$ = createEffect(() => this.actions$.pipe(
    ofType(searchQuery),
    withLatestFrom(this.store.select(selectSearchParams)),
    switchMap(([_, query]) => {
      if (this.dateTooFarInPast(query.time)) {
        return of(timeInPastError());
      }
      return this.tripService.findBestTrip(query).pipe(
        tap(() => this.navCtrl.navigateForward('/trip-details')),
        map(trip => searchQuerySuccess({ trip })),
        catchError(error => of(searchQueryError({ error })))
      );
    })
  ));

  fetchAllStation$ = createEffect(() => this.actions$.pipe(
    ofType(fetchAllStations),
    switchMap(() => this.stationService.fetchAllStation$().pipe(
      map(stations => fetchAllStationsSuccess({ stations })),
      catchError(error => of(fetchAllStationsError({ error })))
    ))
  ));

  // TODO: should this be in user effects?
  bookTrip$ = createEffect(() => this.actions$.pipe(
    ofType(bookTripRequest),
    withLatestFrom(this.store.select(selectUID), this.store.select(selectTrip)),
    switchMap(([_, uid, trip]) => this.tripService.bookTrip(trip, uid).pipe(
      tap(() => this.navCtrl.navigateBack('/trips/upcoming')),
      switchMap(() => [bookTripSuccess(), fetchTrips()]),
      catchError(error => of(bookTripFailure({ error })))
    ))
  ));

  geolocation$ = createEffect(() => this.actions$.pipe(
    ofType(fetchGeolocation),
    switchMap(() => this.geolocationService.getCurrentPosition$().pipe(
      map(position => geolocationChanged({ position })),
      catchError(error => of(geolocationError({ error })))
    ))
  ));

  originReverseGeocode$ = createEffect(() => this.actions$.pipe(
    ofType(chooseCurrentLocationAsOrigin),
    switchMap(action => this.geocodeService.getAddressFromLatLng$(action.location).pipe(
      map(location => chooseOriginLocation({ location })),
      catchError(error => of(geocodeError({ error })))
    ))
  ));

  destinationReverseGeocode$ = createEffect(() => this.actions$.pipe(
    ofType(chooseCurrentLocationAsDestination),
    switchMap(action => this.geocodeService.getAddressFromLatLng$(action.location).pipe(
      map(location => chooseDestinationLocation({ location })),
      catchError(error => of(geocodeError({ error })))
    ))
  ));

  setTimeToPresent$ = createEffect(() => this.actions$.pipe(
    ofType(activeSearchTrue),
    switchMap(() => interval(this.timerInterval || ONE_MINUTE, this.scheduler || async).pipe(
      takeUntil(
        this.actions$.pipe(ofType(activeSearchFalse))
      ),
      withLatestFrom(this.store.select(selectSearchTime)),
      map(([_, time]) => this.checkTimeIsNotPast(time)))
    )
  ));


/*

it('should dispatch a message to show a toast saying the time must be in the future, not search for the trip', () => {
    store.setState({
      ...initialState,
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
    expect(store.dispatch).toHaveBeenCalledWith(timeInPastError());
    expect(store.dispatch).not.toHaveBeenCalledWith(searchQuery());
  });

*/


    // switchMap(([_, query]) => this.tripService.findBestTrip(query).pipe(
    //   tap(() => this.navCtrl.navigateForward('/trip-details')),
    //   map(trip => searchQuerySuccess({ trip })),
    //   catchError(error => of(searchQueryError({ error })))
    // ))

    /*
      // const twoMinutesAgo = new Date(Date.now() - 1000 * 60 * 2);
      // if (query.time < twoMinutesAgo) {
      //   this.store.dispatch(timeInPastError());
      // } else {


    */

  dateTooFarInPast(time) {
      const twoMinutesAgo = DateUtil.subtractSeconds(DateUtil.getCurrentTime(), 1000 * 60 * 2);
      return time < twoMinutesAgo;
  }

  checkTimeIsNotPast(time: Date) {
    const currentTime = DateUtil.getCurrentTime();
    if (time < currentTime) {
      return changeTime({ time: currentTime });
    } else {
      return changeTime({ time });
    }
  }
}
