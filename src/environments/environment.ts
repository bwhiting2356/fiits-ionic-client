// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  test: true,
  backendURL: 'https://fiits-backend.herokuapp.com',
  googleMapsKey: 'AIzaSyC6vr3LC6OgSjPeuso4dH2xNqdFAyA1NWs',
  firebaseConfig: {
    apiKey: 'AIzaSyDs1RSEr9YBPsM1zbf07bIxAfZzqg0Nx8U',
    authDomain: 'fiits.bike',
    databaseURL: 'https://bike-share-1517478720061.firebaseio.com',
    projectId: 'bike-share-1517478720061',
    storageBucket: 'bike-share-1517478720061.appspot.com',
    messagingSenderId: '847159394288',
    appId: '1:847159394288:web:976035855ff0cb26fc6735'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
