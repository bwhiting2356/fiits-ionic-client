import { Trip } from '../trip.model';

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const totalTripPrice = (trip: Trip): number => {
    return trip.startReservation.price
    + trip.endReservation.price
    + trip.rentalPrice;
};

export const totalTripDuration = (trip: Trip): number => {
    return trip.bicyclingDirections.seconds
    + trip.walking1Directions.seconds
    + trip.walking2Directions.seconds;
};

export const totalTripDistance = (trip: Trip): number => {
    return trip.walking2Directions.feet
    + trip.walking1Directions.feet
    + trip.bicyclingDirections.feet;
};