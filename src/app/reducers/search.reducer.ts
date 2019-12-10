import { createSelector, createFeatureSelector } from '@ngrx/store';

import { SearchActionTypes, SearchActions, SearchAddressType } from '../actions/search.actions';
import { LatLng } from '../shared/latlng.model';
import { TimeTarget } from '../shared/time-target.model';
import { TripDetails, StationInfo } from '../shared/trip-details.model';
import { DEFAULT_LOCATION } from '../shared/constants';

import { State } from './index';

export interface SearchState {
  activeSearch: boolean;
  originAddress: string;
  originLatLng: LatLng;
  destinationAddress: string;
  destinationLatLng: LatLng;
  timeTarget: TimeTarget;
  time: Date;
  searchAddressType: SearchAddressType;
  geocodeFetching: boolean;
  searchQueryFetching: boolean;
  stations: StationInfo[];
  stationsFetching: boolean;
  bookTripFetching: boolean;
  trip: TripDetails;
  position: LatLng;
  error: any;
}

export const initialSearchState: SearchState = {
  activeSearch: false,
  originAddress: '',
  originLatLng: undefined,
  destinationAddress: '',
  destinationLatLng: undefined,
  timeTarget: 'DEPART_AT',
  time: new Date(),
  searchAddressType: undefined,
  geocodeFetching: false,
  searchQueryFetching: false,
  stations: undefined,
  stationsFetching: false,
  bookTripFetching: false,
  trip: undefined,
  position: DEFAULT_LOCATION,
  error: undefined
};

const selectSearch = createFeatureSelector<State, SearchState>('search');

export const selectAddressType = createSelector(
  selectSearch,
  state => state.searchAddressType);

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

export const selectSearchTime = createSelector(
  selectSearch,
  state => state.time
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

export const selectBookTripFetching = createSelector(
    selectSearch,
    search => search.bookTripFetching);

export function searchReducer(state = initialSearchState, action: SearchActions): SearchState {
  switch (action.type) {
    case SearchActionTypes.ActiveSearchTrue:
      return {
        ...state,
        activeSearch: true
      };
    case SearchActionTypes.ActiveSearchFalse:
      return {
        ...state,
        activeSearch: false
      };
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
