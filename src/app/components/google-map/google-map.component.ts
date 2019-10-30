import { MapsAPILoader } from '@agm/core';

import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { GestureHandling } from 'src/app/shared/maps/gesture-handling';

import { GoogleMap, Marker, InfoWindow } from '@agm/core/services/google-maps-types';
import { GoogleMapsUtil } from 'src/app/shared/maps/google-maps-util';
import { DEFAULT_LOCATION } from 'src/app/shared/constants';
import { Trip, StationInfo } from 'src/app/shared/trip.model';
import { LatLng } from 'src/app/shared/latlng.model';

declare var google;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit, OnChanges {
  @ViewChild('mapContainer', {static: false}) mapContainer: ElementRef;
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
  @Input() trip: Trip;

  @Input() stations: StationInfo[];
  @Input() collapsed = false; // this is only here to trigger change detection when the size changes
  map: GoogleMap;
  stationMarkers: Marker[] = [];
  openWindow: InfoWindow;

  constructor(private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges() {
    this.initMap();
  }

  addOrRemoveStationMarkers() {
    if (this.stations && this.map.getZoom() >= 14) {
      this.stations.forEach(station => {
        const { address, latLng } = station;
        const marker = this.addMarker(latLng, address, 'Station', true);
        this.stationMarkers.push(marker);
      });
    } else {
      this.stationMarkers.forEach(marker => marker.setMap(null));
      this.stationMarkers = [];
    }
  }

  async initMap() {
    await this.mapsAPILoader.load();
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: this.zoom,
      maxZoom: 16,
      center: this.center || new google.maps.LatLng(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng),
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

    if (this.originLatLng) {
      this.addMarker(this.originLatLng, this.originAddress, 'Origin', );
    }
    if (this.destinationLatLng) {
      this.addMarker(this.destinationLatLng, this.destinationAddress, 'Destination');
    }

    this.addOrRemoveStationMarkers();

    if (this.trip) {
      GoogleMapsUtil.renderWalkingPolyline(this.trip.walking1Directions.points, this.map);
      GoogleMapsUtil.renderWalkingPolyline(this.trip.walking2Directions.points, this.map);
      GoogleMapsUtil.renderBicyclingPolyline(this.trip.bicyclingDirections.points, this.map);

      // TODO: add station markers?
    }

    if (this.originLatLng || this.destinationLatLng || this.trip) {
      this.fitBounds();
    }
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
      this.trip.bicyclingDirections.points.forEach(point => bounds.extend(point))
    }

    this.map.fitBounds(bounds);
  }

  createMarker(position: LatLng, station): Marker {
    return new google.maps.Marker({
      position,
      map: this.map,
      icon: {
        url: station
          ? '/assets/imgs/station.svg'
          : '/assets/imgs/pin.svg'
      }
    });
  }

  createInfoWindow(address: string, description: string): InfoWindow {
    const content = `
      <h5>${description}:</h5>
      <p>${address}</p>
    `;
    return new google.maps.InfoWindow({ content });
  }

  addMarker(position: LatLng, address: string, description: string, station = false): Marker {
    const marker = this.createMarker(position, station);
    const infoWindow = this.createInfoWindow(address, description);

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
