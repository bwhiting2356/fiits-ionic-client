import { reducer as searchReducer, initialSearchState } from './search.reducer';
import {
  activeSearchTrue,
  activeSearchFalse,
  chooseOriginLocation,
  chooseDestinationLocation,
  fetchGeocodeOriginResult,
  fetchGeocodeDestinationResult,
  saveOriginLatLng,
  saveDestinationLatLng,
  setSearchAddressType,
  changeTimeTarget,
  changeTime,
  searchQuery,
  searchQuerySuccess,
  searchQueryError,
  fetchAllStations,
  fetchAllStationsSuccess,
  fetchAllStationsError,
  geocodeError,
  bookTripRequest,
  bookTripSuccess,
  bookTripFailure,
  geolocationChanged,
} from '../actions/search.actions';
import { mockAutocompleteResults } from '../../testing/mock-autocomplete-results';
import { mockTrips } from '../../testing/mock-trips';
import { TimeTarget } from '../shared/time-target.model';
import { SearchQuery } from '../shared/search-query.model';
import { StationInfo } from '../shared/trip-details.model';

describe('Search Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = searchReducer(initialSearchState, action);

      expect(result).toBe(initialSearchState);
    });
  });

  describe('search actions', () => {
    it('should set the origin location', () => {
      const action = chooseOriginLocation({ location: mockAutocompleteResults[0].structured_formatting.main_text });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        originAddress: 'Oyster Point'
      });
    });

    it('should set the destination location', () => {
      const action = chooseDestinationLocation({ location: mockAutocompleteResults[1].structured_formatting.main_text });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        destinationAddress: 'Highland Hospital'
      });
    });

    it('should set the search address type to \'Origin\'', () => {
      const action = setSearchAddressType({ addressType: 'Origin' });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        searchAddressType: 'Origin'
      });
    });

    it('should set the search address type to \'Destination\'', () => {
      const action = setSearchAddressType({ addressType: 'Destination' });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        searchAddressType: 'Destination'
      });
    });

    it('should set geocode fetching to true when origin is fetching', () => {
      const action = fetchGeocodeOriginResult({ placeId: '123 Main Street' });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        geocodeFetching: true
      });
    });

    it('should set geocode fetching to true when destination is fetching', () => {
      const action = fetchGeocodeDestinationResult({ placeId: '123 Main Street' });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        geocodeFetching: true
      });
    });

    it('should save the origin latlng, set geocode fetching to false', () => {
      const initialStateWithGeocodingFetching = {
        ...initialSearchState,
        geocodeFetching: true,
      };

      const action = saveOriginLatLng({ latlng: { lat: 0, lng: 0 }});

      const result = searchReducer(initialStateWithGeocodingFetching, action);

      expect(result).toEqual({
        ...initialSearchState,
        originLatLng: { lat: 0, lng: 0 },
        geocodeFetching: false
      });
    });

    it('should save the destination latlng, set geocode fetching to false', () => {
      const initialStateWithGeocodingFetching = {
        ...initialSearchState,
        geocodeFetching: true,
      };

      const action = saveDestinationLatLng({ latlng: { lat: 0, lng: 0 }});

      const result = searchReducer(initialStateWithGeocodingFetching, action);

      expect(result).toEqual({
        ...initialSearchState,
        destinationLatLng: { lat: 0, lng: 0 },
        geocodeFetching: false
      });
    });

    it('should set geocode fetching to false, save the error', () => {
      const initialStateWithGeocodingFetching = {
        ...initialSearchState,
        geocodeFetching: true,
      };

      const action = geocodeError({ error: 'oops' });

      const result = searchReducer(initialStateWithGeocodingFetching, action);

      expect(result).toEqual({
        ...initialSearchState,
        geocodeFetching: false,
        error: 'oops'
      });

    });

    it('should change the search time target to ARRIVE_BY', () => {
      const initialStateWithDepartAt = {
        ...initialSearchState,
        timeTarget: 'DEPART_AT' as TimeTarget
      };

      const action = changeTimeTarget({ timeTarget: 'ARRIVE_BY' });

      const result = searchReducer(initialStateWithDepartAt, action);

      expect(result).toEqual({
        ...initialSearchState,
        timeTarget: 'ARRIVE_BY'
      });
    });

    it('should change the search time target to DEPART_AT', () => {
      const initialStateWithDepartAt = {
        ...initialSearchState,
        timeTarget: 'ARRIVE_BY' as TimeTarget
      };

      const action = changeTimeTarget({ timeTarget: 'DEPART_AT' });

      const result = searchReducer(initialStateWithDepartAt, action);

      expect(result).toEqual({
        ...initialSearchState,
        timeTarget: 'DEPART_AT'
      });
    });

    it('should change the search time', () => {
      const time = new Date('2018-12-31T21:00:40.000+0000');
      const action = changeTime({ time });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        time
      });
    });

    it('should set searchQueryFetching to true', () => {
      const query: SearchQuery = {
        originLatLng: { lat: 1, lng: 1 },
        originAddress: '123 Main Street',
        destinationLatLng: { lat: 0, lng: 0 },
        destinationAddress: '576 Main Street',
        timeTarget: 'ARRIVE_BY',
        time: new Date(),
      };

      const action = searchQuery({ query });

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        searchQueryFetching: true
      });
    });

    it('should save the trip and set searchQueryFetching to false', () => {
      const initialStateFetchingTrue = {
        ...initialSearchState,
        searchQueryFetching: true
      };
      const action = searchQuerySuccess({ trip: mockTrips[0] });

      const result = searchReducer(initialStateFetchingTrue, action);

      expect(result).toEqual({
        ...initialSearchState,
        trip: mockTrips[0],
        searchQueryFetching: false
      });
    });
  });

  it('should save the error to state, set searchQueryFetching to false', () => {
    const initialStateFetchingTrue = {
      ...initialSearchState,
      searchQueryFetching: true
    };
    const action = searchQueryError({ error: 'oops' });

    const result = searchReducer(initialStateFetchingTrue, action);

    expect(result).toEqual({
      ...initialSearchState,
      searchQueryFetching: false,
      error: 'oops'
    });
  });

  it('should save the stations, set stations fetching to false', () => {
    const initialStateFetchingTrue = {
      ...initialSearchState,
      stationsFetching: true
    };
    const stations: StationInfo[] = [{
      id: 1,
      capacity: 10,
      currentInventory: 5,
      address: 'one',
      lat: 40.743647,
      lng: -74.003238
    }];

    const action = fetchAllStationsSuccess({ stations });

    const result = searchReducer(initialStateFetchingTrue, action);

    expect(result).toEqual({
      ...initialSearchState,
      stations,
      stationsFetching: false
    });
  });

  it('should set stations fetching to true', () => {
    const action = fetchAllStations();

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      stationsFetching: true
    });
  });

  it('should save the error and set stations fetching to false', () => {
    const action = fetchAllStationsError({ error: 'oops' });

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      stationsFetching: false,
      error: 'oops'
    });
  });

  it('should set book trip fetching to true', () => {
    const action = bookTripRequest();

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      bookTripFetching: true
    });
  });

  it('should set book trip fetching to false, clear the search state on success', () => {
    const initialSearchStateWithTrip = {
      ...initialSearchState,
      trip: mockTrips[0],
      bookTripFetching: true
    };
    const action = bookTripSuccess();

    const result = searchReducer(initialSearchStateWithTrip, action);

    expect(result).toEqual({
      ...initialSearchState
    });
  });

  it('should set book trip fetching to false, save the error if booking fails', () => {
    const initialSearchStateWithTrip = {
      ...initialSearchState,
      trip: mockTrips[0],
      bookTripFetching: true
    };

    const action = bookTripFailure({ error: 'oops' });

    const result = searchReducer(initialSearchStateWithTrip, action);

    expect(result).toEqual({
      ...initialSearchState,
      trip: mockTrips[0],
      bookTripFetching: false,
      error: 'oops'
    });

  });

  it('should add the position to state', () => {
    const action = geolocationChanged({ position: { lat: 0, lng: 0 }});

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      position: { lat: 0, lng: 0}
    });
  });

  it('shoudls set active search to true', () => {
    const action = activeSearchTrue();

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      activeSearch: true
    });
  });

  it('should set active search to false', () => {
    const initialStateWithSearchTrue = {
      ...initialSearchState,
      activeSearch: true
    };

    const action = activeSearchFalse();

    const result = searchReducer(initialStateWithSearchTrue, action);

    expect(result).toEqual({
      ...initialSearchState,
      activeSearch: false
    });
  });
});
