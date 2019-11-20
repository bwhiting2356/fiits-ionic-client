import { TestBed } from '@angular/core/testing';

import { GeolocationService } from './geolocation.service';
import { mockPosition } from 'src/testing/mock-position';

describe('GeolocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeolocationService = TestBed.get(GeolocationService);
    expect(service).toBeTruthy();
  });

  it('should return the position if geolocation is successful', async () => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
      successCallback => successCallback(mockPosition),
    );
    const service: GeolocationService = TestBed.get(GeolocationService);
    const position = await service.getCurrentPosition();
    expect(position).toEqual({ lat: 37.787527, lng: -122.39650429999998 });
  });

  it('should return an observable of the position if getCurrentPosition resolves successfully', () => {
    const service: GeolocationService = TestBed.get(GeolocationService);
    spyOn(service, 'getCurrentPosition').and.returnValue(Promise.resolve({ lat: 0, lng: 0 }));
    service.getCurrentPosition$().subscribe((position) => {
      expect(position).toEqual({ lat: 0, lng: 0 });
    });
  });
});
