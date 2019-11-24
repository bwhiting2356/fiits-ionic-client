import { createSelector, createFeatureSelector } from '@ngrx/store';

import { AutocompleteResult } from '../shared/maps/autocomplete-result';
import { SearchActionTypes, SearchActions, SearchAddressType } from '../actions/search.actions';
import { LatLng } from '../shared/latlng.model';
import { TimeTarget } from '../shared/time-target';
import { Trip, StationInfo } from '../shared/trip.model';
import { DEFAULT_LOCATION } from '../shared/constants';

import { State } from './index';

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
  stations: StationInfo[];
  stationsFetching: boolean;
  bookTripFetching: boolean;
  trip: Trip;
  position: LatLng;
  error: any;
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
  stations: undefined,
  stationsFetching: false,
  bookTripFetching: false,
  trip: undefined,
  position: DEFAULT_LOCATION,
  error: undefined
};

export const searchKey = 'search';
const selectSearch = createFeatureSelector<State, SearchState>(searchKey);

export const selectAutocompleteResults = createSelector(
  selectSearch,
  state => state.autocompleteResults);

export const selectAutocompletFetching = createSelector(
  selectSearch,
  state => state.autocompleteFetching);

export const selectAutocompleteDirty = createSelector(
  selectSearch,
  state => state.autocompleteDirty);

export const selectAddressType = createSelector(
  selectSearch,
  state => state.searchAddressType);

export const selectShowAutocompleteSuggestions = createSelector(
  selectAutocompleteResults,
  selectAutocompletFetching,
  (results, fetching) => results.length < 1 && !fetching
);

export const selectAutocompleteShowNoResults = createSelector(
  selectAutocompleteResults,
  selectAutocompletFetching,
  selectAutocompleteDirty,
  (results, fetching, dirty) => results.length < 1 && !fetching && dirty
);

export const selectShowCurrentLocation = createSelector(
  selectSearch,
  state => state.search.position,
  (_, position) => position !== DEFAULT_LOCATION
);

export const selectSearchOriginLatLng = createSelector(
  selectSearch,
  state => state.originLatLng);

export const selectSearchOriginAddress = createSelector(
  selectSearch,
  state => state.originAddress);

export const selectSearchDestinationLatLng = createSelector(
  selectSearch,
  state => state.destinationLatLng);

export const selectSearchDestinationAddress = createSelector(
  selectSearch,
  state => state.destinationAddress
);

export const selectSearchQueryFetching = createSelector(
  selectSearch,
  state => state.searchQueryFetching);

export const selectSearchButtonDisabled = createSelector(
  selectSearchOriginLatLng,
  selectSearchDestinationLatLng,
  selectSearchQueryFetching,
  (origin, destination, fetching) => !origin || !destination || fetching
);

export const selectSearchShowSpinner = createSelector(
  createSelector(selectSearch, state => state.geocodeFetching),
  createSelector(selectSearch, state => state.stationsFetching),
  selectSearchQueryFetching,
  (searchFetching, geocodeFetching, stationsFetching) => searchFetching || geocodeFetching || stationsFetching
);

export const selectStations = createSelector(
  selectSearch,
  search => search.stations);

export const selectPosition = createSelector(
  selectSearch,
  search => search.position);

export const selectTrip = createSelector(
  selectSearch,
  search => search.trip);

export function searchReducer(state = initialSearchState, action: SearchActions): SearchState {
  switch (action.type) {
    case SearchActionTypes.BookTripRequest:
      return {
        ...state,
        bookTripFetching: true
      };
    case SearchActionTypes.BookTripSuccess:
      return {
        ...initialSearchState
      };
    case SearchActionTypes.BookTripFailure:
      return {
        ...state,
        error: action.error,
        bookTripFetching: false
      };
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
        originAddress: action.location
      };
    case SearchActionTypes.ChooseDestinationLocation:
      return {
        ...state,
        destinationAddress: action.location
      };
    case SearchActionTypes.ClearAutocompleteResults:
      return {
        ...state,
        autocompleteResults: [],
        autocompleteDirty: false,
        searchAddressType: undefined,
      };
    case SearchActionTypes.FetchAllStations:
      return {
        ...state,
        stationsFetching: true
      };
    case SearchActionTypes.FetchAllStationsError:
      return {
        ...state,
        stationsFetching: false,
        error: action.error
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

    case SearchActionTypes.GeocodeError:
      return {
        ...state,
        geocodeFetching: false,
        error: action.error
      };
    case SearchActionTypes.GeolocationChanged:
      return {
        ...state,
        position: action.position
      };
    case SearchActionTypes.SaveAutocompleteResults:
      return {
        ...state,
        autocompleteResults: action.autocompleteResults,
        autocompleteFetching: false
      };
    case SearchActionTypes.SaveOriginLatLng:
      return {
        ...state,
        originLatLng: action.latlng,
        geocodeFetching: false
      };
    case SearchActionTypes.SaveDestinationLatLng:
      return {
        ...state,
        destinationLatLng: action.latlng,
        geocodeFetching: false
      };
    case SearchActionTypes.SaveStations:
      return {
        ...state,
        stations: action.stations,
        stationsFetching: false
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
