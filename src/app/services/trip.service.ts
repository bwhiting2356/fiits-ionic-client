import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trip } from '../shared/trip.model';
import { mockTrips } from '../trips/mock-trips';
import { SearchQuery } from '../shared/search-query';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  TRIP_API_URL = 'https://fiits-backend.herokuapp.com';

  constructor(private http: HttpClient) { }

  findBestTrip(searchQuery: SearchQuery): Observable<Trip> {
    return this.http.post<Trip>(`${this.TRIP_API_URL}/trip`, searchQuery);
  }

  bookTrip(trip: Trip) {
    return this.http.post(`${this.TRIP_API_URL}/book-trip`, trip);
  }

  getTrips(): Observable<Trip[]> {
    return of([...mockTrips, ...mockTrips, ...mockTrips, ...mockTrips]);
  }

  getFilteredTrips(direction: string, currentDate: Date): Observable<Trip[]> {
    return this.getTrips().pipe(
      map(trips => trips.filter(trip => {
        const tripDate = new Date(trip.arrivalTime);
        if (direction === 'Upcoming') {
          return tripDate > currentDate;
        } else if (direction === 'Past') {
          return tripDate <= currentDate;
        }
      }))
    );
  }
}
