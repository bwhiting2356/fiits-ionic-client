import { createAction, props } from '@ngrx/store';
import { LatLng } from '../shared/latlng.model';
import { SearchQuery } from '../shared/search-query.model';
import { TimeTarget } from '../shared/time-target.model';
import { TripDetails, StationInfo } from '../shared/trip-details.model';

export type SearchAddressType = 'Origin' | 'Destination';

export const activeSearchTrue = createAction('[Search] Active Search True');
export const activeSearchFalse = createAction('[Search] Active Search False');
export const bookTripRequest = createAction('[Search] Book Trip Request');
export const bookTripSuccess = createAction('[Search] Book Trip Success');
export const bookTripFailure = createAction('[Search] Book Trip Failure', props<{error: any}>());
export const changeTime = createAction('[Search] Change Time', props<{time: Date}>());
export const changeTimeTarget = createAction('[Search] Change Time Target', props<{timeTarget: TimeTarget}>());
export const chooseCurrentLocationAsDestination = createAction(
  '[Search] Choose Current Location As Destination',
  props<{location: LatLng}>()
);
export const chooseCurrentLocationAsOrigin = createAction(
  '[Search] Choose Current Location As Origin',
  props<{location: LatLng}>()
);
export const chooseOriginLocation = createAction(
  '[Search] Choose Origin Location',
  props<{location: string}>()
);
export const chooseDestinationLocation = createAction(
  '[Search] Choose Destination Location',
  props<{location: string}>()
);
export const fetchAllStations = createAction('[Search] Fetch All Stations');
export const fetchAllStationsError = createAction('[Search] Fetch All Stations Error', props<{error: any}>());
export const fetchAllStationsSuccess = createAction('[Search] Fetch All Stations Success', props<{stations: StationInfo[]}>());
export const fetchGeocodeOriginResult = createAction('[Search] Fetch Geocode Origin Result', props<{placeId: string}>());
export const fetchGeocodeDestinationResult = createAction('[Search] Fetch Geocode Destination Result', props<{placeId: string}>());
export const fetchGeolocation = createAction('[Search] Fetch Geolocation');
export const geocodeError = createAction('[Search] Geocode Error', props<{error: any}>());
export const geolocationChanged = createAction('[Search] Geolocation Changed', props<{position: LatLng}>());
export const geolocationError = createAction('[Search] Geolocation Error', props<{error: any}>());
export const saveOriginLatLng = createAction('[Search] Save Origin LatLng', props<{latlng: LatLng}>());
export const saveDestinationLatLng = createAction('[Search] Save Destination LatLng', props<{latlng: LatLng}>());
export const setSearchAddressType = createAction('[Search] Set Search Address Type', props<{addressType: SearchAddressType}>());
export const timeInPastError = createAction('[Search] Time In Past Error');
export const searchQuery = createAction('[Search] Query');
export const searchQuerySuccess = createAction('[Search] Query Success', props<{trip: TripDetails}>());
export const searchQueryError = createAction('[Search] Query Error', props<{error: any}>());
