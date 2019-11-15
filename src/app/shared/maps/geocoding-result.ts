export interface GeocodingResult {
    geometry: {
        location: {
            lat(): number,
            lng(): number
        };
    };
}

export interface ReverseGeocodingResult {
    formatted_address: string;
}
