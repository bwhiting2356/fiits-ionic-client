import { GeocodingResult, ReverseGeocodingResult } from '../app/shared/maps/geocoding-result';

export const mockGeocodingResults: GeocodingResult[] = [
    {
        geometry: {
            location: {
                lat: () => 1,
                lng: () => 1
            }
        }
    }
];

export const mockReverseGeocodingResults: ReverseGeocodingResult[] = [
    {
        formatted_address: '123 Main Street'
    }
];
