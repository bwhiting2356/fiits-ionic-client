import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { SearchActions, SearchActionTypes } from '../actions/search.actions';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { FeedbackActions, FeedbackActionTypes } from '../actions/feedback.actions';
import { AutocompleteActions, AutocompleteActionTypes } from '../actions/autocomplete.actions';

@Injectable()
export class ToastEffects {

    @Effect({ dispatch: false })
    fetchingStationError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.FetchAllStationsError),
        tap(_ => this.presentToast('Error fetching station info', 'danger'))
    );

    @Effect({ dispatch: false })
    searchQueryError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.TripSearchQueryError),
        tap(action => this.presentToast(
            action.error.error && action.error.error.message
                ? action.error.error.message
                : 'Error fetching trip info',
            'danger'
        ))
    );

    @Effect({ dispatch: false })
    geocodeError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.GeocodeError),
        tap(_ => this.presentToast('Error fetching location coordinates', 'danger'))
    );

    @Effect({ dispatch: false })
    autocompleteError$: Observable<any> = this.actions$.pipe(
        ofType(AutocompleteActionTypes. Error),
        tap(_ => this.presentToast('Error fetching locations', 'danger'))
    );

    @Effect({ dispatch: false })
    feedbackError$: Observable<any> = this.actions$.pipe(
        ofType(FeedbackActionTypes.FeedbackError),
        tap(_ => this.presentToast('Error sending feedback', 'danger'))
    );

    @Effect({ dispatch: false })
    bookTripError$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.BookTripFailure),
        tap(action => this.presentToast(
            action.error.error && action.error.error.message
                ? action.error.error.message
                : 'Error booking trip',
            'danger'
        ))
    );

    @Effect({ dispatch: false })
    bookTripSuccess$: Observable<any> = this.actions$.pipe(
        ofType(SearchActionTypes.BookTripSuccess),
        tap(_ => this.presentToast('Trip booked successfully!', 'success'))
    );

    @Effect({ dispatch: false })
    feedbackSuccess$: Observable<any> = this.actions$.pipe(
        ofType(FeedbackActionTypes.FeedbackSuccess),
        tap(_ => this.presentToast('Feedback sent successfully!', 'success'))
    );

    async presentToast(message, color) {
        const toast = await this.toastCtrl.create({
            message,
            color,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }
    constructor(
        private toastCtrl: ToastController,
        private actions$: Actions<SearchActions | FeedbackActions | AutocompleteActions>) {}
}
