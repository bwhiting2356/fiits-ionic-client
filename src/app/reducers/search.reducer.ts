import { createSelector, createFeatureSelector, createReducer, on, Action } from '@ngrx/store';

import {
  SearchAddressType,
  activeSearchTrue,
  activeSearchFalse,
  bookTripRequest,
  bookTripSuccess,
  bookTripFailure,
  changeTime,
  changeTimeTarget,
  chooseOriginLocation,
  chooseDestinationLocation,
  fetchGeocodeOriginResult,
  fetchGeocodeDestinationResult,
  geocodeError,
  fetchAllStations,
  fetchAllStationsSuccess,
  fetchAllStationsError,
  searchQuerySuccess,
  searchQuery,
  searchQueryError,
  setSearchAddressType,
  saveDestinationLatLng,
  saveOriginLatLng,
  geolocationChanged,
} from '../actions/search.actions';
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

export const selectSearchParams = createSelector(
  selectSearch,
  search => ({
    timeTarget: search.timeTarget,
    time: search.time,
    originAddress: search.originAddress,
    originLatLng: search.originLatLng,
    destinationAddress: search.destinationAddress,
    destinationLatLng: search.destinationLatLng
  })
);
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


const searchReducer = createReducer(
    initialSearchState,
    on(activeSearchTrue, state => ({ ...state, activeSearch: true })),
    on(activeSearchFalse, state => ({ ...state, activeSearch: false })),
    on(bookTripRequest, state => ({ ...state, bookTripFetching: true })),
    on(bookTripSuccess, () => ({ ...initialSearchState })),
    on(bookTripFailure, (state, { error }) => ({ ...state, error, bookTripFetching: false })),
    on(changeTime, (state, { time }) => ({ ...state, time })),
    on(changeTimeTarget, (state, { timeTarget }) => ({ ...state, timeTarget })),
    on(chooseOriginLocation, (state, { location }) => ({ ...state, originAddress: location })),
    on(chooseDestinationLocation, (state, { location }) => ({ ...state, destinationAddress: location })),
    on(fetchAllStations, state => ({ ...state, stationsFetching: true })),
    on(fetchAllStationsSuccess, (state, { stations }) => ({ ...state, stations, stationsFetching: false })),
    on(fetchAllStationsError, (state, { error }) => ({ ...state, error, stationsFetching: false })),
    on(searchQuery, state => ({ ...state, searchQueryFetching: true })),
    on(searchQueryError, (state, { error }) => ({ ...state, error, searchQueryFetching: false })),
    on(searchQuerySuccess, (state, { trip }) => ({ ...state, trip, searchQueryFetching: false })),
    on(setSearchAddressType, (state, { addressType }) => ({ ...state, searchAddressType: addressType })),
    on(fetchGeocodeOriginResult, state => ({ ...state, geocodeFetching: true })),
    on(fetchGeocodeDestinationResult, state => ({ ...state, geocodeFetching: true })),
    on(geocodeError, (state, { error }) => ({ ...state, error, geocodeFetching: false })),
    on(saveOriginLatLng, (state, { latlng }) => ({ ...state, originLatLng: latlng, geocodeFetching: false })),
    on(saveDestinationLatLng, (state, { latlng }) => ({ ...state, destinationLatLng: latlng, geocodeFetching: false })),
    on(geolocationChanged, (state, { position }) => ({ ...state, position }))
);

export function reducer(state: SearchState | undefined, action: Action) {
    return searchReducer(state, action);
}
