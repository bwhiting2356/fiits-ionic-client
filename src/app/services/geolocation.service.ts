import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LatLng } from '../shared/latlng.model';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  getCurrentPosition(): Promise<LatLng> {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(`position ${position}`);
        console.log(position);
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    });
  }

  getCurrentPosition$(): Observable<LatLng> {
    return from(this.getCurrentPosition());
  }
}
