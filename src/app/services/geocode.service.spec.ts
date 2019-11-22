import { TestBed } from '@angular/core/testing';

import { GeocodeService } from './geocode.service';
import { MapsAPILoader } from '@agm/core';
import { mockGeocodingResults, mockReverseGeocodingResults } from '../../testing/mock-geocoding-results';

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

  it('geocode: should initialize the service if there\'s no instance yet', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    spyOn(service, 'initializeGeocoder').and.callFake(() => {
      (service as any).googleGeocoderService = { geocode: (_, cb) => cb(mockGeocodingResults) };
      return Promise.resolve();
    });
    (service as any).googleGeocoderService = undefined;
    await service.geocode('123 Main Street');
    expect(service.initializeGeocoder).toHaveBeenCalled();
  });

  it('reverse geocode: should initialize the service if there\'s no instance yet', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    spyOn(service, 'initializeGeocoder').and.callFake(() => {
      (service as any).googleGeocoderService = { geocode: (_, cb) => cb(mockGeocodingResults) };
      return Promise.resolve();
    });
    (service as any).googleGeocoderService = undefined;
    await service.reverseGeocode({ lat: 0, lng: 0 });
    expect(service.initializeGeocoder).toHaveBeenCalled();
  });

  it('geocode: should not initialize a new instance of the service is there already was one', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn(service, 'initializeGeocoder');
    await service.geocode('123 Main Street');
    expect(service.initializeGeocoder).not.toHaveBeenCalled();
  });

  it('reverse geocode: should not initialize a new instance of the service is there already was one', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn(service, 'initializeGeocoder');
    await service.reverseGeocode({ lat: 0, lng: 0 });
    expect(service.initializeGeocoder).not.toHaveBeenCalled();
  });

  it('geocode: should return the lat/lng from the geocoded result', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn((service as any).googleGeocoderService, 'geocode')
      .and.callFake((_, cb) => cb(mockGeocodingResults));
    const result = await service.geocode('123 Main Street');
    expect(result.lat).toEqual(1);
    expect(result.lng).toEqual(1);
  });

  it('geocode: should resolve with null if there is no result from the geocode service', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn((service as any).googleGeocoderService, 'geocode')
      .and.callFake((_, cb) => cb(null));
    const result = await service.geocode('123 Main Street');
    expect(result).toEqual(null);
  });

  it('reverse geocode: should return the address from the reverse geocoded result', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn((service as any).googleGeocoderService, 'geocode')
      .and.callFake((_, cb) => cb(mockReverseGeocodingResults));
    const result = await service.reverseGeocode({ lat: 0, lng: 0 });
    expect(result).toEqual('123 Main Street');
  });

  it('reverse geocode: should resolve with null if there is no result from the geocode service', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn((service as any).googleGeocoderService, 'geocode')
      .and.callFake((_, cb) => cb(null));
    const result = await service.reverseGeocode({ lat: 0, lng: 0 });
    expect(result).toEqual(null);
  });

  it('geocode: should return an observable of the result', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn((service as any).googleGeocoderService, 'geocode')
      .and.callFake((_, cb) => cb(mockGeocodingResults));
    service.getLatLngFromAddress$('123 Main Street').subscribe(result => {
      expect(result.lat).toEqual(1);
      expect(result.lng).toEqual(1);
    });
  });

  it('reverse geocode: should return an observable of the result', async () => {
    const service: GeocodeService = TestBed.get(GeocodeService);
    await service.initializeGeocoder();
    spyOn((service as any).googleGeocoderService, 'geocode')
      .and.callFake((_, cb) => cb(mockReverseGeocodingResults));
    service.getAddressFromLatLng$({ lat: 0, lng: 0 }).subscribe(result => {
      expect(result).toEqual('123 Main Street');
    });
  });
});
