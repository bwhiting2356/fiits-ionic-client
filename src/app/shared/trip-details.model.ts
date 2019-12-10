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
    lat: number;
    lng: number;
}

export type ReservationType = 'PICKUP' | 'DROPOFF';

export interface ReservationInfo {
    price: number;
    time: string;
    reservationType: ReservationType;
    station: StationInfo;
}

export class TripDetails {
    constructor(
        public originLatLng: LatLng,
        public originAddress: string,
        public departureTime: string,
        public walking1Directions: DirectionsInfo,
        public startReservation: ReservationInfo,
        public bicyclingDirections: DirectionsInfo,
        public rentalPrice: number,
        public endReservation: ReservationInfo,
        public walking2Directions: DirectionsInfo,
        public destinationLatLng: LatLng,
        public destinationAddress: string,
        public arrivalTime: string,
        public status: string,
    ) {}

    get totalPrice(): number {
        return this.startReservation.price
            + this.endReservation.price
            + this.rentalPrice;
    }

    get totalDistance(): number {
        return this.walking1Directions.feet
            + this.walking2Directions.feet
            + this.bicyclingDirections.feet;
    }

    get totalDuration(): number {
        return this.walking1Directions.seconds
            + this.walking2Directions.seconds
            + this.bicyclingDirections.seconds;
    }
}
