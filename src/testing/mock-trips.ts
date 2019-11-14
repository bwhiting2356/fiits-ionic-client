import { Trip } from 'src/app/shared/trip.model';

export const mockTrips: Trip[] = [
    {
        originLatLng: {
            lat: 40.843647,
            lng: -74.003238
        },
        originAddress: 'Mock Origin',
        departureTime: '2018-12-15T21:00:40.000+0000',
        walking1Directions: {
            feet: 14175,
            seconds: 9635,
            points: [
                {
                    lat: 40.8435595,
                    lng: -74.0032447
                },
                {
                    lat: 40.8415525,
                    lng: -73.99727589999999
                },
                {
                    lat: 40.841883,
                    lng: -73.99923299999999
                },
                {
                    lat: 40.8415581,
                    lng: -73.99952329999999
                },
                {
                    lat: 40.8406128,
                    lng: -73.99791929999999
                },
                {
                    lat: 40.8352223,
                    lng: -73.9887166
                },
                {
                    lat: 40.8339244,
                    lng: -73.98952129999999
                },
                {
                    lat: 40.8313757,
                    lng: -73.9850945
                },
                {
                    lat: 40.8260315,
                    lng: -73.9874394
                },
                {
                    lat: 40.8071612,
                    lng: -73.9922696
                },
                {
                    lat: 40.8042829,
                    lng: -73.9933009
                },
                {
                    lat: 40.7885975,
                    lng: -74.0004124
                },
                {
                    lat: 40.7826662,
                    lng: -74.0081575
                },
                {
                    lat: 40.78162280000001,
                    lng: -74.0074372
                },
                {
                    lat: 40.7771343,
                    lng: -74.0109811
                },
                {
                    lat: 40.7767594,
                    lng: -74.0109413
                },
                {
                    lat: 40.7765525,
                    lng: -74.0105198
                },
                {
                    lat: 40.7765499,
                    lng: -74.0099082
                },
                {
                    lat: 40.7606545,
                    lng: -74.0032282
                },
                {
                    lat: 40.7598733,
                    lng: -74.0035259
                },
                {
                    lat: 40.7546455,
                    lng: -74.0070344
                },
                {
                    lat: 40.7546206,
                    lng: -74.0069654
                },
                {
                    lat: 40.7484385,
                    lng: -74.0079457
                },
                {
                    lat: 40.7469045,
                    lng: -74.00817289999999
                },
                {
                    lat: 40.7468704,
                    lng: -74.0077921
                },
                {
                    lat: 40.74603430000001,
                    lng: -74.0079469
                },
                {
                    lat: 40.744,
                    lng: -74.0031542
                },
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                }
            ]
        },
        startReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '867 Main Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: 0.75,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'PICKUP'
        },
        bicyclingDirections: {
            feet: 0,
            seconds: 0,
            points: [
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                },
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                }
            ]
        },
        rentalPrice: 0,
        endReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '123 Main Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: -0.45,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'DROPOFF',
        },
        walking2Directions: {
            feet: 1457,
            seconds: 1128,
            points: [
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                },
                {
                    lat: 40.744035,
                    lng: -74.0032372
                },
                {
                    lat: 40.7461102,
                    lng: -74.0079317
                },
                {
                    lat: 40.74960069999999,
                    lng: -74.0066241
                },
                {
                    lat: 40.753752,
                    lng: -74.0034519
                }
            ]
        },
        destinationLatLng: {
            lat: 40.753647,
            lng: -74.003238
        },
        destinationAddress: 'Mock Destination',
        arrivalTime: '2018-12-15T21:01:00.000+0000',
        status: null
    },
    {
        originLatLng: {
            lat: 40.843647,
            lng: -74.003238
        },
        originAddress: 'Mock Origin',
        departureTime: '2018-12-17T21:00:40.000+0000',
        walking1Directions: {
            feet: 14175,
            seconds: 9635,
            points: [
                {
                    lat: 40.8435595,
                    lng: -74.0032447
                },
                {
                    lat: 40.8415525,
                    lng: -73.99727589999999
                },
                {
                    lat: 40.841883,
                    lng: -73.99923299999999
                },
                {
                    lat: 40.8415581,
                    lng: -73.99952329999999
                },
                {
                    lat: 40.8406128,
                    lng: -73.99791929999999
                },
                {
                    lat: 40.8352223,
                    lng: -73.9887166
                },
                {
                    lat: 40.8339244,
                    lng: -73.98952129999999
                },
                {
                    lat: 40.8313757,
                    lng: -73.9850945
                },
                {
                    lat: 40.8260315,
                    lng: -73.9874394
                },
                {
                    lat: 40.8071612,
                    lng: -73.9922696
                },
                {
                    lat: 40.8042829,
                    lng: -73.9933009
                },
                {
                    lat: 40.7885975,
                    lng: -74.0004124
                },
                {
                    lat: 40.7826662,
                    lng: -74.0081575
                },
                {
                    lat: 40.78162280000001,
                    lng: -74.0074372
                },
                {
                    lat: 40.7771343,
                    lng: -74.0109811
                },
                {
                    lat: 40.7767594,
                    lng: -74.0109413
                },
                {
                    lat: 40.7765525,
                    lng: -74.0105198
                },
                {
                    lat: 40.7765499,
                    lng: -74.0099082
                },
                {
                    lat: 40.7606545,
                    lng: -74.0032282
                },
                {
                    lat: 40.7598733,
                    lng: -74.0035259
                },
                {
                    lat: 40.7546455,
                    lng: -74.0070344
                },
                {
                    lat: 40.7546206,
                    lng: -74.0069654
                },
                {
                    lat: 40.7484385,
                    lng: -74.0079457
                },
                {
                    lat: 40.7469045,
                    lng: -74.00817289999999
                },
                {
                    lat: 40.7468704,
                    lng: -74.0077921
                },
                {
                    lat: 40.74603430000001,
                    lng: -74.0079469
                },
                {
                    lat: 40.744,
                    lng: -74.0031542
                },
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                }
            ]
        },
        startReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '345 Victoria Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: 0.75,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'PICKUP'
        },
        bicyclingDirections: {
            feet: 0,
            seconds: 0,
            points: [
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                },
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                }
            ]
        },
        rentalPrice: 0,
        endReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '876 Main Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: -0.45,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'DROPOFF',
        },
        walking2Directions: {
            feet: 1457,
            seconds: 1128,
            points: [
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                },
                {
                    lat: 40.744035,
                    lng: -74.0032372
                },
                {
                    lat: 40.7461102,
                    lng: -74.0079317
                },
                {
                    lat: 40.74960069999999,
                    lng: -74.0066241
                },
                {
                    lat: 40.753752,
                    lng: -74.0034519
                }
            ]
        },
        destinationLatLng: {
            lat: 40.753647,
            lng: -74.003238
        },
        destinationAddress: 'Mock Destination',
        arrivalTime: '2020-12-17T21:01:40.000+0000',
        status: null
    },
    {
        originLatLng: {
            lat: 40.843647,
            lng: -74.003238
        },
        originAddress: 'Mock Origin',
        departureTime: '2019-01-15T21:00:40.000+0000',
        walking1Directions: {
            feet: 14175,
            seconds: 9635,
            points: [
                {
                    lat: 40.8435595,
                    lng: -74.0032447
                },
                {
                    lat: 40.8415525,
                    lng: -73.99727589999999
                },
                {
                    lat: 40.841883,
                    lng: -73.99923299999999
                },
                {
                    lat: 40.8415581,
                    lng: -73.99952329999999
                },
                {
                    lat: 40.8406128,
                    lng: -73.99791929999999
                },
                {
                    lat: 40.8352223,
                    lng: -73.9887166
                },
                {
                    lat: 40.8339244,
                    lng: -73.98952129999999
                },
                {
                    lat: 40.8313757,
                    lng: -73.9850945
                },
                {
                    lat: 40.8260315,
                    lng: -73.9874394
                },
                {
                    lat: 40.8071612,
                    lng: -73.9922696
                },
                {
                    lat: 40.8042829,
                    lng: -73.9933009
                },
                {
                    lat: 40.7885975,
                    lng: -74.0004124
                },
                {
                    lat: 40.7826662,
                    lng: -74.0081575
                },
                {
                    lat: 40.78162280000001,
                    lng: -74.0074372
                },
                {
                    lat: 40.7771343,
                    lng: -74.0109811
                },
                {
                    lat: 40.7767594,
                    lng: -74.0109413
                },
                {
                    lat: 40.7765525,
                    lng: -74.0105198
                },
                {
                    lat: 40.7765499,
                    lng: -74.0099082
                },
                {
                    lat: 40.7606545,
                    lng: -74.0032282
                },
                {
                    lat: 40.7598733,
                    lng: -74.0035259
                },
                {
                    lat: 40.7546455,
                    lng: -74.0070344
                },
                {
                    lat: 40.7546206,
                    lng: -74.0069654
                },
                {
                    lat: 40.7484385,
                    lng: -74.0079457
                },
                {
                    lat: 40.7469045,
                    lng: -74.00817289999999
                },
                {
                    lat: 40.7468704,
                    lng: -74.0077921
                },
                {
                    lat: 40.74603430000001,
                    lng: -74.0079469
                },
                {
                    lat: 40.744,
                    lng: -74.0031542
                },
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                }
            ]
        },
        startReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '345 Victoria Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: 0.75,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'PICKUP'
        },
        bicyclingDirections: {
            feet: 0,
            seconds: 0,
            points: [
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                },
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                }
            ]
        },
        rentalPrice: 0,
        endReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '234 Market Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: -0.45,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'DROPOFF',
        },
        walking2Directions: {
            feet: 1457,
            seconds: 1128,
            points: [
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                },
                {
                    lat: 40.744035,
                    lng: -74.0032372
                },
                {
                    lat: 40.7461102,
                    lng: -74.0079317
                },
                {
                    lat: 40.74960069999999,
                    lng: -74.0066241
                },
                {
                    lat: 40.753752,
                    lng: -74.0034519
                }
            ]
        },
        destinationLatLng: {
            lat: 40.753647,
            lng: -74.003238
        },
        destinationAddress: 'Mock Destination',
        arrivalTime: '2020-01-15T21:01:40.000+0000',
        status: null
    },
    {
        originLatLng: {
            lat: 40.843647,
            lng: -74.003238
        },
        originAddress: 'Mock Origin',
        departureTime: '2019-11-16T21:00:40.000+0000',
        walking1Directions: {
            feet: 14175,
            seconds: 9635,
            points: [
                {
                    lat: 40.8435595,
                    lng: -74.0032447
                },
                {
                    lat: 40.8415525,
                    lng: -73.99727589999999
                },
                {
                    lat: 40.841883,
                    lng: -73.99923299999999
                },
                {
                    lat: 40.8415581,
                    lng: -73.99952329999999
                },
                {
                    lat: 40.8406128,
                    lng: -73.99791929999999
                },
                {
                    lat: 40.8352223,
                    lng: -73.9887166
                },
                {
                    lat: 40.8339244,
                    lng: -73.98952129999999
                },
                {
                    lat: 40.8313757,
                    lng: -73.9850945
                },
                {
                    lat: 40.8260315,
                    lng: -73.9874394
                },
                {
                    lat: 40.8071612,
                    lng: -73.9922696
                },
                {
                    lat: 40.8042829,
                    lng: -73.9933009
                },
                {
                    lat: 40.7885975,
                    lng: -74.0004124
                },
                {
                    lat: 40.7826662,
                    lng: -74.0081575
                },
                {
                    lat: 40.78162280000001,
                    lng: -74.0074372
                },
                {
                    lat: 40.7771343,
                    lng: -74.0109811
                },
                {
                    lat: 40.7767594,
                    lng: -74.0109413
                },
                {
                    lat: 40.7765525,
                    lng: -74.0105198
                },
                {
                    lat: 40.7765499,
                    lng: -74.0099082
                },
                {
                    lat: 40.7606545,
                    lng: -74.0032282
                },
                {
                    lat: 40.7598733,
                    lng: -74.0035259
                },
                {
                    lat: 40.7546455,
                    lng: -74.0070344
                },
                {
                    lat: 40.7546206,
                    lng: -74.0069654
                },
                {
                    lat: 40.7484385,
                    lng: -74.0079457
                },
                {
                    lat: 40.7469045,
                    lng: -74.00817289999999
                },
                {
                    lat: 40.7468704,
                    lng: -74.0077921
                },
                {
                    lat: 40.74603430000001,
                    lng: -74.0079469
                },
                {
                    lat: 40.744,
                    lng: -74.0031542
                },
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                }
            ]
        },
        rentalPrice: 0,
        startReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '236 Main Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: 0.75,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'PICKUP'
        },
        bicyclingDirections: {
            feet: 0,
            seconds: 0,
            points: [
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                },
                {
                    lat: 40.7437156,
                    lng: -74.0034052
                }
            ]
        },
        endReservation: {
            station: {
                id: 1,
                capacity: 10,
                currentInventory: 5,
                address: '576 Market Street',
                latLng: {
                    lat: 40.743647,
                    lng: -74.003238,
                }
            },
            price: -4.45,
            time: '2018-12-30T21:06:29.000+0000',
            reservationType: 'DROPOFF',
        },
        walking2Directions: {
            feet: 1457,
            seconds: 1128,
            points: [
                {
                    lat: 40.7436984,
                    lng: -74.0033634
                },
                {
                    lat: 40.744035,
                    lng: -74.0032372
                },
                {
                    lat: 40.7461102,
                    lng: -74.0079317
                },
                {
                    lat: 40.74960069999999,
                    lng: -74.0066241
                },
                {
                    lat: 40.753752,
                    lng: -74.0034519
                }
            ]
        },
        destinationLatLng: {
            lat: 40.753647,
            lng: -74.003238
        },
        destinationAddress: 'Mock Destination',
        arrivalTime: '2020-11-16T21:01:40.000+0000',
        status: null
    }

];
