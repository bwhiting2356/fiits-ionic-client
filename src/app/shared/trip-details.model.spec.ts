import { mockTrips } from 'src/testing/mock-trips';
import { TripDetails } from './trip-details.model';
import { DateUtil } from '../shared/util/util';

import * as sinon from 'sinon';

describe('Trip details', () => {
    let sandbox;
    const now = new Date();

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        const twoMinutesFromNow = DateUtil.addSeconds(now, 60 * 2);
        sandbox.stub(DateUtil, 'getCurrentTime').returns(twoMinutesFromNow);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return \'COMPLETED\' status if the trip is in the past', () => {
        const newTrip = new TripDetails(
            mockTrips[0].originLatLng,
            mockTrips[0].originAddress,
            mockTrips[0].departureTime,
            mockTrips[0].walking1Directions,
            mockTrips[0].startReservation,
            mockTrips[0].bicyclingDirections,
            mockTrips[0].rentalPrice,
            mockTrips[0].endReservation,
            mockTrips[0].walking2Directions,
            mockTrips[0].destinationLatLng,
            mockTrips[0].destinationAddress,
            new Date(0).toString(), // time in the past
        );

        expect(newTrip.status).toBe('Completed');
    });

    it('should return \'Active\' status if the trip is currently active (within reservation window)', () => {
        const newTrip = new TripDetails(
            mockTrips[0].originLatLng,
            mockTrips[0].originAddress,
            mockTrips[0].departureTime,
            mockTrips[0].walking1Directions,
            {
                ...mockTrips[0].startReservation,
                time: now.toString()
            },
            mockTrips[0].bicyclingDirections,
            mockTrips[0].rentalPrice,
            mockTrips[0].endReservation,
            mockTrips[0].walking2Directions,
            mockTrips[0].destinationLatLng,
            mockTrips[0].destinationAddress,
            DateUtil.addSeconds(now, 10000).toString()
        );
        expect(newTrip.status).toBe('Active');

    });

    it('should return \'UPCOMING\' status if the trip is in the future', () => {
        const newTrip = new TripDetails(
            mockTrips[0].originLatLng,
            mockTrips[0].originAddress,
            DateUtil.addSeconds(new Date(), 1000000).toString(),
            mockTrips[0].walking1Directions,
            mockTrips[0].startReservation,
            mockTrips[0].bicyclingDirections,
            mockTrips[0].rentalPrice,
            mockTrips[0].endReservation,
            mockTrips[0].walking2Directions,
            mockTrips[0].destinationLatLng,
            mockTrips[0].destinationAddress,
            DateUtil.addSeconds(new Date(), 2000000).toString()
        );

        expect(newTrip.status).toBe('Upcoming');

    });
});
