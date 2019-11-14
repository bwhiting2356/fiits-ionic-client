export interface GeocodingResult {
    geometry: {
        location: {
            lat(): number,
            lng(): number
        };
    };
}
