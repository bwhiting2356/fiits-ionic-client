import { LatLng } from '../latlng.model';

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const latLngEquals = (a: LatLng, b: LatLng) => {
    return a && b && a.lat === b.lat && a.lng === b.lng;
};

export class DateUtil {
    static getCurrentTime = () => new Date();
    static addSeconds = (date: Date, seconds: number): Date => {
        const a = new Date(date);
        a.setSeconds(date.getSeconds() + seconds);
        return a;
    }
    static subtractSeconds = (date: Date, seconds: number): Date => {
        const a = new Date(date);
        a.setSeconds(date.getSeconds() - seconds);
        return a;
    }
}

