import { capitalize, totalTripDuration, totalTripDistance, totalTripPrice, addSeconds } from './util';
import { mockTrips } from 'src/testing/mock-trips';

describe('util', () => {
    it('should capitalize the word', () => {
        const original = 'upcoming';
        const capitalized = capitalize(original);
        expect(capitalized).toBe('Upcoming');
    });

    it('should calculate the total duration', () => {
        const trip = mockTrips[0];
        const duration = totalTripDuration(trip);
        expect(duration).toBe(10763);
    });

    it('should calculate the total distance', () => {
        const trip = mockTrips[0];
        const distance = totalTripDistance(trip);
        expect(distance).toBe(15632);
    });

    it('should calculate the total price', () => {
        const trip = mockTrips[0];
        const price = totalTripPrice(trip);
        expect(price).toBe(0.3);
    });

    it('should add seconds to the time', () => {
        const time1 = new Date('2018-04-01T00:00:00.000Z');
        const time2 = new Date('2018-04-01T00:00:30.000Z');

        expect(addSeconds(time1, 30)).toEqual(time2);
    });
});
