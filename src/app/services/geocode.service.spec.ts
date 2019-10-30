import { TestBed } from '@angular/core/testing';

import { GeocodeService } from './geocode.service';
import { MapsAPILoader } from '@agm/core';
import { google } from '@agm/core/services/google-maps-types';
import { mockGeocodingResults } from '../shared/maps/mock-geocoding-results';

describe('GeocodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{
      provide: MapsAPILoader,
      useValue: {
        load: () => Promise.resolve(),
      }
     }]
  }));

  it('should be created', () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    expect(service).toBeTruthy();
  });

  it('should assign instance of google geocoder service when initializeGeocoder is called ', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    expect((service as any).googleGeocoderService).toBeTruthy();
  });

  it('should initialize the service if there\'s no instance yet', async () => {

    const service: GeocodeService = TestBed.get(GeocodeService);
    spyOn(service, 'initializeGeocoder').and.callFake(() => {
      (service as any).googleGeocoderService = { geocode: (_, cb) => cb(mockGeocodingResults) };
      return Promise.resolve();
    });
    (service as any).googleGeocoderService = undefined;
    await service.geocode('123 Main Street');
    expect(service.initializeGeocoder).toHaveBeenCalled();
  });

  it('should not initialize a new instance of the service is there already was one', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn(service, 'initializeGeocoder');
    await service.geocode('123 Main Street');
    expect(service.initializeGeocoder).not.toHaveBeenCalled();
  });

  it('should return the lat/lng from the geocoded result', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn((service as any).googleGeocoderService, 'geocode')
      .and.callFake((_, cb) => cb(mockGeocodingResults));
    const result = await service.geocode('123 Main Street');
    expect(result.lat).toEqual(1);
    expect(result.lng).toEqual(1);
  });
});
