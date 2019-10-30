import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { mockTrips } from './mock-trips';

import { TripService } from './trip.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { cold, hot } from 'jasmine-marbles';

describe('TripService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { // TODO: use HTTClientTestingModule ?
        provide: HttpClient,
        useValue: {
          get: () => {}
        }
      }
    ]
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
  })

  it('should filter the trips, only include upcoming', async () => {
    const service: TripService = TestBed.get(TripService);
    spyOn(service, 'getTrips').and.returnValue(of(mockTrips));
    const mockCurrentDate = new Date('2019-12-31T21:00:40.000+0000');
    const filteredTrips = service.getFilteredTrips('Upcoming', mockCurrentDate);

    const expected = hot('(a|)', { a: mockTrips.slice(1) } );
    expect(filteredTrips).toBeObservable(expected);
  });

  xit('should make a request to fulfill a search query', () => {
    const service: TripService = TestBed.get(TripService);
    // TODO: what am I asserting?

  })
});
