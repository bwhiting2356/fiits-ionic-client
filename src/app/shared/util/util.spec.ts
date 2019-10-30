import { capitalize } from './util';

describe('util', () => {
    it('should capitalize the word', () => {
        const original = 'upcoming';
        const capitalized = capitalize(original);
        expect(capitalized).toBe('Upcoming');
    })
})