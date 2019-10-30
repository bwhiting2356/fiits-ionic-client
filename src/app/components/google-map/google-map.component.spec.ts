import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapComponent } from './google-map.component';
import { MapsAPILoader } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';

import { mock } from 'ts-mockito';
import { GoogleMapsUtil } from 'src/app/shared/maps/google-maps-util';
import { DEFAULT_LOCATION } from 'src/app/shared/constants';
import { mockTrips } from 'src/app/trips/mock-trips';

declare var google;

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: MapsAPILoader,
        useValue: {
          load: () => Promise.resolve()
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call maps api loader', async () => {
    spyOn((component as any).mapsAPILoader, 'load');
    await component.initMap();
    expect((component as any).mapsAPILoader.load).toHaveBeenCalled();
  });
  it('sould initialize the map with the default location if none is provided', async () => {
    await component.initMap();
    expect(component.map.getCenter().lat()).toBeCloseTo(DEFAULT_LOCATION.lat, 8);
    expect(component.map.getCenter().lng()).toBeCloseTo(DEFAULT_LOCATION.lng, 8);
  });

  it('sould initialize the map with the center latlng', async () => {
    const latlng = new google.maps.LatLng(1, 1);
    component.center = latlng;
    await component.initMap();
    expect(component.map.getCenter()).toBe(latlng);
  });

  it('should call fitBounds when initMap is called if there is an origin', async () => {
    spyOn(component, 'fitBounds');
    component.originLatLng = new google.maps.LatLng(1, 1);
    component.destinationLatLng = undefined;
    await component.initMap();
    expect(component.fitBounds).toHaveBeenCalled();
  });

  it('should call fitBounds when initMap is called if there is a destination', async () => {
    spyOn(component, 'fitBounds');
    component.originLatLng = undefined;
    component.destinationLatLng = new google.maps.LatLng(1, 1);
    await component.initMap();
    expect(component.fitBounds).toHaveBeenCalled();
  });

  it('should render walking 1 polyline points on the map', async () => {
    spyOn(GoogleMapsUtil, 'renderWalkingPolyline');
    spyOn(GoogleMapsUtil, 'renderBicyclingPolyline');

    component.trip = mockTrips[0];
    const mockPoints1 = [
      { lat: 0, lng: 0 },
      { lat: 1, lng: 1 }
    ];
    const mockPoints2 = [
      { lat: 2, lng: 2 },
      { lat: 3, lng: 3 }
    ];
    const mockPoints3 = [
      { lat: 4, lng: 4 },
      { lat: 5, lng: 5 }
    ];

    component.trip.walking1Directions.points = mockPoints1;
    component.trip.walking2Directions.points = mockPoints2;
    component.trip.bicyclingDirections.points = mockPoints3;
    component.map = mock<GoogleMap>(); ;
    await component.initMap();
    expect(GoogleMapsUtil.renderWalkingPolyline).toHaveBeenCalledWith(mockPoints1, component.map);
    expect(GoogleMapsUtil.renderWalkingPolyline).toHaveBeenCalledWith(mockPoints2, component.map);
    expect(GoogleMapsUtil.renderBicyclingPolyline).toHaveBeenCalledWith(mockPoints3, component.map);
  });

  it('should not call fitBounds when initMap is called if there are no origin and destination', async () => {
    spyOn(component, 'fitBounds');
    await component.initMap();
    expect(component.fitBounds).not.toHaveBeenCalled();
  });

  it('should call addMarker with the originLatLng when initMap is called', async () => {
    spyOn(component, 'addMarker');
    component.originAddress = '123 Main Street';
    const latlng = new google.maps.LatLng(1, 1);
    component.originLatLng = latlng;
    await component.initMap();
    expect(component.addMarker).toHaveBeenCalledWith(
      latlng,
      '123 Main Street',
      'Origin'
    );
  });

  it('should call addMarker with the destinationLatLng when initMap is called', async () => {
    spyOn(component, 'addMarker');
    component.destinationAddress = '576 Main Street';
    const latlng = new google.maps.LatLng(1, 1);
    component.destinationLatLng = latlng;
    await component.initMap();
    expect(component.addMarker).toHaveBeenCalledWith(
      latlng,
      '576 Main Street',
      'Destination'
    );
  });

  it('should call fitBounds on the map with the bounds object', () => {
    component.map = mock<GoogleMap>(); ;
    spyOn(component.map, 'fitBounds');
    component.fitBounds();
    const expectedBounds = new google.maps.LatLngBounds();
    expect(component.map.fitBounds).toHaveBeenCalledWith(expectedBounds);
  });

  it('should have extended the bounds with originLatLng if they are present', () => {
    const expectedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(1, 1),
      new google.maps.LatLng(1, 1)
    );
    component.map = mock<GoogleMap>();
    spyOn(component.map, 'fitBounds');
    component.originLatLng = new google.maps.LatLng(1, 1);
    component.fitBounds();
    expect(component.map.fitBounds).toHaveBeenCalledWith(expectedBounds);
  });

  it('should have extended the bounds with destinationLatLng if they are present', () => {
    const expectedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(1, 1),
      new google.maps.LatLng(1, 1)
    );
    component.map = mock<GoogleMap>();
    spyOn(component.map, 'fitBounds');
    component.destinationLatLng = new google.maps.LatLng(1, 1);
    component.fitBounds();
    expect(component.map.fitBounds).toHaveBeenCalledWith(expectedBounds);
  });

  it('should add a marker to the map', () => {
    const mockGoogleMap = mock<GoogleMap>();
    component.map = mockGoogleMap;
    const newMarker = component.addMarker(
      new google.maps.LatLng(1, 1),
      '1234 Street',
      'Station 1',
      true
    );

    expect((newMarker as any).icon.url).toBe('/assets/imgs/station.svg');

  });

  it('should call initMap when ngOnChanges is called', () => {
    spyOn(component, 'initMap');
    component.ngOnChanges();
    expect(component.initMap).toHaveBeenCalled();
  })
});
