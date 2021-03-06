import { MapsAPILoader } from '@agm/core';
import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GoogleMap, Marker, InfoWindow } from '@agm/core/services/google-maps-types';

import { GestureHandling } from 'src/app/shared/maps/gesture-handling';
import { GoogleMapsUtil } from 'src/app/shared/maps/google-maps-util';
import { TripDetails, StationInfo } from 'src/app/shared/trip-details.model';
import { LatLng } from 'src/app/shared/latlng.model';
import { State } from 'src/app/reducers';
import {
  chooseOriginLocation,
  chooseDestinationLocation,
  saveOriginLatLng,
  saveDestinationLatLng
} from 'src/app/actions/search.actions';
import { environment } from 'src/environments/environment';
import { latLngEquals } from 'src/app/shared/util/util';

declare var google;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent implements OnChanges, OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef;
  @Input() zoom = 14;
  @Input() zoomControl = false;
  @Input() scrollWheel = true;
  @Input() streetViewControl = false;
  @Input() gestureHandling: GestureHandling = 'greedy';
  @Input() fullscreenControl = true;
  @Input() center: LatLng;
  @Input() originLatLng: LatLng;
  @Input() originAddress: string;
  @Input() destinationLatLng: LatLng;
  @Input() destinationAddress: string;
  @Input() trip: TripDetails;

  @Input() stations: StationInfo[];
  @Input() collapsed = false; // this is only here to trigger change detection when the size changes
  map: GoogleMap;
  stationMarkers: Marker[] = [];
  openWindow: InfoWindow;

  constructor(
    private store: Store<State>,
    private mapsAPILoader: MapsAPILoader) { }

  ngOnChanges() {
    this.initMap();
  }

  ngOnInit() {
    this.initMap();
    (window as any).handleInfoWindowButtonClick = this.handleInfoWindowButtonClick;
  }

  ionViewDidEnter() {
    this.fitBounds();
  }

  addOrRemoveStationMarkers = () => {
    if (this.stations && this.map.getZoom() >= 14) {
      this.stations.forEach((station, i) => {
        const { address, lat, lng } = station;
        const latLng = { lat, lng};
        if (!latLngEquals(latLng, this.destinationLatLng) && !latLngEquals(latLng, this.originLatLng)) {
          const marker = this.addMarker(latLng, address, 'Station', true, i);
          this.stationMarkers.push(marker);
        }
      });
    } else {
      this.stationMarkers.forEach(marker => marker.setMap(null));
      this.stationMarkers = [];
    }
  }

  createNewMap() {
    return new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: this.zoom,
      maxZoom: 16,
      center: this.center,
      disableDefaultUI: true,
      zoomControl: this.zoomControl,
      streetViewControl: this.streetViewControl,
      gestureHandling: this.gestureHandling,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: '#off' }]
        },
      ]
    });

  }

  async initMap() {
    await this.mapsAPILoader.load();
    this.map = this.createNewMap();

    if (this.trip) {
      this.addMarker(this.trip.originLatLng, this.trip.originAddress, 'Origin', false);
      this.addMarker(this.trip.destinationLatLng, this.trip.destinationAddress, 'Destination', false);
      const startReservationLatLng = { lat: this.trip.startReservation.station.lat, lng: this.trip.startReservation.station.lng };
      this.addMarker(
        startReservationLatLng,
        this.trip.startReservation.station.address,
        'Pickup Station', true);
      const endReservationLatLng = { lat: this.trip.endReservation.station.lat, lng: this.trip.endReservation.station.lng };
      this.addMarker(
        endReservationLatLng,
        this.trip.endReservation.station.address,
        'Dropoff Station', true);
    } else {
      if (this.originLatLng) {
        this.addMarker(this.originLatLng, this.originAddress, 'Origin', false);
      }
      if (this.destinationLatLng) {
        this.addMarker(this.destinationLatLng, this.destinationAddress, 'Destination', false);
      }
    }

    this.addOrRemoveStationMarkers();

    if (this.trip) {
      GoogleMapsUtil.renderWalkingPolyline(this.trip.walking1Directions.points, this.map);
      GoogleMapsUtil.renderWalkingPolyline(this.trip.walking2Directions.points, this.map);
      GoogleMapsUtil.renderBicyclingPolyline(this.trip.bicyclingDirections.points, this.map);
    }

    if (this.originLatLng || this.destinationLatLng || this.trip) {
      this.fitBounds();
    }

    this.map.addListener('zoom_changed', this.addOrRemoveStationMarkers);
  }

  fitBounds() {
    const bounds = new google.maps.LatLngBounds();
    if (this.originLatLng) {
      bounds.extend(this.originLatLng);
    }
    if (this.destinationLatLng) {
      bounds.extend(this.destinationLatLng);
    }
    if (this.trip) {
      this.trip.walking1Directions.points.forEach(point => bounds.extend(point));
      this.trip.walking2Directions.points.forEach(point => bounds.extend(point));
      this.trip.bicyclingDirections.points.forEach(point => bounds.extend(point));
    }

    this.map.fitBounds(bounds, { top: 10, bottom: 10, right: 10, left: 10 });
  }

  createMarker(position: LatLng, station: boolean, stationIndex: number): Marker {
    const markerOptions = {
      position,
      title: `station-marker-${stationIndex}`,
      optimized: true,
      map: this.map,
      icon: {
        url: station
          ? '/assets/imgs/station.svg'
          : '/assets/imgs/pin.svg'
      },
      zIndex: station ? 10 : 20
    };

    if (environment.test) {
      markerOptions.optimized = false;
    }
    return new google.maps.Marker(markerOptions);
  }

  handleInfoWindowButtonClick = (direction: string, stationIndex: number) => {
    const station: StationInfo = this.stations[stationIndex];
    if (direction === 'from') {
      this.store.dispatch(chooseOriginLocation({ location: station.address }));
      this.store.dispatch(saveOriginLatLng({ latlng: { lat: station.lat, lng: station.lng }}));
    } else { // direction === 'to'
      this.store.dispatch(chooseDestinationLocation({ location: station.address }));
      this.store.dispatch(saveDestinationLatLng({ latlng: { lat: station.lat, lng: station.lng }}));
    }
    if (this.openWindow) {
      this.openWindow.close();
    }
  }

  createInfoWindow(address: string, description: string, station: boolean, stationIndex?: number): InfoWindow {
    let content = `
<div id="marker-info-window" style="margin-right: 10px, margin-bottom: 10px">
<h5>${description}:</h5><p>${address}</p>`;

    if (station) {
      content += `
<ion-buttons slot="primary">
  <ion-button
    id="from-station"
    fill="solid"
    color="dark"
    expand="full"
    onclick="handleInfoWindowButtonClick('from', ${stationIndex})">
    From here
  </ion-button>
  <ion-button
    id="to-station"
    fill="solid"
    color="dark"
    expand="full"
    onclick="handleInfoWindowButtonClick('to', ${stationIndex})">
    To here
  </ion-button>
</ion-buttons>`;
    }
    content += '</div>';
    return new google.maps.InfoWindow({ content, width: 200, height: 200 });
  }

  addMarker(position: LatLng, address: string, description: string, station: boolean, stationIndex?: number): Marker {
    const marker = this.createMarker(position, station, stationIndex);
    const infoWindow = this.createInfoWindow(address, description, station, stationIndex);

    marker.addListener('click', () => {
      if (this.openWindow) {
        this.openWindow.close();
      }
      this.openWindow = infoWindow;
      this.openWindow.open(this.map, marker);
    });

    return marker;
  }
}
