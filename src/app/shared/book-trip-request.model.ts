import { TripDetails } from './trip-details.model';

export interface BookTripRequestPayload {
    uid: string;
    tripDetails: TripDetails;
}
