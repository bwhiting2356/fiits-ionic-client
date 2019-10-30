import { Polyline, GoogleMap } from '@agm/core/services/google-maps-types';
import { LatLng } from '../latlng.model';
declare var google;

export class GoogleMapsUtil {
    static createBicyclingMainPolyline(points: LatLng[]): Polyline {
        return new google.maps.Polyline({
            path: points,
            strokeColor: '#0cd1e8',
            strokeOpacity: 1,
            strokeWeight: 5,
            zIndex: 1,
          });
    }

    static createBicyclingBorderPolyline(points: LatLng[]) {
        return new google.maps.Polyline({
          path: points,
          strokeColor: '#3880ff',
          strokeOpacity: 1,
          strokeWeight: 7,
          zIndex: 0,
        });
    }

    static renderBicyclingPolyline(points: LatLng[], map: GoogleMap) {
        const main = GoogleMapsUtil.createBicyclingMainPolyline(points);
        main.setMap(map);
        const border = GoogleMapsUtil.createBicyclingBorderPolyline(points);
        border.setMap(map);
    }

    static createWalkingMainPolyline(points: LatLng[]) {
        const walkingLineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            scale: 4
        };

        return new google.maps.Polyline({
            path: points,
            strokeColor: 'white',
            strokeOpacity: 0,
            strokeWeight: 4,
            zIndex: 3,
            icons: [{
                icon: walkingLineSymbol,
                offset: '0',
                repeat: '15px'
            }],
        });
    }

    static createWalkingBorderPolyline(points: LatLng[]) {
        const walkingLineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            scale: 5
        };

        return new google.maps.Polyline({
            path: points,
            strokeColor: 'black',
            strokeOpacity: 0,
            strokeWeight: 5,
            zIndex: 2,
            icons: [{
                icon: walkingLineSymbol,
                offset: '0',
                repeat: '15px'
            }],
        });
    }

    static renderWalkingPolyline(points: LatLng[], map: GoogleMap) {
        const main = GoogleMapsUtil.createWalkingMainPolyline(points);
        main.setMap(map);
        const border = GoogleMapsUtil.createWalkingBorderPolyline(points);
        border.setMap(map);
    }
}
