import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MapsAPILoader } from '@agm/core';
import { GoogleMap, Marker, InfoWindow, MapsEventListener } from '@agm/core/services/google-maps-types';
import { mock } from 'ts-mockito';

import { GoogleMapsUtil } from 'src/app/shared/maps/google-maps-util';
import { State } from '../../reducers';
import { initialState } from '../../reducers';
import {
  chooseOriginLocation,
  chooseDestinationLocation,
  saveOriginLatLng,
  saveDestinationLatLng
} from 'src/app/actions/search.actions';

import { GoogleMapComponent } from './google-map.component';
import { mockTrips } from 'src/testing/mock-trips';
import { mockStations } from 'src/testing/mock-stations';
declare var google;

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MapsAPILoader,
          useValue: {
            load: () => Promise.resolve()
          }
        },
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
    store = TestBed.get<Store<State>>(Store);
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
    component.map = mock<GoogleMap>();
    await component.initMap();
    expect(GoogleMapsUtil.renderWalkingPolyline).toHaveBeenCalledWith(mockPoints1, component.map);
    expect(GoogleMapsUtil.renderWalkingPolyline).toHaveBeenCalledWith(mockPoints2, component.map);
    expect(GoogleMapsUtil.renderBicyclingPolyline).toHaveBeenCalledWith(mockPoints3, component.map);
  });

  it('should call fitBounds when initMap is called if there is a trip', async () => {
    spyOn(component, 'fitBounds');
    component.trip = mockTrips[0];
    await component.initMap();
    expect(component.fitBounds).toHaveBeenCalled();
  });

  it('should not call fitBounds when initMap is called if there are no origin, destination, or trip', async () => {
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
      'Origin',
      false
    );
  });

  it('should call addMarker with the trip origin, destination, start and end stations when initMap is called', async () => {
    spyOn(component, 'addMarker');
    component.trip = mockTrips[0];
    await component.initMap();
    expect(component.addMarker).toHaveBeenCalledWith(
      mockTrips[0].originLatLng,
      mockTrips[0].originAddress,
      'Origin',
      false
    );
    expect(component.addMarker).toHaveBeenCalledWith(
      mockTrips[0].destinationLatLng,
      mockTrips[0].destinationAddress,
      'Destination',
      false
    );
    expect(component.addMarker).toHaveBeenCalledWith(
      { lat: mockTrips[0].startReservation.station.lat, lng: mockTrips[0].startReservation.station.lng },
      mockTrips[0].startReservation.station.address,
      'Pickup Station',
      true
    );
    expect(component.addMarker).toHaveBeenCalledWith(
      { lat: mockTrips[0].endReservation.station.lat, lng: mockTrips[0].endReservation.station.lng} ,
      mockTrips[0].endReservation.station.address,
      'Dropoff Station',
      true
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
      'Destination',
      false
    );
  });

  it('should call fitBounds on the map with the bounds object', () => {
    component.map = mock<GoogleMap>();
    spyOn(component.map, 'fitBounds');
    component.fitBounds();
    const expectedBounds = new google.maps.LatLngBounds();
    expect(component.map.fitBounds).toHaveBeenCalledWith(
      expectedBounds,
      { top: 10, bottom: 10, left: 10, right: 10}
    );
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
    expect(component.map.fitBounds).toHaveBeenCalledWith(
      expectedBounds,
      { top: 10, bottom: 10, left: 10, right: 10}
  );
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
    expect(component.map.fitBounds).toHaveBeenCalledWith(
      expectedBounds,
      { top: 10, bottom: 10, left: 10, right: 10}
    );
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
  });

  it('should add or remove station markers when initMap is called', async () => {
    spyOn(component, 'addOrRemoveStationMarkers');
    await component.initMap();
    expect(component.addOrRemoveStationMarkers).toHaveBeenCalled();
  });

  it('should add markers to the map for each station if zoom is greater than or equal to 14', () => {
    component.stations = mockStations;
    component.map = mock<GoogleMap>();

    component.map.getZoom = () => 15;
    const mockMarker = mock<Marker>();
    spyOn(component, 'addMarker').and.returnValue(mockMarker);

    component.addOrRemoveStationMarkers();

    expect(component.addMarker).toHaveBeenCalledWith(
      { lat: mockStations[0].lat, lng: mockStations[0].lng },
      mockStations[0].address,
      'Station',
      true,
      0
    );
    expect(component.addMarker).toHaveBeenCalledWith(
      { lat: mockStations[1].lat, lng: mockStations[1].lng },
      mockStations[1].address,
      'Station',
      true,
      1
    );
    expect(component.stationMarkers).toEqual([mockMarker, mockMarker]);
  });

  it('should create a new instance of a google maps map object', () => {
    expect(component.createNewMap()).toBeTruthy();
  });

  it('should add addOrRemoveStationMarkers as an event listener to the map object\'s zoom event', async () => {
    let storedZoomHandler;
    const mockMap = mock<GoogleMap>();
    mockMap.addListener = (_, callback) => {
      storedZoomHandler = callback;
      return mock<MapsEventListener>();
    };
    spyOn(component, 'createNewMap').and.returnValue(mockMap);
    await component.initMap();
    expect(storedZoomHandler).toEqual(component.addOrRemoveStationMarkers);
  });

  it('should not add a station marker if the location is the same as the origin or destination', () => {
    component.map = mock<GoogleMap>();
    component.map.getZoom = () => 15;
    component.stations = mockStations;
    component.originLatLng = { lat: mockStations[0].lat, lng: mockStations[0].lng };
    spyOn(component, 'addMarker');

    component.addOrRemoveStationMarkers();
    expect(component.addMarker).toHaveBeenCalledWith(
      { lat: mockStations[1].lat, lng: mockStations[1].lng },
      mockStations[1].address,
      'Station',
      true,
      1
    );

    expect(component.addMarker).not.toHaveBeenCalledWith(
      { lat: mockStations[0].lat, lng: mockStations[0].lng },
      mockStations[0].address,
      'Station',
      true,
      0
    );
  });

  it('should remove markers from the map if is less than 14', () => {
    component.stations = mockStations;
    component.map = mock<GoogleMap>();
    const mockMarker = mock<Marker>();
    component.stationMarkers = [mockMarker];
    component.map.getZoom = () => 13;

    spyOn(component, 'addMarker');
    spyOn(mockMarker, 'setMap');

    component.addOrRemoveStationMarkers();

    expect(component.addMarker).not.toHaveBeenCalled();
    expect(mockMarker.setMap).toHaveBeenCalledWith(null);
    expect(component.stationMarkers).toEqual([]);
  });

  it('should create a new station icon marker at position', () => {
    const latlng = { lat: 1, lng: 2 };
    const marker = component.createMarker(latlng, true, 1);
    expect((marker as any).icon.url).toBe('/assets/imgs/station.svg');
    expect((marker as any).position.lat()).toEqual(1);
    expect((marker as any).position.lng()).toEqual(2);
  });

  it('should create a new pin icon marker at position', () => {
    const latlng = { lat: 1, lng: 2 };
    const marker = component.createMarker(latlng, false, 1);
    expect((marker as any).icon.url).toBe('/assets/imgs/pin.svg');
    expect((marker as any).position.lat()).toEqual(1);
    expect((marker as any).position.lng()).toEqual(2);
  });

  it('should create a new regular info window with the content', () => {
    const infoWindow = component.createInfoWindow('123 Main Street', 'Origin', false);
    expect(infoWindow.getContent()).toEqual(`
<div id="marker-info-window" style="margin-right: 10px, margin-bottom: 10px">
<h5>Origin:</h5><p>123 Main Street</p></div>`);
  });

  it('should create a new station info window with the content', () => {
    const infoWindow = component.createInfoWindow('123 Main Street', 'Station', true, 0);
    const actual: string = infoWindow.getContent() as string;
    const expected =  `
<div id="marker-info-window" style="margin-right: 10px, margin-bottom: 10px">
<h5>Station:</h5><p>123 Main Street</p>
<ion-buttons slot="primary">
  <ion-button
    id="from-station"
    fill="solid"
    color="dark"
    expand="full"
    onclick="handleInfoWindowButtonClick('from', 0)">
    From here
  </ion-button>
  <ion-button
    id="to-station"
    fill="solid"
    color="dark"
    expand="full"
    onclick="handleInfoWindowButtonClick('to', 0)">
    To here
  </ion-button>
</ion-buttons></div>`;
    expect(expected).toEqual(actual);
  });

  it('should dispatch an action to change search destination to this station, close the window', () => {
    const openWindow = mock<InfoWindow>();
    spyOn(openWindow, 'close');
    component.openWindow = openWindow;
    component.stations = mockStations;
    spyOn(store, 'dispatch');
    component.ngOnInit();

    (window as any).handleInfoWindowButtonClick('to', 0);

    expect(store.dispatch).toHaveBeenCalledWith(chooseDestinationLocation({ location: mockStations[0].address }));
    expect(store.dispatch).toHaveBeenCalledWith(saveDestinationLatLng({ latlng: { lat: mockStations[0].lat, lng: mockStations[0].lng }}));
    expect(openWindow.close).toHaveBeenCalled();
  });

  it('should dispatch an action to change search origin to this station, close the window', () => {
    const openWindow = mock<InfoWindow>();
    spyOn(openWindow, 'close');
    component.openWindow = openWindow;
    component.stations = mockStations;
    spyOn(store, 'dispatch');
    component.ngOnInit();

    (window as any).handleInfoWindowButtonClick('from', 0);

    expect(store.dispatch).toHaveBeenCalledWith(chooseOriginLocation({ location: mockStations[0].address }));
    expect(store.dispatch).toHaveBeenCalledWith(saveOriginLatLng({ latlng: { lat: mockStations[0].lat, lng: mockStations[0].lng }}));
    expect(openWindow.close).toHaveBeenCalled();
  });

  it('should close existing open windows if a new info window is clicked', () => {
    const openWindow = mock<InfoWindow>();
    spyOn(openWindow, 'close');
    component.openWindow = openWindow;
    const mockMarker = mock<Marker>();
    spyOn(component, 'createMarker').and.returnValue(mockMarker);
    let storedClickHandler;
    spyOn(mockMarker, 'addListener').and.callFake((_, callback) => {
      storedClickHandler = callback;
      return mock<MapsEventListener>();
    });
    component.addMarker({ lat: 1, lng: 2}, '123 Main Street', 'Station', true);
    storedClickHandler();
    expect(openWindow.close).toHaveBeenCalled();
  });

  it('should create a new info window an open it when the marker is clicked', () => {
    const mockMap = mock<GoogleMap>();
    component.map = mockMap;
    const mockMarker = mock<Marker>();
    const mockInfoWindow = mock<InfoWindow>();
    spyOn(mockInfoWindow, 'open');
    spyOn(component, 'createInfoWindow').and.returnValue(mockInfoWindow);
    spyOn(component, 'createMarker').and.returnValue(mockMarker);
    let storedClickHandler;
    spyOn(mockMarker, 'addListener').and.callFake((_, callback) => {
      storedClickHandler = callback;
      return mock<MapsEventListener>();
    });
    component.addMarker({ lat: 1, lng: 2}, '123 Main Street', 'Station', true);
    storedClickHandler();
    expect(mockInfoWindow.open).toHaveBeenCalledWith(mockMap, mockMarker);
  });

  it('should add the handleInfoWindowButtonClick function to the window object on ngOnInit', () => {
    component.ngOnInit();
    expect((window as any).handleInfoWindowButtonClick).toEqual(component.handleInfoWindowButtonClick);
  });

  it('should call fitBounds when ionViewDidEnter is called', () => {
    spyOn(component, 'fitBounds');
    component.ionViewDidEnter();
    expect(component.fitBounds).toHaveBeenCalled();
  });
});
