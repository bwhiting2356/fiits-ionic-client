import { LatLng } from './latlng.model';
import { TimeTarget } from './time-target.model';

export class SearchQuery {
    originLatLng: LatLng;
    originAddress: string;
    destinationLatLng: LatLng;
    destinationAddress: string;
    time: Date;
    timeTarget: TimeTarget;
}

