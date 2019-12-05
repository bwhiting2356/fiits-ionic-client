import { Action } from '@ngrx/store';
import { TripDetails } from '../shared/trip-details.model';

export enum TripActionTypes {
    BookTripRequest = '[Trip] Book Trip Request',
    BookTripSuccess = '[Trip]  Book Trip Success',
    BookTripFailure = '[Trip]  Book Trip Failure'
}

export class BookTripRequest implements Action {
    readonly type = TripActionTypes.BookTripRequest;
    constructor(public trip: TripDetails, public uid: string) {}
}

export class BookTripSuccess implements Action {
    readonly type = TripActionTypes.BookTripSuccess;
}

export class BookTripFailure implements Action {
    readonly type = TripActionTypes.BookTripFailure;
    constructor(public error: any) {}
}

export type TripActions = BookTripRequest | BookTripSuccess | BookTripFailure;
