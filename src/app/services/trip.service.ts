import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TripDetails } from '../shared/trip-details.model';
import { SearchQuery } from '../shared/search-query';
import { HttpClient } from '@angular/common/http';
import { mockTrips } from 'src/testing/mock-trips';
import { environment } from 'src/environments/environment';
import { BookTripRequestPayload } from '../shared/book-trip-request.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  TRIP_API_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) { }

  findBestTrip(searchQuery: SearchQuery): Observable<TripDetails> {
    return this.http.post<TripDetails>(`${this.TRIP_API_URL}/trip`, searchQuery);
  }

  bookTrip(tripDetails: TripDetails, uid: string) {
    const bookTripRequest: BookTripRequestPayload = { tripDetails, uid };
    return this.http.post(`${this.TRIP_API_URL}/book-trip`, bookTripRequest);
  }

  fetchTrips(userId: string): Observable<TripDetails[]> {
    return this.http.get<TripDetails[]>(`${this.TRIP_API_URL}/trips/${userId}`);
  }

  getFilteredTrips(direction: string, currentDate: Date): Observable<TripDetails[]> {
    return this.fetchTrips('').pipe( // TODO: fix
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
