import { GeocodingResult } from './geocoding-result';

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
