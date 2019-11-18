import { mock } from 'ts-mockito';

import { GoogleMapsUtil } from './google-maps-util';
import { GoogleMap, Polyline } from '@agm/core/services/google-maps-types';

declare var google;

describe('PolylineHelper', () => {
    it('should render a bicycling polyline', () => {
        const points = [
            new google.maps.LatLng(1, 1),
            new google.maps.LatLng(2, 2)
        ];
        const line = GoogleMapsUtil.createBicyclingMainPolyline(points);
        expect(line.getPath().getAt(0).lat()).toEqual(1);
        expect(line.getPath().getAt(0).lng()).toEqual(1);
        expect(line.getPath().getAt(1).lat()).toEqual(2);
        expect(line.getPath().getAt(1).lng()).toEqual(2);
        expect((line as any).strokeColor).toBe('#0cd1e8');
    });

    it('should render a bicycling polyline border', () => {
        const points = [
            new google.maps.LatLng(1, 1),
            new google.maps.LatLng(2, 2)
        ];
        const line = GoogleMapsUtil.createBicyclingBorderPolyline(points);
        expect(line.getPath().getAt(0).lat()).toEqual(1);
        expect(line.getPath().getAt(0).lng()).toEqual(1);
        expect(line.getPath().getAt(1).lat()).toEqual(2);
        expect(line.getPath().getAt(1).lng()).toEqual(2);
        expect((line as any).strokeColor).toBe('#3880ff');
    });

    it('should render a walking polyline', () => {
        const points = [
            new google.maps.LatLng(1, 1),
            new google.maps.LatLng(2, 2)
        ];
        const line = GoogleMapsUtil.createWalkingMainPolyline(points);
        expect(line.getPath().getAt(0).lat()).toEqual(1);
        expect(line.getPath().getAt(0).lng()).toEqual(1);
        expect(line.getPath().getAt(1).lat()).toEqual(2);
        expect(line.getPath().getAt(1).lng()).toEqual(2);
        expect((line as any).strokeColor).toBe('white');
    });

    it('should render a walking polyline border', () => {
        const points = [
            new google.maps.LatLng(1, 1),
            new google.maps.LatLng(2, 2)
        ];
        const line = GoogleMapsUtil.createWalkingBorderPolyline(points);
        expect(line.getPath().getAt(0).lat()).toEqual(1);
        expect(line.getPath().getAt(0).lng()).toEqual(1);
        expect(line.getPath().getAt(1).lat()).toEqual(2);
        expect(line.getPath().getAt(1).lng()).toEqual(2);
        expect((line as any).strokeColor).toBe('black');
    });

    it('should create and set bicycling polyline set on the map', () => {
        const mockGoogleMap = mock<GoogleMap>();
        const mockMainPolyline = mock<Polyline>();
        const mockBorderPolyline = mock<Polyline>();
        spyOn(mockMainPolyline, 'setMap');
        spyOn(mockBorderPolyline, 'setMap');
        spyOn(GoogleMapsUtil, 'createBicyclingMainPolyline')
            .and.returnValue(mockMainPolyline);
        spyOn(GoogleMapsUtil, 'createBicyclingBorderPolyline')
            .and.returnValue(mockBorderPolyline);
        const points = [
            new google.maps.LatLng(1, 1),
            new google.maps.LatLng(2, 2)
        ];
        GoogleMapsUtil.renderBicyclingPolyline(points, mockGoogleMap);
        expect(mockMainPolyline.setMap).toHaveBeenCalledWith(mockGoogleMap);
        expect(mockBorderPolyline.setMap).toHaveBeenCalledWith(mockGoogleMap);
    });

    it('should create and set walking polyline set on the map', () => {
        const mockGoogleMap = mock<GoogleMap>();
        const mockMainPolyline = mock<Polyline>();
        const mockBorderPolyline = mock<Polyline>();
        spyOn(mockMainPolyline, 'setMap');
        spyOn(mockBorderPolyline, 'setMap');
        spyOn(GoogleMapsUtil, 'createWalkingMainPolyline')
            .and.returnValue(mockMainPolyline);
        spyOn(GoogleMapsUtil, 'createWalkingBorderPolyline')
            .and.returnValue(mockBorderPolyline);
        const points = [
            new google.maps.LatLng(1, 1),
            new google.maps.LatLng(2, 2)
        ];
        GoogleMapsUtil.renderWalkingPolyline(points, mockGoogleMap);
        expect(mockMainPolyline.setMap).toHaveBeenCalledWith(mockGoogleMap);
        expect(mockBorderPolyline.setMap).toHaveBeenCalledWith(mockGoogleMap);
    });
});
