import { capitalize, DateUtil } from './util';

describe('util', () => {
    it('should capitalize the word', () => {
        const original = 'upcoming';
        const capitalized = capitalize(original);
        expect(capitalized).toBe('Upcoming');
    });

    it('should add seconds to the time', () => {
        const time1 = new Date('2018-04-01T00:00:00.000Z');
        const time2 = new Date('2018-04-01T00:00:30.000Z');

        expect(DateUtil.addSeconds(time1, 30)).toEqual(time2);
    });
});
