import { AutocompleteResult } from '../shared/maps/autocomplete-result';
import { SearchActionTypes, SearchActions, SetSearchAddressType, SearchAddressType } from '../actions/search.actions';
import { LatLng } from '../shared/latlng.model';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '.';
import { TimeTarget } from '../shared/time-target';
import { Trip } from '../shared/trip.model';

export interface SearchState {
  originAddress: string;
  originLatLng: LatLng;
  destinationAddress: string;
  destinationLatLng: LatLng;
  timeTarget: TimeTarget;
  time: Date;
  searchAddressType: SearchAddressType;
  autocompleteResults: AutocompleteResult[];
  autocompleteFetching: boolean;
  autocompleteDirty: boolean;
  geocodeFetching: boolean;
  searchQueryFetching: boolean;
  trip: Trip;
  error: any;
  // TODO handle and test error
}

export const initialSearchState: SearchState = {
  originAddress: '',
  originLatLng: undefined,
  destinationAddress: '',
  destinationLatLng: undefined,
  timeTarget: 'DEPART_AT',
  time: new Date(),
  searchAddressType: undefined,
  autocompleteResults: [],
  autocompleteFetching: false,
  autocompleteDirty: false,
  geocodeFetching: false,
  searchQueryFetching: false,
  trip: undefined,
  error: false
};

export function searchReducer(state = initialSearchState, action: SearchActions): SearchState {
  switch (action.type) {
    case SearchActionTypes.ChangeTime:
      return {
        ...state,
        time: action.time
      };
    case SearchActionTypes.ChangeTimeTarget:
      return {
        ...state,
        timeTarget: action.timeTarget
      };
    case SearchActionTypes.ChooseOriginLocation:
      return {
        ...state,
        originAddress: action.autocompleteResult.structured_formatting.main_text 
      };
    case SearchActionTypes.ChooseDestinationLocation:
      return {
        ...state,
        destinationAddress: action.autocompleteResult.structured_formatting.main_text
      };
    case SearchActionTypes.ClearAutocompleteResults:
      return {
        ...state,
        autocompleteResults: [],
        autocompleteDirty: false,
        searchAddressType: undefined,
      };
    case SearchActionTypes.FetchAutocompleteResults:
      return {
        ...state,
        autocompleteResults: [],
        autocompleteFetching: true,
        autocompleteDirty: true
      };
    case SearchActionTypes.FetchGeocodeOriginResult:
    case SearchActionTypes.FetchGeocodeDestinationResult:
      return {
        ...state,
        geocodeFetching: true
      };
    case SearchActionTypes.SaveAutocompleteResults:
      return {
        ...state,
        autocompleteResults: action.autocompleteResults,
        autocompleteFetching: false
      };
    case SearchActionTypes.SaveGeocodeOriginResult:
      return {
        ...state,
        originLatLng: action.latlng,
        geocodeFetching: false
      };
    case SearchActionTypes.SaveGeocodeDestinationResult:
      return {
        ...state,
        destinationLatLng: action.latlng,
        geocodeFetching: false
      };
    case SearchActionTypes.SaveTrip:
      return {
        ...state,
        trip: action.trip,
        searchQueryFetching: false,
      };
    case SearchActionTypes.SetSearchAddressType:
      return {
        ...state,
        searchAddressType: action.addressType
      };
    case SearchActionTypes.TripSearchQuery:
      return {
        ...state,
        searchQueryFetching: true
      };
    case SearchActionTypes.TripSearchQueryError:
      return {
        ...state,
        searchQueryFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
