import { TripDetails } from '../trip-details.model';
import { LatLng } from '../latlng.model';

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const totalTripPrice = (trip: TripDetails): number => {
    return trip.startReservation.price
    + trip.endReservation.price
    + trip.rentalPrice;
};

export const totalTripDuration = (trip: TripDetails): number => {
    return trip.bicyclingDirections.seconds
    + trip.walking1Directions.seconds
    + trip.walking2Directions.seconds;
};

export const totalTripDistance = (trip: TripDetails): number => {
    return trip.walking2Directions.feet
    + trip.walking1Directions.feet
    + trip.bicyclingDirections.feet;
};

export const latLngEquals = (a: LatLng, b: LatLng) => {
    return a && b && a.lat === b.lat && a.lng === b.lng;
};

export const addSeconds = (date: Date, seconds: number): Date => {
    const a = new Date(date);
    a.setSeconds(date.getSeconds() + seconds);
    return a;
};

