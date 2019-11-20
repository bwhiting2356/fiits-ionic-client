import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StationInfo } from '../shared/trip.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  STATION_API_URL = `${environment.backendURL}/stations`;

  constructor(private http: HttpClient) { }

  fetchAllStation$() {
    return this.http.get<StationInfo[]>(this.STATION_API_URL);
  }
}
