import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { hot } from 'jasmine-marbles';

import { TripService } from './trip.service';
import { SearchQuery } from '../shared/search-query.model';
import { mockTrips } from 'src/testing/mock-trips';
import { TripDetails } from '../shared/trip-details.model';

describe('TripService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [TripService]
  }));

  it('should be created', () => {
    const service: TripService = TestBed.get(TripService);
    expect(service).toBeTruthy();
  });

  it('should make a request for the search query', inject(
    [HttpTestingController, TripService],
    (httpMock: HttpTestingController, tripService: TripService) => {
      const seachQuery: SearchQuery = {
        originLatLng: { lat: 1, lng: 1 },
        originAddress: '123 Main Street',
        destinationLatLng: { lat: 0, lng: 0 },
        destinationAddress: '576 Main Street',
        timeTarget: 'ARRIVE_BY',
        time: new Date(),
      };

      tripService.findBestTrip(seachQuery).subscribe(trip => {
        const newTrip = new TripDetails(
            mockTrips[0].originLatLng,
            mockTrips[0].originAddress,
            mockTrips[0].departureTime,
            mockTrips[0].walking1Directions,
            mockTrips[0].startReservation,
            mockTrips[0].bicyclingDirections,
            mockTrips[0].rentalPrice,
            mockTrips[0].endReservation,
            mockTrips[0].walking2Directions,
            mockTrips[0].destinationLatLng,
            mockTrips[0].destinationAddress,
            mockTrips[0].arrivalTime,
        );
        expect(trip).toEqual(newTrip);
      });

      const mockReq = httpMock.expectOne(`${tripService.TRIP_API_URL}/trip`);
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockTrips[0]);

      httpMock.verify();
  }));

  it('should make a request to book the trip', inject(
    [HttpTestingController, TripService],
    (httpMock: HttpTestingController, tripService: TripService) => {

      tripService.bookTrip(mockTrips[0], 'mock-uid').subscribe(result => {
        expect(result).toEqual({});
      });

      const mockReq = httpMock.expectOne(`${tripService.TRIP_API_URL}/book-trip`);
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(mockReq.request.body).toEqual({
        uid: 'mock-uid',
        tripDetails: mockTrips[0]
      });
      mockReq.flush({});

      httpMock.verify();
  }));

  it('should fetch the trips for the user', inject(
    [HttpTestingController, TripService],
    (httpMock: HttpTestingController, tripService: TripService) => {
      const mockUID = 'mock-uid';

      const parsedTrips = mockTrips.map(tripService.parseTripDetails);
      tripService.fetchTrips(mockUID).subscribe(result => {
        expect(result).toEqual(parsedTrips);
      });

      const mockReq = httpMock.expectOne(`${tripService.TRIP_API_URL}/trips/${mockUID}`);
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockTrips);

      httpMock.verify();
  }));
});
