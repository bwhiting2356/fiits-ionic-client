import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { LatLng } from '../shared/latlng.model';
import { from, Observable } from 'rxjs';
import { GeocodingResult, ReverseGeocodingResult } from '../shared/maps/geocoding-result';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private googleGeocoderService;

  constructor(private mapsAPILoader: MapsAPILoader) { }

  async initializeGeocoder() {
    await this.mapsAPILoader.load();
    this.googleGeocoderService = new google.maps.Geocoder();
  }

  async geocode(address: string): Promise<LatLng> {
    if (!this.googleGeocoderService) {
      await this.initializeGeocoder();
    }
    return new Promise(resolve => {
      this.googleGeocoderService.geocode({ address }, (results: GeocodingResult[]) => {
        if (results && results[0]) { // why do I need this results[0] to avoid that bug in the tests?
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  async reverseGeocode(latLng: LatLng): Promise<string> {
    if (!this.googleGeocoderService) {
      await this.initializeGeocoder();
    }
    return new Promise(resolve => {
      this.googleGeocoderService.geocode({ location: latLng }, (results: ReverseGeocodingResult[]) => {
        if (results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      });
    });
  }

  getLatLngFromAddress$(input: string): Observable<LatLng> {
    return from(this.geocode(input));
  }

  getAddressFromLatLng$(latLng: LatLng): Observable<string> {
    return from(this.reverseGeocode(latLng));
  }
}
