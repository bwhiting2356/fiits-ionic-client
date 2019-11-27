import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trip } from '../shared/trip.model';
import { SearchQuery } from '../shared/search-query';
import { HttpClient } from '@angular/common/http';
import { mockTrips } from 'src/testing/mock-trips';
import { environment } from 'src/environments/environment';
import { BookTripRequest } from '../actions/search.actions';
import { BookTripRequestPayload } from '../shared/book-trip-request.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  TRIP_API_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) { }

  findBestTrip(searchQuery: SearchQuery): Observable<Trip> {
    return this.http.post<Trip>(`${this.TRIP_API_URL}/trip`, searchQuery);
  }

  bookTrip(trip: Trip, uid: string) {
    const bookTripRequest: BookTripRequestPayload = { trip, uid };
    return this.http.post(`${this.TRIP_API_URL}/book-trip`, bookTripRequest);
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
