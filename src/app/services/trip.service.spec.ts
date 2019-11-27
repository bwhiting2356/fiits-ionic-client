import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';

import { TripService } from './trip.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { hot } from 'jasmine-marbles';
import { SearchQuery } from '../shared/search-query';
import { mockTrips } from 'src/testing/mock-trips';

describe('TripService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [TripService]
  }));

  it('should be created', () => {
    const service: TripService = TestBed.get(TripService);
    expect(service).toBeTruthy();
  });

  it('should filter the trips, only include past', () => {
    const service: TripService = TestBed.get(TripService);
    spyOn(service, 'getTrips').and.returnValue(of(mockTrips));
    const mockCurrentDate = new Date('2018-12-31T21:00:40.000+0000');
    const filteredTrips = service.getFilteredTrips('Past', mockCurrentDate);
    const expected = hot('(a|)', { a: mockTrips.slice(0, 1) } );
    expect(filteredTrips).toBeObservable(expected);
  });

  it('should filter the trips, only include upcoming', async () => {
    const service: TripService = TestBed.get(TripService);
    spyOn(service, 'getTrips').and.returnValue(of(mockTrips));
    const mockCurrentDate = new Date('2019-12-31T21:00:40.000+0000');
    const filteredTrips = service.getFilteredTrips('Upcoming', mockCurrentDate);

    const expected = hot('(a|)', { a: mockTrips.slice(1) } );
    expect(filteredTrips).toBeObservable(expected);
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
        expect(trip).toEqual(mockTrips[0]);
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
        trip: mockTrips[0]
      });
      mockReq.flush({});

      httpMock.verify();
  }));
});
