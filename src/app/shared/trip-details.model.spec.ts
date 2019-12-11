import { mockTrips } from 'src/testing/mock-trips';
import { TripDetails } from './trip-details.model';
import { DateUtil } from '../shared/util/util';

describe('Trip details', () => {
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

    it('should return \'ACTIVE\' status if the trip is currently active (within reservation window)', (done) => {
        const newTrip = new TripDetails(
            mockTrips[0].originLatLng,
            mockTrips[0].originAddress,
            mockTrips[0].departureTime,
            mockTrips[0].walking1Directions,
            {
                ...mockTrips[0].startReservation,
                time: new Date().toString()
            },
            mockTrips[0].bicyclingDirections,
            mockTrips[0].rentalPrice,
            mockTrips[0].endReservation,
            mockTrips[0].walking2Directions,
            mockTrips[0].destinationLatLng,
            mockTrips[0].destinationAddress,
            DateUtil.addSeconds(new Date(), 10000).toString()
        );
        setTimeout(() => {
            expect(newTrip.status).toBe('Active');
            done();
        }, 10);
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
