import { Action } from '@ngrx/store';
import { AutocompleteResult } from '../shared/maps/autocomplete-result';
import { LatLng } from '../shared/latlng.model';
import { SearchQuery } from '../shared/search-query';
import { TimeTarget } from '../shared/time-target';
import { Trip, StationInfo } from '../shared/trip.model';

export enum SearchActionTypes {
  AutocompleteResultsError = '[Search] Autocomplete Results Error',
  AutocompleteDirty = '[Search] Autocomplete Dirty',
  ChangeTime = '[Search] Change Time',
  ChangeTimeTarget = '[Search] Change Time Target',
  ChooseOriginLocation = '[Search] Choose Origin Location',
  ChooseDestinationLocation = '[Search] Choose Destination Location',
  ClearAutocompleteResults = '[Search] Clear Autocomplete Results',
  FetchAllStations = '[Search] Fetch All Stations',
  FetchAutocompleteResults = '[Search] Fetch Autocomplete Results',
  FetchGeocodeOriginResult = '[Seach] Fetch Geocode Origin Result',
  FetchGeocodeDestinationResult = '[Seach] Fetch Geocode Destination Result',
  SaveAutocompleteResults = '[Search] Save Autocomplete Results',
  SaveGeocodeOriginResult = '[Search] Save Geocode Origin Result',
  SaveGeocodeDestinationResult = '[Search] Save Geocode Destination Result',
  SaveStations = '[Search] Save Stations',
  SaveTrip = '[Search] Save Trip',
  SetSearchAddressType = '[Search] Set Search Address Type',
  TripSearchQuery = '[Search] Trip Search Query',
  TripSearchQueryError = '[Search] Trip Search Query Error',
}

export type SearchAddressType = 'Origin' | 'Destination';

export class AutocompleteDirty implements Action {
  readonly type = SearchActionTypes.AutocompleteDirty;
}

export class AutocompleteResultsError implements Action {
  readonly type = SearchActionTypes.AutocompleteResultsError;
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

export class ChooseOriginLocation implements Action {
  readonly type = SearchActionTypes.ChooseOriginLocation;
  constructor(public autocompleteResult: AutocompleteResult) {}
}

export class ChooseDestinationLocation implements Action {
  readonly type = SearchActionTypes.ChooseDestinationLocation;
  constructor(public autocompleteResult: AutocompleteResult) {}
}

export class ClearAutocompleteResults implements Action {
  readonly type = SearchActionTypes.ClearAutocompleteResults;
}

export class FetchAllStations implements Action {
  readonly type = SearchActionTypes.FetchAllStations;
}

export class FetchAutocompleteResults implements Action {
  readonly type = SearchActionTypes.FetchAutocompleteResults;
  constructor(public input: string) {}
}

export class FetchGeocodeOriginResult implements Action {
  readonly type = SearchActionTypes.FetchGeocodeOriginResult;
  constructor(public address: string) {}
}

export class FetchGeocodeDestinationResult implements Action {
  readonly type = SearchActionTypes.FetchGeocodeDestinationResult;
  constructor(public address: string) {}
}

export class SaveAutocompleteResults implements Action {
  readonly type = SearchActionTypes.SaveAutocompleteResults;
  constructor(public autocompleteResults: AutocompleteResult[]) {}
}

export class SaveGeocodeOriginResult implements Action {
  readonly type = SearchActionTypes.SaveGeocodeOriginResult;
  constructor(public latlng: LatLng) {}
}

export class SaveGeocodeDestinationResult implements Action {
  readonly type = SearchActionTypes.SaveGeocodeDestinationResult;
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

export class TripSearchQuery implements Action {
  readonly type = SearchActionTypes.TripSearchQuery;
  constructor(public searchQuery: SearchQuery) {}
}

export class TripSearchQueryError implements Action {
  readonly type = SearchActionTypes.TripSearchQueryError;
  constructor(public error: any) {}
}

export type SearchActions = AutocompleteResultsError
              | AutocompleteDirty
              | ChangeTime
              | ChangeTimeTarget
              | ChooseDestinationLocation
              | ChooseOriginLocation
              | ClearAutocompleteResults
              | FetchAllStations
              | FetchAutocompleteResults
              | FetchGeocodeOriginResult
              | FetchGeocodeDestinationResult
              | SaveAutocompleteResults
              | SaveGeocodeOriginResult
              | SaveGeocodeDestinationResult
              | SaveStations
              | SaveTrip
              | SetSearchAddressType
              | TripSearchQuery
              | TripSearchQueryError;
