import { LatLng } from './latlng.model';

export interface DirectionsInfo {
    feet: number;
    seconds: number;
    points: LatLng[];
    price?: number;
}

export interface StationInfo {
    id: number;
    capacity: number;
    currentInventory: number;
    address: string;
    latLng: LatLng;
}

export type ReservationType = 'PICKUP' | 'DROPOFF';

export interface ReservationInfo {
    price: number;
    time: string;
    reservationType: ReservationType;
    station: StationInfo;
}

export class Trip {
    originLatLng: LatLng;
    originAddress: string;
    departureTime: string;
    walking1Directions: DirectionsInfo;
    startReservation: ReservationInfo;
    bicyclingDirections: DirectionsInfo;
    rentalPrice: number;
    endReservation: ReservationInfo;
    walking2Directions: DirectionsInfo;
    destinationLatLng: LatLng;
    destinationAddress: string;
    arrivalTime: string;
    status: string;
}
