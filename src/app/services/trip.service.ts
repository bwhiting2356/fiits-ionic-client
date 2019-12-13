import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TripDetails } from '../shared/trip-details.model';
import { SearchQuery } from '../shared/search-query.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BookTripRequestPayload } from '../shared/book-trip-request.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  TRIP_API_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) { }

  parseTripDetails(trip: TripDetails): TripDetails {
    return new TripDetails(
      trip.originLatLng,
          trip.originAddress,
          trip.departureTime,
          trip.walking1Directions,
          trip.startReservation,
          trip.bicyclingDirections,
          trip.rentalPrice,
          trip.endReservation,
          trip.walking2Directions,
          trip.destinationLatLng,
          trip.destinationAddress,
          trip.arrivalTime,
    );
  }

  findBestTrip(searchQuery: SearchQuery): Observable<TripDetails> {
    return this.http.post<TripDetails>(`${this.TRIP_API_URL}/trip`, searchQuery)
      .pipe(
        map(this.parseTripDetails)
      );
  }

  bookTrip(tripDetails: TripDetails, uid: string) {
    const bookTripRequest: BookTripRequestPayload = { tripDetails, uid };
    return this.http.post(`${this.TRIP_API_URL}/book-trip`, bookTripRequest);
  }

  fetchTrips(userId: string): Observable<TripDetails[]> {
    return this.http.get<TripDetails[]>(`${this.TRIP_API_URL}/trips/${userId}`)
      .pipe(
        map(trips => trips.map(this.parseTripDetails))
      );
  }
}
