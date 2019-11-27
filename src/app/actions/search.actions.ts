import { Action } from '@ngrx/store';
import { AutocompleteResult } from '../shared/maps/autocomplete-result';
import { LatLng } from '../shared/latlng.model';
import { SearchQuery } from '../shared/search-query';
import { TimeTarget } from '../shared/time-target';
import { Trip, StationInfo } from '../shared/trip.model';

export enum SearchActionTypes {
  AutocompleteResultsError = '[Search] Autocomplete Results Error',
  AutocompleteDirty = '[Search] Autocomplete Dirty',
  BookTripRequest = '[Search] Book Trip Request',
  BookTripSuccess = '[Search] Book Trip Success',
  BookTripFailure = '[Search] Book Trip Failure',
  ChangeTime = '[Search] Change Time',
  ChangeTimeTarget = '[Search] Change Time Target',
  ChooseCurrentLocationAsDestination = '[Search] Choose Current Location As Destination',
  ChooseCurrentLocationAsOrigin = '[Search] Choose Current Location As Origin',
  ChooseOriginLocation = '[Search] Choose Origin Location',
  ChooseDestinationLocation = '[Search] Choose Destination Location',
  ClearAutocompleteResults = '[Search] Clear Autocomplete Results',
  FetchAllStations = '[Search] Fetch All Stations',
  FetchAllStationsError = '[Search] Fetch All Stations Error',
  FetchAutocompleteResults = '[Search] Fetch Autocomplete Results',
  FetchGeocodeOriginResult = '[Search] Fetch Geocode Origin Result',
  FetchGeocodeDestinationResult = '[Search] Fetch Geocode Destination Result',
  FetchGeolocation = '[Search] Fetch Geolocation',
  GeocodeError = '[Search] Geocode Error',
  GeolocationChanged = '[Search] Geolocation Changed',
  GeolocationError = '[Search] Geolocation Error',
  SaveAutocompleteResults = '[Search] Save Autocomplete Results',
  SaveOriginLatLng = '[Search] Save Origin LatLng',
  SaveDestinationLatLng = '[Search] Save Destination LatLng',
  SaveStations = '[Search] Save Stations',
  SaveTrip = '[Search] Save Trip',
  SetSearchAddressType = '[Search] Set Search Address Type',
  TimeInPastError = '[Search] Time In Past Error',
  TripSearchQuery = '[Search] Trip Search Query',
  TripSearchQueryError = '[Search] Trip Search Query Error',
}

export type SearchAddressType = 'Origin' | 'Destination';

export class BookTripRequest implements Action {
  readonly type = SearchActionTypes.BookTripRequest;
  constructor(public trip: Trip, public uid: string) {}
}

export class BookTripSuccess implements Action {
  readonly type = SearchActionTypes.BookTripSuccess;
}

export class BookTripFailure implements Action {
  readonly type = SearchActionTypes.BookTripFailure;
  constructor(public error: any) {}
}

export class ChangeTime implements Action {
  readonly type = SearchActionTypes.ChangeTime;
  constructor(public time: Date) {}
}

export class ChangeTimeTarget implements Action {
  readonly type = SearchActionTypes.ChangeTimeTarget;
  constructor(public timeTarget: TimeTarget) {}
}

export class ChooseCurrentLocationAsDestination implements Action {
  readonly type = SearchActionTypes.ChooseCurrentLocationAsDestination;
  constructor(public location: LatLng) {}
}

export class ChooseCurrentLocationAsOrigin implements Action {
  readonly type = SearchActionTypes.ChooseCurrentLocationAsOrigin;
  constructor(public location: LatLng) {}
}

export class ChooseOriginLocation implements Action {
  readonly type = SearchActionTypes.ChooseOriginLocation;
  constructor(public location: string) {}
}

export class ChooseDestinationLocation implements Action {
  readonly type = SearchActionTypes.ChooseDestinationLocation;
  constructor(public location: string) {}
}

export class FetchAllStations implements Action {
  readonly type = SearchActionTypes.FetchAllStations;
}

export class FetchAllStationsError implements Action {
  readonly type = SearchActionTypes.FetchAllStationsError;
  constructor(public error: any) {}
}

export class FetchGeocodeOriginResult implements Action {
  readonly type = SearchActionTypes.FetchGeocodeOriginResult;
  constructor(public address: string) {}
}

export class FetchGeocodeDestinationResult implements Action {
  readonly type = SearchActionTypes.FetchGeocodeDestinationResult;
  constructor(public address: string) {}
}

export class FetchGeolocation implements Action {
  readonly type = SearchActionTypes.FetchGeolocation;
}

export class GeocodeError implements Action {
  readonly type = SearchActionTypes.GeocodeError;
  constructor(public error: any) {}
}

export class GeolocationChanged implements Action {
  readonly type = SearchActionTypes.GeolocationChanged;
  constructor(public position: LatLng) {}
}

export class GeolocationError implements Action {
  readonly type = SearchActionTypes.GeolocationError;
  constructor(public error: any) {}
}

export class SaveOriginLatLng implements Action {
  readonly type = SearchActionTypes.SaveOriginLatLng;
  constructor(public latlng: LatLng) {}
}

export class SaveDestinationLatLng implements Action {
  readonly type = SearchActionTypes.SaveDestinationLatLng;
  constructor(public latlng: LatLng) {}
}

export class SaveStations implements Action {
  readonly type = SearchActionTypes.SaveStations;
  constructor(public stations: StationInfo[]) {}
}

export class SaveTrip implements Action {
  readonly type = SearchActionTypes.SaveTrip;
  constructor(public trip: Trip) {}
}

export class SetSearchAddressType implements Action {
  readonly type = SearchActionTypes.SetSearchAddressType;
  constructor(public addressType: SearchAddressType) {}
}

export class TimeInPastError implements Action {
  readonly type = SearchActionTypes.TimeInPastError;
}

export class TripSearchQuery implements Action {
  readonly type = SearchActionTypes.TripSearchQuery;
  constructor(public searchQuery: SearchQuery) {}
}

export class TripSearchQueryError implements Action {
  readonly type = SearchActionTypes.TripSearchQueryError;
  constructor(public error: any) {}
}

export type SearchActions = BookTripRequest
              | BookTripSuccess
              | BookTripFailure
              | ChangeTime
              | ChangeTimeTarget
              | ChooseCurrentLocationAsOrigin
              | ChooseCurrentLocationAsDestination
              | ChooseDestinationLocation
              | ChooseOriginLocation
              | FetchAllStations
              | FetchAllStationsError
              | FetchGeocodeOriginResult
              | FetchGeocodeDestinationResult
              | FetchGeolocation
              | GeocodeError
              | GeolocationChanged
              | SaveOriginLatLng
              | SaveDestinationLatLng
              | SaveStations
              | SaveTrip
              | SetSearchAddressType
              | TimeInPastError
              | TripSearchQuery
              | TripSearchQueryError;
