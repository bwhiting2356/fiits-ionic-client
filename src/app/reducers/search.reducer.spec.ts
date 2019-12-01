import { searchReducer, initialSearchState } from './search.reducer';
import {
  ActiveSearchTrue,
  ActiveSearchFalse,
  ChooseOriginLocation,
  ChooseDestinationLocation,
  FetchGeocodeOriginResult,
  FetchGeocodeDestinationResult,
  SaveOriginLatLng,
  SaveDestinationLatLng,
  SetSearchAddressType,
  ChangeTimeTarget,
  ChangeTime,
  TripSearchQuery,
  SaveTrip,
  TripSearchQueryError,
  SaveStations,
  FetchAllStations,
  FetchAllStationsError,
  GeocodeError,
  BookTripRequest,
  BookTripSuccess,
  BookTripFailure,
  GeolocationChanged,
} from '../actions/search.actions';
import { mockAutocompleteResults } from '../../testing/mock-autocomplete-results';
import { mockTrips } from '../../testing/mock-trips';
import { TimeTarget } from '../shared/time-target';
import { SearchQuery } from '../shared/search-query';
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
      const action = new ChooseOriginLocation(mockAutocompleteResults[0].structured_formatting.main_text);

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        originAddress: 'Oyster Point'
      });
    });

    it('should set the destination location', () => {
      const action = new ChooseDestinationLocation(mockAutocompleteResults[1].structured_formatting.main_text);

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        destinationAddress: 'Highland Hospital'
      });
    });

    it('should set the search address type to \'Origin\'', () => {
      const action = new SetSearchAddressType('Origin');

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        searchAddressType: 'Origin'
      });
    });

    it('should set the search address type to \'Destination\'', () => {
      const action = new SetSearchAddressType('Destination');

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        searchAddressType: 'Destination'
      });
    });

    it('should set geocode fetching to true when origin is fetching', () => {
      const action = new FetchGeocodeOriginResult('123 Main Street');

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        geocodeFetching: true
      });
    });

    it('should set geocode fetching to true when destination is fetching', () => {
      const action = new FetchGeocodeDestinationResult('123 Main Street');

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

      const action = new SaveOriginLatLng({ lat: 0, lng: 0 });

      const result = searchReducer(initialStateWithGeocodingFetching, action);

      expect(result).toEqual({
        ...initialSearchState,
        originLatLng: { lat: 0, lng: 0 },
        geocodeFetching: false
      });
    });

    it('should save the destination latlng, set geocode fetching to flase', () => {
      const initialStateWithGeocodingFetching = {
        ...initialSearchState,
        geocodeFetching: true,
      };

      const action = new SaveDestinationLatLng({ lat: 0, lng: 0 });

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

      const action = new GeocodeError('oops');

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

      const action = new ChangeTimeTarget('ARRIVE_BY');

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

      const action = new ChangeTimeTarget('DEPART_AT');

      const result = searchReducer(initialStateWithDepartAt, action);

      expect(result).toEqual({
        ...initialSearchState,
        timeTarget: 'DEPART_AT'
      });
    });

    it('should change the search time', () => {
      const date = new Date('2018-12-31T21:00:40.000+0000');
      const action = new ChangeTime(date);

      const result = searchReducer(initialSearchState, action);

      expect(result).toEqual({
        ...initialSearchState,
        time: date
      });
    });

    it('should set searchQueryFetching to true', () => {
      const seachQuery: SearchQuery = {
        originLatLng: { lat: 1, lng: 1 },
        originAddress: '123 Main Street',
        destinationLatLng: { lat: 0, lng: 0 },
        destinationAddress: '576 Main Street',
        timeTarget: 'ARRIVE_BY',
        time: new Date(),
      };

      const action = new TripSearchQuery(seachQuery);

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
      const action = new SaveTrip(mockTrips[0]);

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
    const action = new TripSearchQueryError('oops');

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

    const action = new SaveStations(stations);

    const result = searchReducer(initialStateFetchingTrue, action);

    expect(result).toEqual({
      ...initialSearchState,
      stations,
      stationsFetching: false
    });
  });

  it('should set stations fetching to true', () => {
    const action = new FetchAllStations();

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      stationsFetching: true
    });
  });

  it('should save the error and set stations fetching to false', () => {
    const action = new FetchAllStationsError('oops');

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      stationsFetching: false,
      error: 'oops'
    });
  });

  it('should set book trip fetching to true', () => {
    const action = new BookTripRequest(mockTrips[0], 'mock-uid');

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
    const action = new BookTripSuccess();

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

    const action = new BookTripFailure('oops');

    const result = searchReducer(initialSearchStateWithTrip, action);

    expect(result).toEqual({
      ...initialSearchState,
      trip: mockTrips[0],
      bookTripFetching: false,
      error: 'oops'
    });

  });

  it('should add the position to state', () => {
    const action = new GeolocationChanged({ lat: 0, lng: 0});

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      position: { lat: 0, lng: 0}
    });
  });

  it('shoudls set active search to true', () => {
    const action = new ActiveSearchTrue();

    const result = searchReducer(initialSearchState, action);

    expect(result).toEqual({
      ...initialSearchState,
      activeSearch: true
    });
  });

  it('shoudls set active search to false', () => {
    const initialStateWithSearchTrue = {
      ...initialSearchState,
      activeSearch: true
    };

    const action = new ActiveSearchFalse();

    const result = searchReducer(initialStateWithSearchTrue, action);

    expect(result).toEqual({
      ...initialSearchState,
      activeSearch: false
    });
  });
});
