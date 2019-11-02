import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StationInfo } from '../shared/trip.model';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  STATION_API_URL = 'http://localhost:8080/stations';

  constructor(private http: HttpClient) { }

  fetchAllStation$() {
    return this.http.get<StationInfo[]>(this.STATION_API_URL);
  }
}
