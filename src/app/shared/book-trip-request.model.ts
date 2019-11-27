import { Trip } from './trip.model';

export interface BookTripRequestPayload {
    uid: string;
    trip: Trip;
}
