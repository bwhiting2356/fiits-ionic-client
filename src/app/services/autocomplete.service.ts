import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { from, Observable } from 'rxjs';

import { AutocompleteResult } from '../shared/maps/autocomplete-result';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private googleAutocompleteService;

  constructor(private mapsAPILoader: MapsAPILoader) { }

  async initializeAutocomplete() {
    await this.mapsAPILoader.load();
    this.googleAutocompleteService = new google.maps.places.AutocompleteService();
  }

  async getPlacePredictions(input: string): Promise<AutocompleteResult[]> {
    if (!this.googleAutocompleteService) {
      await this.initializeAutocomplete();
    }

    if (!input) {
      return [];
    }

    return new Promise<AutocompleteResult[]>(resolve => {
      this.googleAutocompleteService.getPlacePredictions({input}, (results: any) => {
        resolve(results || []);
      });
    });
  }

  getPlacePredictions$(input: string): Observable<AutocompleteResult[]> {
    return from(this.getPlacePredictions(input));
  }
}
